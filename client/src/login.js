import { Component } from "react";
import axios from "./axios"; // because it's not available globally like in Vue!
import { Link } from "react-router-dom";

export default class Login extends Component {
    constructor() {
        super();
        this.state = {
            email: "",
            password: "",
            //error: false, // => general error
            error: "", // => specific errors
            mediaQuery1024px: window.matchMedia("(max-width:1024px)"), // .matches(t/f)
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    handleChange(e) {
        // console.log("this.state in Login/ handleChange: ", this.state)
        this.setState({
            [e.target.name]: e.target.value,
        });
    }

    handleClick() {
        //console.log("Login/ handleClick working!");
        axios
            .post("/login", this.state)
            .then(({ data }) => {
                //console.log("Login-data: ", data);
                //if (data.error) {
                if (!data.success) {
                    //this.setState({ error: true });
                    if (data.error == "!(email && password)") {
                        this.setState({
                            error: "Please fill in all fields!",
                        });
                    } else if (data.error == "!password || incorrect") {
                        this.setState({
                            error: "Password missing or incorrect!",
                        });
                    } else if (data.error == "!email || incorrect") {
                        this.setState({
                            error: "Email missing or incorrect!",
                        });
                    } else if (data.error == "true") {
                        this.setState({ error: "Ops, something went wrong!" });
                    }
                } else {
                    location.replace("/");
                }
            })
            .catch((err) => {
                console.error("err axios POST/login catch: ", err);
                //this.setState({ error: true });
                this.setState({ error: "Ops, something went wrong!" });
            });
    }

    render() {
        return (
            <section className="sectionR-L-RP_Container">
                <div
                    className={
                        !this.state.mediaQuery1024px.matches
                            ? "sectionR-L-RP"
                            : "sectionR-L-RP sectionR-L-RP1024"
                    }
                >
                    <h1
                        id="titles"
                        className={
                            !this.state.mediaQuery1024px.matches
                                ? null
                                : "titleLogin1024"
                        }
                    >
                        Log in
                    </h1>
                    <div className="registrationError">
                        {/* {this.state.error && (
                        <span>Ops, something went wrong!</span>
                    )} */}
                        {this.state.error && <span>{this.state.error}</span>}
                    </div>
                    <input
                        /* onChange={(e) => this.handleChange(e)} */
                        onChange={this.handleChange}
                        name="email"
                        placeholder="Email"
                        type="email"
                    />
                    <input
                        /* onChange={(e) => this.handleChange(e)} */
                        onChange={this.handleChange}
                        name="password"
                        placeholder="Password"
                        type="password"
                    />
                    {/* <button onClick={() => this.handleClick()}>Register</button> */}
                    <div className="loginBtnContainer loginBtnContainerMobile">
                        <button id="registerBtn" onClick={this.handleClick}>
                            Log in
                        </button>
                        <p>
                            Not a member? ☞{" "}
                            <Link to="/" className="loginLink loginLinkMobile">
                                Sign up!
                            </Link>
                        </p>
                        <p>
                            Forgot your password? ☞{" "}
                            <Link
                                to="/reset-password"
                                className="loginLink loginLinkMobile"
                            >
                                Reset password
                            </Link>
                        </p>
                    </div>
                </div>
            </section>
        );
    }
}
