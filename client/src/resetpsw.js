import { Component } from "react";
import axios from "./axios"; // because it's not available globally like in Vue!
import { Link } from "react-router-dom";

// ResetPassword must be a class component because it needs to have state
export default class ResetPassword extends Component {
    constructor() {
        super();
        this.state = {
            email: "",
            password: "",
            error: false,
            component: 3,
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleResetPassword = this.handleResetPassword.bind(this);
        this.handleVerifyPassword = this.handleVerifyPassword.bind(this);
    }

    handleChange(e) {
        // console.log("this.state in ResetPassword/ handleChange: ", this.state)
        this.setState({
            [e.target.name]: e.target.value,
        });
    }

    handleResetPassword() {
        //console.log("ResetPassword/ handleResetPassword working!");;
        axios
            .post("/reset-password", this.state)
            .then(({ data }) => {
                //console.log("ResetPassword-data: ", data);
                if (data.error) {
                    this.setState({
                        error: true,
                    });
                } else {
                    this.setState({
                        component: data.component,
                    });
                }
            })
            .catch((err) => {
                console.error("err axios POST/reset-password catch: ", err);
                this.setState({ error: true });
            });
    }

    handleVerifyPassword() {
        //console.log("ResetPassword/ handleVerifyPassword working!");;
        axios
            .post("/verify-password", this.state)
            .then(({ data }) => {
                //console.log("ResetPassword-data: ", data);
                if (data.error) {
                    this.setState({
                        error: true,
                    });
                } else {
                    this.setState({
                        component: data.component,
                    });
                }
            })
            .catch((err) => {
                console.error("err axios POST/verify-password catch: ", err);
                this.setState({ error: true });
            });
    }

    render() {
        return (
            <>
                <h1>Reset Password</h1>
                <div className="registrationError">
                    {this.state.error && (
                        <span>Ops, something went wrong!</span>
                    )}
                </div>
                <div>
                    {this.state.component === 1 && (
                        <>
                            <h4>
                                Please enter the email address with which you
                                registered
                            </h4>
                            <input
                                /* onChange={(e) => this.handleChange(e)} */
                                onChange={this.handleChange}
                                name="email"
                                placeholder="Email"
                                type="email"
                            />
                            {/* <button onClick={() => this.handleClick()}>Submit</button> */}
                            <button onClick={this.handleResetPassword}>
                                Submit
                            </button>
                            <p>
                                Remember your password?{" "}
                                <Link to="/login">Log in!</Link>
                            </p>
                        </>
                    )}
                </div>
                <div>
                    {this.state.component === 2 && (
                        <>
                            <h4>
                                Please enter the code you received by email:
                            </h4>
                            <input
                                /* onChange={(e) => this.handleChange(e)} */
                                onChange={this.handleChange}
                                name="code"
                                placeholder="Code"
                                type="text"
                            />
                            <h4>Please enter a new password:</h4>
                            <input
                                /* onChange={(e) => this.handleChange(e)} */
                                onChange={this.handleChange}
                                name="password"
                                placeholder="New Password"
                                type="password"
                            />
                            {/* <button onClick={() => this.handleResetPassword()}>Submit</button> */}
                            <button onClick={this.handleVerifyPassword}>
                                Submit
                            </button>
                        </>
                    )}
                </div>
                <div>
                    {this.state.component === 3 && (
                        <>
                            <h4>Success!</h4>
                            <p>
                                You can now{" "}
                                <Link to="/login">log in</Link> with your new password.
                            </p>
                        </>
                    )}
                </div>
            </>
        );
    }
}
