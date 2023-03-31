import React from "react";
import {
    Container, Col, Row, Alert,
} from "reactstrap";

import "./Login.css";
import { StoreContext } from "../StoreContext";

export default class Login extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            errorMsg: "",
            isLoading: false,
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value,
        });
    }

    async handleFormSubmit(e) {
        this.setState({ isLoading: true });
        const { apiService } = this.context;
        const { username, password } = this.state;

        e.preventDefault();

        try {
            if (!username || !password) {
                throw new Error("Please specify email address and password");
            }

            await apiService.login(username, password);
            this.setState({ isLoading: false });
        }
        catch (error) {
            this.setState({
                errorMsg: error.response ? "Login failed - please try again" : error.message,
                isLoading: false,
            });
        }
    }

    render() {
        const { isLoading } = this.state;
        const { errorMsg } = this.state;

        return (
            <div className="login-page">
                <Container>
                    <Row className="login-row">
                        <Col sm={{ size: 6, offset: 3 }} lg={{ size: 4, offset: 4 }}>
                            <div className="login-form">
                                <h3>Partner Login</h3>

                                <form onSubmit={this.handleFormSubmit}>
                                    <input
                                        placeholder="Username"
                                        name="username"
                                        type="text"
                                        onChange={this.handleChange}
                                    />
                                    <input
                                        placeholder="Password"
                                        name="password"
                                        type="password"
                                        onChange={this.handleChange}
                                    />

                                    <button className="primary" type="submit">
                                        {isLoading ? <div className="loader" /> : "Submit"}
                                    </button>

                                    {errorMsg[0]
                                    && (
                                        <Alert color="danger">
                                            {errorMsg}
                                        </Alert>
                                    )}
                                </form>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}

Login.contextType = StoreContext;
