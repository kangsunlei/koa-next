import fetch from 'isomorphic-unfetch';
import { Layout, Menu, Icon } from 'antd';
import React, { Component } from 'react';
import MyLayout from '../components/Layout';
import NoteContent from '../components/NoteContent';

const { Sider } = Layout;
const { SubMenu } = Menu;

class Files extends Component {
    constructor() {
        super();
        this.state = {
            notesList: {},
            currentNote: '',
            contentList: {},
            currentContent: ''
        };
    }

    componentWillMount = async () => {
        const sideData = await this.handleRequestFiles('Notebooks.json');
        const bookList = sideData && sideData.item && sideData.item.children;
        this.handleRequestSubMenu(bookList[0].uuid);

        this.setState({
            bookList
        });
    }

    handleRequestFiles = async (path) => {
        const res = await fetch(`http://localhost:3000/f/${path}`);
        const result = await res.json();
        return result;
    };

    handleRequestSubMenu = async (uuid) => {
        const { notesList } = this.state;
        const path = `${uuid}&data.json`;
        const noteNames = await this.handleRequestFiles(path);
        notesList[uuid] = noteNames && noteNames.item && noteNames.item.children;
        // this.handleRequestContent(uuid, notesList[uuid][0].uuid);
        this.setState({
            notesList,
            currentNote: uuid
        });
    }

    handleRequestContent = async (folderId, uuid) => {
        const { contentList } = this.state;
        const path = `${folderId}&${uuid}.json`;
        const content = await this.handleRequestFiles(path);
        contentList[uuid] = content && content.item;
        this.setState({
            contentList,
            currentContent: uuid
        });
    }

    handleTitleClick = ({ key }) => {
        const { notesList } = this.state;
        if (!notesList[key]) {
            this.handleRequestSubMenu(key);
        } else {
            this.setState({
                currentNote: key
            });
        }
    }

    handleMenuClick = ({ keyPath }) => {
        const { contentList } = this.state;
        if (!contentList[keyPath[0]]) {
            this.handleRequestContent(keyPath[1], keyPath[0]);
        } else {
            this.setState({
                currentContent: keyPath[0]
            });
        }
    }

    render() {
        const {
            bookList, notesList, currentNote, contentList, currentContent
        } = this.state;

        return (
            <MyLayout>
                <Layout style={{ minHeight: '100vh' }}>
                    <Sider style={{ overflow: 'auto', height: '100vh', position: 'fixed', left: 0 }}>
                        <Menu theme="dark" onClick={this.handleMenuClick} defaultOpenKeys={[currentNote]} defaultSelectedKeys={[currentContent]} mode="inline">
                            {bookList && bookList.map((child) => {
                                const { uuid, name } = child;
                                const title = <span><Icon type="file" /><span>{name}</span></span>;
                                return (
                                    <SubMenu
                                        key={uuid}
                                        title={title}
                                        onTitleClick={this.handleTitleClick}
                                    >
                                        {currentNote && notesList[currentNote] && notesList[currentNote].map((note) => {
                                            const { uuid: noteUuid, name: noteName } = note;
                                            return (
                                                <Menu.Item
                                                    key={noteUuid}
                                                    title={noteName}
                                                >{noteName}
                                                </Menu.Item>
                                            );
                                        })}
                                    </SubMenu>
                                );
                            })}
                        </Menu>
                    </Sider>
                    <Layout style={{ marginLeft: 200 }}>
                        {currentContent && contentList[currentContent] && <NoteContent content={contentList[currentContent]} />}
                    </Layout>
                </Layout>
            </MyLayout>
        );
    }
}

export default Files;
