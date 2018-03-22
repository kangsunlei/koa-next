import 'isomorphic-unfetch';
import Link from 'next/link';
import React, { Component } from 'react';
import Layout from '../components/Layout';

export default class MyPage extends Component {
    static async getInitialProps() {
        // eslint-disable-next-line no-undef
        const res = await fetch('http://localhost:3000/fetch');
        // const json = await res.json()
        return { a: res };
    }

    render() {
        return (
            <Layout>
                <Link href="/f">
                    <a>Quiver</a>
                </Link>
            </Layout>
        );
    }
}
