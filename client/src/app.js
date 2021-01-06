import { Component } from "react";
import ProfilePic from "./profilepic";
import Uploader from "./uploader";

export default class App extends Component {
    // props passes data down to any child component that might need it
    constructor(props) {
        super(props);
        this.state = {
            first: "Nome",
            last: "Cognome",
            uploaderIsVisible: false,
        };
        this.toggleUploader = this.toggleUploader.bind(this);
        this.setImage = this.setImage.bind(this);
    }

    // componentDidMount = Vue's "mounted" function
    componentDidMount() {
        console.log("App/componentDidMount/component App mounted!");
        // use axios to make a request to the server
        // the server will have to retrieve information about the user
        // (the info we need is basically eerything EXEPT the password)
        // once we get a response from axios, store that data in the state of App
    }

    toggleUploader() {
        console.log("toggleUploader is running!");
        console.log("uploaderIsVisible: ", uploaderIsVisible);
        /* if (!this.state.uploaderIsVisible) {
            this.setState({
                uploaderIsVisible: true,
            });
        } else {
            this.setState({
                uploaderIsVisible: false,
            });
        } */
        this.setState({
            uploaderIsVisible: !this.state.uploaderIsVisible,
        });
    }

    setImage(newProfilePic) {
        // I can call setImage from every App's children
        // but setImage will only update the state of App
        // regardless of which component it's called from
        console.log("newProfilePic: ", newProfilePic);
        this.setState({
            profilePic: "whatever the profile pic is",
        });
    }

    render() {
        console.log("App/render/this.state.first: ", this.state.first);
        console.log("App/render/this.state.last: ", this.state.last);
        console.log(
            "App/render/this.state.uploaderIsVisible: ",
            this.state.uploaderIsVisible
        );
        return (
            <>
                <h1>App</h1>
                <ProfilePic
                    /* firstName={this.state.first} */
                    first={this.state.first}
                    last={this.state.last}
                />
                {/* <h2 onClick={() => this.toggleUploader()}>
                    Demo:click here to toggle uploader
                </h2> */}
                <h2 onClick={this.toggleUploader}>
                    Demo:click here to toggle uploader
                </h2>
                {this.state.uploaderIsVisible && (
                    <Uploader setImage={this.setImage} />
                )}
            </>
        );
    }
}
