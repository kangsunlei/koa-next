const Koa = require('koa');
const next = require('next');
const Router = require('koa-router');
const compression = require('compression');
const koaConnect = require('koa-connect');
const fs = require('fs');

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

// const sleep = time => new Promise((resolve) => {
//     setTimeout(resolve, time);
// });

app.prepare()
    .then(() => {
        const server = new Koa();
        const router = new Router();

        router.get('/f/:name', async (ctx) => {
            const { params } = ctx;

            let reqPath = params.name.replace(/&/g, '/').split('?')[0];
            if (params.name === '0') {
                reqPath = '';
            }
            const filepath = `${__dirname}/data/${reqPath}`;

            const result = { path: reqPath.replace(/\//g, '&') };

            if (fs.existsSync(filepath)) {
                await new Promise((resolve, reject) => {
                    fs.stat(filepath, (err, stats) => {
                        if (err) {
                            result.error = 500;
                            reject();
                        } else if (stats.isFile()) {
                            fs.readFile(filepath, 'utf8', (fErr, data) => {
                                if (fErr) {
                                    reject();
                                    throw fErr;
                                }
                                try {
                                    result.success = true;
                                    result.item = JSON.parse(data);
                                } catch (error) {
                                    reject();
                                }
                                resolve();
                            });
                        } else {
                            reject();
                        }
                    });
                }).catch((e) => {
                    result.error = e;
                });
            } else {
                result.error = 404;
            }

            ctx.body = result;
        });

        router.get('/f', async (ctx) => {
            await app.render(ctx.req, ctx.res, '/files', {});
            ctx.respond = false;
        });

        router.get('/fetch', async (ctx) => {
            ctx.body = 'Hello World';
        });

        router.get('*', async (ctx) => {
            await handle(ctx.req, ctx.res);
            ctx.respond = false;
        });

        server.use(async (ctx, next) => {
            ctx.res.statusCode = 200;
            await next();
        });

        server.use(router.routes());
        server.use(koaConnect(compression()));
        server.listen(port, (err) => {
            if (err) {
                console.log(err);
            }
            console.log(`> Ready on http://localhost:${port}`);
        });
    });
