import React, { Component } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Scenes from './scenes';
import { ApolloProvider } from "react-apollo";
import DashboardLayout from "./layouts/Dashboard";
import LoginLayout from "./layouts/Login";
import { client } from './state'

class App extends Component {
  render() {
    return (
        <ApolloProvider client={client}>
            <Router>
                <div>
                    <DashboardLayout exact path="/" component={Scenes.Dashboard} />
                    <DashboardLayout exact path="/updates" wpPath="/update-core.php" component={Scenes.Dashboard} />
                    <DashboardLayout path="/posts" wpPath="/edit.php" component={Scenes.Posts} />
                    <DashboardLayout path="/profile" component={Scenes.Profile} />
                    <LoginLayout path="/sign-in" component={Scenes.Login} />
                    <LoginLayout path="/forgot-password" component={Scenes.ForgotPassword} />
                </div>
            </Router>
        </ApolloProvider>
    );
  }
}

export default App;
