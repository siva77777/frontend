import React from 'react';
import Axios from 'axios';
import App from '../App';
import { Button, DisplayText, FormLayout, TextField } from '@shopify/polaris';
import { BrowserRouter as Router, Route } from "react-router-dom";


class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userNameFieldValue: "",
            passwordFieldValue: "",
            user: "",
            showHomePage: false,
            errorMessage: ""
        }
    }
    render() {
        if (this.state.showHomePage) {
            return (
                <Router>
                    <Route path="/" render={(props) => <App {...props} token={this.state.token} user={this.state.user} />} />
                </Router>
            )
        } else {
            return (
                <div style={{ width: "330px", height: "694px", margin: "auto", top: "0%", bottom: "0%", left: "0%", right: "0%" }}>
                    <img src="src/images/srmHeavensLogo.png" width="124" height="94" style={{ display: "block", margin: "59px 103px", backgroundColor: "black" }} />
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
                            type="password"
                        />
                        <Button fullWidth primary onClick={this.handleLogin}>Login</Button>
                        {this.state.errorMessage ? <div style={{ textAlign: "center", color: "red" }}><DisplayText size="small">{this.state.errorMessage}</DisplayText></div> : null}
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
                var token = response.data.token;
                this.setState({ token: token, showHomePage: true, user: response.data.user });
            }
        }.bind(this)).catch(function (error) {
            this.setState({ errorMessage: error.response.data.message })
        }.bind(this));
    };
}

export default Login;