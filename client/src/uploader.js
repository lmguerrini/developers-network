import { Component } from "react";
import axios from "./axios";

// Uploader needs to be a class component so that it can have state
export default class Uploader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            image: "",
            error: false,
        };
        this.handleClick = this.handleClick.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    /*
    Uploader 3 functions:
    1. store the image the user selected in its own state
    2. send the file to the server
    3. let App know that there's a new profile picture, and that App needs to update its own state
    NB: App = only component which can update App's state
    */

    handleClick(e) {
        //console.log("this.props in Uploader: ", this.props);
        // setImage is called in Uploader but it runs in App!
        // component is called by:
        //this.props.setImage("I'm an argument being ");
        e.preventDefault();
        var formData = new FormData();
        formData.append("image", this.state.image); // file itself
        if (this.state.image) {
            axios
                .post("/upload", formData)
                .then(({ data }) => {
                    //console.log("data: ", data);
                    console.log("data: ", data.profile_pic);
                    if (data.error) {
                        this.setState({ error: true });
                    } else {
                        this.props.setImage(data.profile_pic);
                    }
                })
                .catch(function (error) {
                    console.log(
                        "error in axios Uploader/handleClick/ catch: ",
                        error
                    );
                    //this.setState({ error: true });
                });
        }
    }

    handleChange(e) {
        this.setState(
            {
                //[e.target.name]: e.target.value,
                image: e.target.files[0],
            },
            () =>
                console.log(
                    "Uploader handleChange this.state: ",
                    e.target.files[0]
                )
        );
    }

    render() {
        // props passed down from the parent (App) to its children (Uploader, in this case)
        //console.log("props in Uploader: ", this.props);
        return (
            <>
                <div className="registrationError">
                    {this.state.error && (
                        <span>Ops, something went wrong!</span>
                    )}
                </div>
                <h4>Here you can upload your profile picture:</h4>
                <input
                    name="image"
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={this.handleChange}
                />
                {/* <h1 onClick={() => this.handleClick()}>Uploader</h1> */}
                <button onClick={this.handleClick}>Upload</button>
            </>
        );
    }
}
