import { Component } from "react";
import axios from "axios"; // because it's not available globally like in Vue!

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

export default class Counter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            first: "",
            last: "",
            email: "",
            password: "",
            error: false,
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
        //console.log("event object: ", e);

        // take user's input and store it in state
        /* 
        We want the state to look like this: 
        {
            first: 'nome',
            last: 'cognome',
            email: 'some@email.com',
            password: 'psw'
        }
        */

        // I need to find out 2 things:
        // 1. what is the user typing?
        //console.log("e.target.value: ", e.target.value);
        // 2. which input field is the user typing in?
        //console.log("e.target.name: ", e.target.name);

        // now let's add this all to state:
        // setState is async, that's we're cons.log with a callback
        this.setState(
            {
                [e.target.name]: e.target.value,
            }
            //() => console.log("this.state in handleChange: ", this.state)
        );
        // console.log("this.state in handleChange: ", this.state)
    }

    handleClick() {
        //console.log("handleClick working!");
        //console.log("this: ", this);
        //console.log("this.state: ", this.state);

        // 1. send off user input to server using axios!
        axios
            .post("/registration", this.state)
            .then(({ data }) => {
                console.log("data: ", data);
                // 2. process the response
                // --- error: render error message
                // (2.1) put something in state that indicates there's an error
                // this could be something like error: true
                // (2.2) render an error message. We've to be carefull to only render an error message it there's an err
                // we're going to return the error conditionally
                if (data.error) {
                    this.setState({ error: true });
                } else {
                    // --- success: redirrect to "/": location.replace("/");
                    location.replace("/");
                }
            })
            .catch((err) => {
                console.error("err axios POST/registration catch: ", err);
                this.setState({ error: true });
            });
    }

    render() {
        return (
            <div>
                <h1>Registration</h1>
                <div className="registrationError">
                    {this.state.error && (
                        <span>Ops, something went wrong!</span>
                    )}
                </div>
                <input
                    /* onChange={(e) => this.handleChange(e)} */
                    onChange={this.handleChange}
                    name="first"
                    placeholder="First Name"
                    type="text"
                />
                <input
                    /* onChange={(e) => this.handleChange(e)} */
                    onChange={this.handleChange}
                    name="last"
                    placeholder="Last Name"
                    type="text"
                />
                <input
                    onChange={(e) => this.handleChange(e)}
                    /* onChange={this.handleChange} */
                    name="email"
                    placeholder="Email"
                    type="text"
                />
                <input
                    /* onChange={(e) => this.handleChange(e)} */
                    onChange={this.handleChange}
                    name="password"
                    placeholder="Password"
                    type="text"
                />
                {/* <button onClick={() => this.handleClick()}>Register</button> */}
                <button onClick={this.handleClick}>Register</button>
            </div>
        );
    }
}
