import axios from "axios";
import { Component } from "react";
import ProfilePic from "./profilepic";
import Uploader from "./uploader";
//import Profile from "./uploader";

// App must be a class component because it needs state and lifecycle methods (componentDidMount)
export default class App extends Component {
    // Props passes data down to any child component that might need it
    // NB: Props can only be passed from parents to children! NEVER the other way around!
    constructor() {
        super();
        this.state = {
            id: "",
            first: "",
            last: "",
            email: "",
            profile_pic: "",
            bio: "",
            uploaderIsVisible: false,
        };
        this.toggleUploader = this.toggleUploader.bind(this);
        this.setImage = this.setImage.bind(this);
    }

    // componentDidMount = Vue's "mounted" function
    componentDidMount() {
        //console.log("App/componentDidMount/component App mounted!");
        // use axios to make a request to the server
        // the server will have to retrieve information about the user
        // (the info we need is basically eerything EXEPT the password)
        // once we get a response from axios, store that data in the state of App
        axios
            .get("/user")
            .then(({ data }) => {
                console.log("componentDidMount data: ", data[0]);
                console.log("componentDidMount first: ", data[0].first); // undifined
                this.setState(
                    {
                        id: data[0].id,
                        first: data[0].first,
                        last: data[0].last,
                        email: data[0].email,
                        profile_pic: data[0].profile_pic,
                    },
                    () => {
                        console.table("App this.state: ", this.state);
                    }
                );
                /* this.setState({ ...data }, () => {
                    console.table("App this.state: ", this.state);
                }); */
            })
            .catch((err) => {
                console.error(
                    "err axios POST/App/componentDidMount catch: ",
                    err
                );
                //this.setState({ error: true });
            });
    }

    // Modal
    toggleUploader() {
        console.log("toggleUploader is running!");
        //console.log("uploaderIsVisible: ", uploaderIsVisible);
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
            profile_pic: newProfilePic,
        });
    }

    render() {
        //console.log("App/render/this.state.first: ", this.state.first);
        //console.log("App/render/this.state.last: ", this.state.last);
        /* console.log(
            "App/render/this.state.uploaderIsVisible: ",
            this.state.uploaderIsVisible
        ); */
        return (
            <>
                <header>
                    {/* <h1>App -L-</h1> */}
                    <img
                        className="theSocialNetworkLogo"
                        src="/img/theSocialNetworkLogo.png"
                        alt="header-App Logo"
                    />
                    <ProfilePic
                        /* firstName={this.state.first} */
                        first={this.state.first}
                        last={this.state.last}
                        profile_pic={this.state.profile_pic}
                        toggleUploader={this.toggleUploader}
                    />
                </header>

                {/* <Profile
                    first={this.state.first}
                    last={this.state.last}
                    profile_pic={this.state.profile_pic}
                    bio={this.state.bio}
                /> */}

                <main>
                    {this.state.uploaderIsVisible && (
                        <div className="modalUploader">
                            <Uploader
                                setImage={this.setImage}
                                /* toggleUploader={this.toggleUploader} */
                            />
                        </div>
                    )}
                </main>
            </>
        );
    }
}
