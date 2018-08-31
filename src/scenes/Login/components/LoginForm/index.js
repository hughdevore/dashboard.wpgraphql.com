import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import {Mutation} from 'react-apollo'
import {Redirect} from 'react-router-dom'
import gql from 'graphql-tag'
import {Form, Icon, Input, Button, Checkbox} from 'antd'

const FormItem = Form.Item;

const LOGIN_MUTATION = gql`
mutation Login( $input:LoginInput! ) {
    login( input: $input ) {
        authToken
        refreshToken
        user {
            id
            userId
            firstName
            lastName
            avatar {
                url
            }
        }
    }
}
`;

class LoginForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            redirectToReferrer: false
        };

        this.login = this.login.bind(this);
        this.setLoginState = this.setLoginState.bind(this);
        this.setFormErrors = this.setFormErrors.bind(this);
    }

    setFormErrors = (error) => {

        const { form } = this.props;

        if (error.message === 'GraphQL error: incorrect_password') {
            form.setFields({
                password: {
                    value: null,
                    errors: [new Error('invalid password')]
                },
            });
        }

        if (error.message === 'GraphQL error: invalid_username') {
            form.setFields({
                username: {
                    value: null,
                    errors: [new Error('invalid username')]
                },
            });
        }
    };

    setLoginState = () => {
        this.setState({redirectToReferrer: true});
    };

    login = (data) => {
        if (data && data.login) {

            this.setLoginState();

            if (data.login.authToken) {
                localStorage.setItem('authToken', data.login.authToken);
            }
            if (data.login.refreshToken) {
                localStorage.setItem('refreshToken', data.login.refreshToken);
            }
        }
    };

    render() {
        const {form} = this.props;
        const {getFieldDecorator} = form;

        const {from} = this.props.location & this.props.location.state || {from: {pathname: "/"}};
        const {redirectToReferrer} = this.state;

        if (redirectToReferrer) {
            console.log( this.props );
            return <Redirect to={from}/>;
        }

        return (
            <Mutation
                mutation={LOGIN_MUTATION}
                onError={error => this.setFormErrors(error)}
                onCompleted={data => this.login(data)}
            >
                {(login) => (
                    <Form onSubmit={(e) => {

                        e.preventDefault();

                        localStorage.removeItem('authToken');
                        localStorage.removeItem('refreshToken');

                        this.props.form.validateFields((err, values) => {
                            if (!err) {
                                login({
                                    variables: {
                                        input: {
                                            username: values.username || null,
                                            password: values.password || null,
                                            clientMutationId: "Login"
                                        }
                                    }
                                })
                            }
                        });

                    }} className="login-form">
                        <FormItem>
                            {getFieldDecorator('username', {
                                rules: [{required: true, message: 'Please input your username!'}],
                            })(
                                <Input
                                    prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                    placeholder="Username"/>
                            )}
                        </FormItem>
                        <FormItem>
                            {getFieldDecorator('password', {
                                rules: [{required: true, message: 'Please input your Password!'}],
                            })(
                                <Input
                                    prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                    type="password" placeholder="Password"/>
                            )}
                        </FormItem>
                        <FormItem>
                            {getFieldDecorator('remember', {
                                valuePropName: 'checked',
                                initialValue: true,
                            })(
                                <Checkbox>Remember me</Checkbox>
                            )}
                            <Link className="login-form-forgot" to="/forgot-password">Forgot
                                password</Link>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                                Log in
                            </Button>
                            Or <a href="">register now!</a>
                        </FormItem>
                    </Form>
                )}
            </Mutation>
        );
    }
}

const WrappedLoginForm = Form.create()(LoginForm);

export default WrappedLoginForm;