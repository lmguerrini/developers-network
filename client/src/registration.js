import { Component } from "react";
import axios from "./axios"; // because it's not available globally like in Vue!
import { Link } from "react-router-dom";

// ["pseudo code"]:
// 1. render 4 input fields, button, and an error message if there is one
// 2. change handler to store user's input in state as they type
// 3. click handler to send user input to server
// 4. handle response from server
// --- error: if we receive an error from server, render an error message for the user
// --- success: redirect the user to '/' route
// optional: the error message you render can be as specific or generic as you like
// "somehting broke" or "you forgot to fill in the first input field"
// from the user experince side, generic error messages are often better (also to give less inputs to potential hackers)
// but specific errors are more difficult and is good as code exercise and is a common coding challange
// generic or specific = "form validation"

export default class Registration extends Component {
    constructor() {
        super();
        this.state = {
            first: "",
            last: "",
            email: "",
            password: "",
            //error: false, // => general error
            error: "", // => specific errors
        };

        // this "this" refers to Registration
        this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
        // but then:
        // onChange={this.handleChange}
        // not:
        // onChange={(e) => this.handleChange(e)}
    }

    handleChange(e) {
        //console.log("Registration/ handleChange");

        // now let's add this all to state:
        this.setState(
            {
                // e.target.name = which input field is the user typing in
                [e.target.name]: e.target.value,
                // e.target.value = what is the user typing
            }
            // setState is async, that's why we're cons.log with a callback
            //() => console.log("this.state in handleChange: ", this.state)
        );
        // console.log("this.state in handleChange: ", this.state)
    }

    handleClick() {
        //console.log("Registration/ handleClick working!");
        //console.log("this: ", this);
        //console.log("this.state: ", this.state);

        // 1. send off user input to server using axios!
        axios
            .post("/registration", this.state)
            .then(({ data }) => {
                console.log("data: ", data);

                //if (data.error) {
                if (!data.success) {
                    //this.setState({ error: true });
                    if (data.error == "!(first)") {
                        this.setState({
                            error: "Please fill in the 'First Name' field!",
                        });
                    } else if (data.error == "!(last)") {
                        this.setState({
                            error: "Please fill in the 'Last Name' field!",
                        });
                    } else if (data.error == "!(email)") {
                        this.setState({
                            error: "Please fill in the 'Email' field!",
                        });
                    } else if (data.error == "!(password)") {
                        this.setState({
                            error: "Please fill in the 'Password' field!",
                        });
                    } else if (
                        data.error == "!(first && last && email && password)"
                    ) {
                        this.setState({ error: "Please fill in all fields!" });
                    } else if (data.error == "users_email_check") {
                        this.setState({ error: "Please enter a valid email!" });
                    } else if (data.error == "users_email_key") {
                        this.setState({
                            error:
                                "It seems this email already exists in our database. Please try again!",
                        });
                    }
                } else {
                    // --- success: redirrect to "/": location.replace("/");
                    location.replace("/");
                }
            })
            .catch((err) => {
                console.error("err axios POST/registration catch: ", err);
                //this.setState({ error: true });
                this.setState({ error: "Ops, something went wrong!" });
            });
    }

    render() {
        return (
            <section className="sectionRegistrationContainer">
                <div className="sectionRegistration">
                    <h1 id="titles">Registration</h1>
                    <div className="registrationError">
                        {/* {this.state.error && (
                        <span>Ops, something went wrong!</span>
                    )} */}
                        {this.state.error && <span>{this.state.error}</span>}
                    </div>
                    <input
                        /* onChange={(e) => this.handleChange(e)} */
                        onChange={this.handleChange}
                        name="first"
                        placeholder="First Name.."
                        type="text"
                    />
                    <input
                        /* onChange={(e) => this.handleChange(e)} */
                        onChange={this.handleChange}
                        name="last"
                        placeholder="Last Name.."
                        type="text"
                    />
                    <input
                        /* onChange={(e) => this.handleChange(e)} */
                        onChange={this.handleChange}
                        name="email"
                        placeholder="Email.."
                        type="email"
                    />
                    <input
                        /* onChange={(e) => this.handleChange(e)} */
                        onChange={this.handleChange}
                        name="password"
                        placeholder="Password.."
                        type="password"
                    />
                    {/* <button onClick={() => this.handleClick()}>Register</button> */}
                    <button id="registerBtn" onClick={this.handleClick}>
                        Register
                    </button>
                    <p>
                        Already a member? ☞{" "}
                        <Link to="/login" className="loginLink">
                            Log in!
                        </Link>
                    </p>
                </div>
            </section>
        );
    }
}
