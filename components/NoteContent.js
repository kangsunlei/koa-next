import React from 'react';
import { Layout } from 'antd';
import Cell from './Cell';
import { formatDate } from '../common/common';

const { Header, Content } = Layout;

export default (props) => {
    const {
        title, created_at: createdAt, updated_at: updatedAt, tags, cells,
    } = props.content || {};
    return (
        <Layout>
            <Header style={{ background: '#fff', padding: '0 16px' }} >
                <h2>{title}</h2>
            </Header>
            <Content style={{ margin: '0 16px' }}>
                <p style={{ marginTop: '20px' }}>
                    {createdAt && <span style={{ marginRight: '20px' }}>创建于：{formatDate(createdAt * 1000, '%R')}</span>}
                    {updatedAt && <span>上一次修改于：{formatDate(updatedAt * 1000, '%R')}</span>}
                </p>
                <div className="tags">
                    {tags && tags.map(tag => <span>{tag}</span>)}
                </div>
                <div className="content">
                    {cells && cells.map((cell, idx) => <Cell key={idx} cell={cell} />)}
                </div>
            </Content>
        </Layout>
    );
};
