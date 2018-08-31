import React from 'react'
import { Route } from 'react-router'
import { Layout } from 'antd'

const { Content } = Layout;

const LoginLayout = ({component: Component, ...rest}) => (
    <Route {...rest} render={matchProps => (
        <Layout style={{ minHeight: '100vh' }}>
            <Content style={{ padding: '0 50px', minHeight: '100vh' }}>
                <Component {...matchProps}/>
            </Content>
        </Layout>
    )}/>
);

export default LoginLayout;