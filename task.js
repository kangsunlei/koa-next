const fs = require('fs');

const basePath = `${__dirname}/files/Quiver.qvlibrary`;

function readFile(folder, fileName) {
    const path = `${folder}/${fileName}`;
    const data = fs.readFileSync(path, 'utf8');
    const fileData = JSON.parse(data);
    const formatData = Object.assign({}, fileData);
    const {
        children,
        name,
        uuid,
        title,
        cells,
    } = fileData;

    if (!name && uuid) {
        formatData.name = uuid;
    }
    if (children) {
        children.forEach(({ uuid: childUuid }, idx) => {
            const forderPath = `${basePath}/${childUuid}.qvnotebook`;
            const childFileData = readFile(forderPath, 'meta.json');
            formatData.children[idx].name = childFileData.name;
        });
    }

    if (title && !cells) {
        const content = readFile(folder, 'content.json');
        Object.assign(formatData, content);
    }

    return formatData;
}

function writeFile(path, content) {
    const writerStream = fs.createWriteStream(path);
    writerStream.write(content, 'UTF8');
    writerStream.end();
}

function readFolder(path, uuid, name) {
    const forderMap = { uuid, name, children: [] };
    if (!fs.existsSync(`./data/${uuid}`)) {
        fs.mkdirSync(`./data/${uuid}`);
    }
    const folder = fs.readdirSync(path);
    folder.filter((folderName) => {
        const folderStat = fs.statSync(`${path}/${folderName}`);
        return folderStat.isDirectory();
    }).forEach((folderName) => {
        const fileData = readFile(`${path}/${folderName}`, 'meta.json');
        forderMap.children.push({ uuid: fileData.uuid, name: fileData.title });
        writeFile(`./data/${uuid}/${fileData.uuid}.json`, JSON.stringify(fileData));
    });

    writeFile(`./data/${uuid}/data.json`, JSON.stringify(forderMap));
}

const firstPart = readFile(basePath, 'meta.json');
writeFile(`./data/${firstPart.name}.json`, JSON.stringify(firstPart));

firstPart.children.forEach(({ uuid, name }) => {
    const forderPath = `${basePath}/${uuid}.qvnotebook`;
    readFolder(forderPath, uuid, name);
});
