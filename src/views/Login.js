import React from 'react';
import Axios from 'axios';
import App from '../App';
import { Button, FormLayout, TextField } from '@shopify/polaris';
import { BrowserRouter as Router, Route } from "react-router-dom";


class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userNameFieldValue: "",
            passwordFieldValue: "",
            showHomePage: false
        }
    }
    render() {
        if (this.state.showHomePage) {
            return (
                <Router>
                    <Route path="/" render={(props) => <App {...props} token={this.state.token} />} />
                </Router>
            )
        } else {
            return (
                <div style={{ position: "absolute", width: "330px", height: "694px", margin: "auto", top: "0%", bottom: "0%", left: "0%", right: "0%" }}>
                    <FormLayout>
                        <TextField
                            label="User Name"
                            value={this.state.userNameFieldValue}
                            onChange={this.handleUserNameFieldChange}
                            type="text"
                        />
                        <TextField
                            label="Password"
                            value={this.state.passwordFieldValue}
                            onChange={this.handlePasswordFieldChange}
                            type="text"
                        />
                        <Button fullWidth primary onClick={this.handleLogin}>Login</Button>
                    </FormLayout>
                </div>
            );
        }
    }
    handleUserNameFieldChange = (userNameFieldValue) => {
        this.setState({ userNameFieldValue });
    };

    handlePasswordFieldChange = (passwordFieldValue) => {
        this.setState({ passwordFieldValue });
    };
    handleLogin = () => {
        var apiBaseUrl = "http://www.srmheavens.com/erp/user/generateToken";
        var payload = {
            "uID": this.state.userNameFieldValue,
            "password": this.state.passwordFieldValue
        };
        Axios.post(apiBaseUrl, payload).then(function (response) {
            if (response.status == 200) {
                console.log(response.data.token, "111");
                var token = response.data.token;
                this.setState({ token: token, showHomePage: true });
            }
        }.bind(this))
    };
}

export default Login;