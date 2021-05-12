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
            component: 1,
            mediaQuery1024px: window.matchMedia("(max-width:1024px)"), // .matches(t/f)
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
            .post("/reset/password", this.state)
            .then(({ data }) => {
                console.log("ResetPassword-data: ", data);
                this.setState({
                    error: data.error, // t/f
                    component: data.component, // 1/2
                });
            })
            .catch((err) => {
                console.error("err axios POST/reset-password catch: ", err);
                this.setState({ error: true });
            });
    }

    handleVerifyPassword() {
        //console.log("ResetPassword/ handleVerifyPassword working!");;
        axios
            .post("/reset/password/verify", this.state)
            .then(({ data }) => {
                console.log("ResetPassword-data: ", data);
                this.setState({
                    error: data.error, // t/f
                    component: data.component, // 2/3
                });
            })
            .catch((err) => {
                console.error("err axios POST/verify-password catch: ", err);
                this.setState({ error: true });
            });
    }

    render() {
        return (
            <section className="sectionR-L-RP_Container resetPswContainer">
                <div
                    className={
                        !this.state.mediaQuery1024px.matches
                            ? "sectionR-L-RP"
                            : "sectionR-L-RP sectionR-L-RP1024"
                    }
                >
                    <div className="sectionResetPsw">
                        <h1
                            id="titles"
                            className={
                                !this.state.mediaQuery1024px.matches
                                    ? null
                                    : "titleResetPsw1024"
                            }
                        >
                            Reset Password
                        </h1>
                        <br></br>
                        <div className="registrationError">
                            {this.state.error && (
                                <span>Ops, something went wrong!</span>
                            )}
                        </div>
                        <div>
                            {this.state.component === 1 && (
                                <div
                                    className={
                                        !this.state.mediaQuery1024px.matches
                                            ? "resetPswComponents"
                                            : "resetPswComponents resetPswComponents1024"
                                    }
                                >
                                    <h4>Please enter your email</h4>
                                    <input
                                        /* onChange={(e) => this.handleChange(e)} */
                                        onChange={this.handleChange}
                                        name="email"
                                        placeholder="Email.."
                                        type="email"
                                    />
                                    {/* <button onClick={() => this.handleClick()}>Submit</button> */}
                                    <button
                                        id="registerBtn"
                                        onClick={this.handleResetPassword}
                                    >
                                        Submit
                                    </button>
                                    <p id="alreadyAmember">
                                        Remember your password? ☞{" "}
                                        <Link
                                            to="/login"
                                            className="loginLink loginLinkMobileR"
                                        >
                                            Log in!
                                        </Link>
                                    </p>
                                </div>
                            )}
                        </div>
                        <div>
                            {this.state.component === 2 && (
                                <div
                                    className={
                                        !this.state.mediaQuery1024px.matches
                                            ? "resetPswComponents"
                                            : "resetPswComponents resetPswComponents1024"
                                    }
                                >
                                    <h4 id="enterEmail">
                                        Please enter the code you received by
                                        email
                                    </h4>
                                    <input
                                        /* onChange={(e) => this.handleChange(e)} */
                                        onChange={this.handleChange}
                                        name="code"
                                        placeholder="Code"
                                        type="text"
                                    />
                                    <h4 id="enterPsw">
                                        Please enter a new password
                                    </h4>
                                    <input
                                        /* onChange={(e) => this.handleChange(e)} */
                                        onChange={this.handleChange}
                                        name="password"
                                        placeholder="New Password"
                                        type="password"
                                    />
                                    {/* <button onClick={() => this.handleResetPassword()}>Submit</button> */}
                                    <button
                                        id="registerBtn"
                                        className="component2btn"
                                        onClick={this.handleVerifyPassword}
                                    >
                                        Submit
                                    </button>
                                </div>
                            )}
                        </div>
                        <div>
                            {this.state.component === 3 && (
                                <div
                                    className={
                                        !this.state.mediaQuery1024px.matches
                                            ? "resetPswComponents"
                                            : "resetPswComponents resetPswComponents1024"
                                    }
                                >
                                    <h3>Success!</h3>
                                    <p
                                        id="enterEmail"
                                        className="component3Link backgroundTransparent"
                                    >
                                        You can now{" "}
                                        <Link
                                            to="/login"
                                            className="loginLink"
                                            id="component3Link"
                                        >
                                            log in
                                        </Link>{" "}
                                        with your new password.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}
