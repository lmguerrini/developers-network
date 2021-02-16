import { Component } from "react";
import axios from "./axios";

// Uploader needs to be a class component so that it can have state
export default class Uploader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            image: this.props.profile_pic,
            error: false,
        };
        this.handleUpdateImage = this.handleUpdateImage.bind(this);
        this.handleDeleteImage = this.handleDeleteImage.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleUpdateImage(e) {
        //console.log("Uploader props in handleUpdateImage: ", this.props);
        e.preventDefault();
        var formData = new FormData();
        formData.append("image", this.state.image); // file itself
        if (this.state.image) {
            axios
                .post("/upload", formData)
                .then(({ data }) => {
                    if (data.error) {
                        this.setState({ error: true });
                    } else {
                        // NB: setImage is called in Uploader but it runs in App!
                        console.log(
                            "[s3 uploader.js] data.profile_pic: ",
                            data.profile_pic
                        );
                        this.props.setImage(data.profile_pic);
                        
                        //this.props.toggleUploader();
                    }
                })
                .catch(function (error) {
                    console.log(
                        "error in axios POST Uploader/handleUpdateImage/ catch: ",
                        error
                    );
                    this.setState({ error: true });
                });
        }
    }

    handleDeleteImage(e) {
        //console.log("deleteImage worked!");
        e.preventDefault();
        axios
            .post("/delete", this.state)
            .then(({ data }) => {
                if (data.error) {
                    this.setState({ error: true });
                } else {
                    // NB: setImage is called in Uploader but it runs in App!
                    this.props.setImage(data.urlNull); // profile_pic = null
                    //this.props.toggleUploader();
                }
            })
            .catch((err) => {
                console.error(
                    "error in axios POST Uploader/handleDeleteImage/ catch: ",
                    err
                );
                this.setState({ error: true });
            });
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
                <div className="uploaderContainer">
                    <div className="registrationError">
                        {this.state.error && (
                            <span>Ops, something went wrong!</span>
                        )}
                    </div>
                    <div id="welcomeBack">
                        <p>
                            <small id="uploaderSigns">❮</small> Upload your
                            profile picture
                            <small id="uploaderSigns"> ❯</small>
                        </p>
                    </div>
                    {/* <p>
                        <small id="uploaderSigns">❮</small> Upload your profile
                        picture
                        <small id="uploaderSigns"> ❯</small>
                    </p> */}
                    <input
                        name="image"
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={this.handleChange}
                    />
                    {/* <h1 onClick={() => this.handleClick()}>Upload</h1> */}
                    <button
                        id="uploaderUploadBtn"
                        onClick={this.handleUpdateImage}
                    >
                        Upload
                    </button>
                    {this.props.profile_pic && (
                        <p>
                            <small id="uploaderSigns">❮</small> or{" "}
                            <button
                                id="uploaderDeleteBtn"
                                onClick={this.handleDeleteImage}
                            >
                                Delete
                            </button>{" "}
                            it <small id="uploaderSigns">❯</small>
                        </p>
                    )}
                    <button
                        id="uploaderCloseBtn"
                        onClick={this.props.toggleModalUploader}
                    >
                        Close
                    </button>
                </div>
            </>
        );
    }
}

/*
    Uploader 3 functions:
    1. store the image the user selected in its own state
    2. send the file to the server
    3. let App know that there's a new profile picture, and that App needs to update its own state
    NB: App = only component which can update App's state
*/
