import React from 'react'
import {Route} from 'react-router'
import {Link, Redirect} from 'react-router-dom'
import gql from 'graphql-tag'
import {Query} from 'react-apollo'
import {Layout, Menu, Icon, Avatar} from 'antd';

const {SubMenu} = Menu;
const {Header, Content, Sider} = Layout;

const CURRENT_USER_QUERY = gql`
query CURRENT_USER {
    viewer {
        displayName: nickname
        avatar(size: 50) {
            url
        }
    }
}
`;

const DashboardLayout = ({component: Component, ...rest}) => {
    const AUTH_TOKEN = localStorage.getItem('authToken');
    return (
        <Route {...rest} render={( routerProps ) => AUTH_TOKEN ? (
            <Query
                query={CURRENT_USER_QUERY}
                onError={(errors) => {
                    localStorage.removeItem('authToken');
                    localStorage.removeItem('refreshToken');
                }}
            >
                {({loading, error, data}) => {

                    if (loading) return null;
                    if (error) return null;
                    const {viewer} = data;

                    return (
                        <Layout>
                            <Header className="header">
                                <div className="logo"/>
                                <Menu
                                    theme="dark"
                                    mode="horizontal"
                                    defaultSelectedKeys={['2']}
                                    style={{
                                        lineHeight: '64px',
                                        float: 'right'
                                    }}
                                >
                                    <Menu.Item key="1"><Link to="/">Dashboard</Link></Menu.Item>
                                    <Menu.Item key="2"><Link to="/posts">Posts</Link></Menu.Item>
                                    <Menu.Item key="3">
                                        <Link to="/sign-in">Login</Link>
                                    </Menu.Item>
                                    <SubMenu
                                        key="sub1"
                                        title={
                                            <Link
                                                to="/profile"
                                            >
                                                <span>
                                                    Howdy, {viewer.displayName || ''} <Avatar
                                                    src={viewer.avatar.url}/>
                                                </span>
                                            </Link>
                                        }
                                    >
                                        <Menu.Item
                                            key="1"
                                        >
                                            <Link
                                                to="/profile">Profile</Link>
                                        </Menu.Item>
                                        <Menu.Item
                                            key="2"
                                            onClick={() => {
                                                localStorage.removeItem('authToken');
                                                localStorage.removeItem('refreshToken');
                                                routerProps.history.push('/');
                                            }}
                                        >
                                            Logout
                                        </Menu.Item>
                                    </SubMenu>
                                </Menu>
                            </Header>
                            <Layout
                                style={{
                                    minHeight: 'calc(100vh - 64px)'
                                }}
                            >
                                <Sider width={200} style={{background: '#fff'}}>
                                    <Menu
                                        mode="inline"
                                        theme="dark"
                                        defaultSelectedKeys={['1']}
                                        defaultOpenKeys={['sub1']}
                                        style={{height: '100%', borderRight: 0}}
                                    >
                                        <SubMenu key="sub1"
                                                 title={<span><Icon type="user"/>Posts</span>}>
                                            <Menu.Item key="1">All Posts</Menu.Item>
                                            <Menu.Item key="2">Add New</Menu.Item>
                                        </SubMenu>
                                        <SubMenu key="sub2"
                                                 title={<span><Icon type="laptop"/>subnav 2</span>}>
                                            <Menu.Item key="5">option5</Menu.Item>
                                            <Menu.Item key="6">option6</Menu.Item>
                                            <Menu.Item key="7">option7</Menu.Item>
                                            <Menu.Item key="8">option8</Menu.Item>
                                        </SubMenu>
                                        <SubMenu key="sub3"
                                                 title={<span><Icon
                                                     type="notification"/>subnav 3</span>}>
                                            <Menu.Item key="9">option9</Menu.Item>
                                            <Menu.Item key="10">option10</Menu.Item>
                                            <Menu.Item key="11">option11</Menu.Item>
                                            <Menu.Item key="12">option12</Menu.Item>
                                        </SubMenu>
                                    </Menu>
                                </Sider>
                                <Layout style={{padding: '24px'}}>
                                    <Content style={{
                                        background: '#fff',
                                        padding: 24,
                                        margin: 0,
                                    }}>
                                        <Component {...rest}/>
                                    </Content>
                                </Layout>
                            </Layout>
                        </Layout>
                    )
                }}
            </Query>
        ) : (
            <Redirect
                to={{
                    pathname: "/sign-in",
                    state: {
                        from: routerProps.location
                    }
                }}
            />
        )
        }/>
    )
};

export default DashboardLayout;