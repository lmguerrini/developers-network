import { Component } from "react";
import axios from "./axios"; // because it's not available globally like in Vue!
import { Link } from "react-router-dom";

export default class Login extends Component {
    constructor() {
        super();
        this.state = {
            email: "",
            password: "",
            error: false,
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
        //console.log("Login/ handleClick working!");;
        axios
            .post("/login", this.state)
            .then(({ data }) => {
                //console.log("Login-data: ", data);
                if (data.error) {
                    this.setState({ error: true });
                } else {
                    location.replace("/");
                }
            })
            .catch((err) => {
                console.error("err axios POST/login catch: ", err);
                this.setState({ error: true });
            });
    }

    render() {
        return (
            <>
                <h1>Log in</h1>
                <div className="registrationError">
                    {this.state.error && (
                        <span>Ops, something went wrong!</span>
                    )}
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
                <div className="loginBtnContainer">
                    <button onClick={this.handleClick}>Log in</button>
                    <p>
                        Not a member? ☞ <Link to="/">Sign up!</Link> 
                    </p>
                    <p>
                        Forgot your password? ☞{" "}
                        <Link to="/reset-password">Reset password</Link> 
                    </p>
                </div>
            </>
        );
    }
}
