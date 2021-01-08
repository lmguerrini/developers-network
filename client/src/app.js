import { Component } from "react";
import axios from "./axios";
import ProfilePic from "./profilepic";
import Uploader from "./uploader";
import Profile from "./profile";
//import BioEditor from "./bioeditor";
// import BrowserRouter from "./browserrouter";
// import OtherProfile from "./otherprofile";

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
        this.componentDidMount = this.componentDidMount.bind(this);
        this.toggleModalUploader = this.toggleModalUploader.bind(this);
        this.setImage = this.setImage.bind(this);
        this.editBio = this.editBio.bind(this);
    }

    // componentDidMount = Vue's "mounted" function
    componentDidMount() {
        //console.log("App/componentDidMount/component App mounted!");
        // use axios to make a request to the server
        // the server will have to retrieve information about the user
        // once we get a response from axios, store that data in the state of App
        axios
            .get("/user")
            .then(({ data }) => {
                //console.log("componentDidMount data[0]: ", data[0]);
                this.setState(
                    {
                        // ...data[0]
                        id: data[0].id, // undefined
                        first: data[0].first,
                        last: data[0].last,
                        email: data[0].email,
                        profile_pic: data[0].profile_pic,
                        bio: data[0].bio,
                    },
                    () => {
                        //console.table("App this.state: ", this.state);
                        //console.table("App data[0]: ", data[0]);
                    }
                );
                /* this.setState({ ...data[0] }, () => {
                    console.table("App this.state: ", this.state);
                }); */
            })
            .catch((err) => {
                console.error(
                    "err axios POST/App/componentDidMount catch: ",
                    err
                );
                this.setState({ error: true });
            });
    }

    toggleModalUploader() {
        //console.log("toggleModalUploader is running!");
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
        this.setState({
            profile_pic: newProfilePic, // set new newProfilePic's url
            uploaderIsVisible: false, // close modal after newProfilePic updated
        });
    }

    editBio(newBio) {
        this.setState({
            bio: newBio, // update bio w/ new newBio
        });
    }

    render() {
        //console.log("App/render/this.state: ", this.state);
        return (
            <>
                {/* <BrowserRouter> */}
                <header>
                    {/* <h1>App -L-</h1> */}
                    <img
                        className="theSocialNetworkLogo"
                        src="/img/theSocialNetworkLogo.png"
                        alt="header-App Logo"
                    />
                    {
                        <ProfilePic
                            /* firstName={this.state.first} */
                            first={this.state.first}
                            last={this.state.last}
                            profile_pic={this.state.profile_pic}
                            toggleModalUploader={this.toggleModalUploader}
                        />
                    }
                </header>

                {/* <Route exact path="/" render {() => ( */}
                <section>
                    {/* <h1>[SECTION -Profile]</h1> */}
                    <Profile
                        id={this.state.id}
                        first={this.state.first}
                        last={this.state.last}
                        profile_pic={this.state.profile_pic}
                        toggleModalUploader={this.toggleModalUploader}
                        bio={this.state.bio}
                        editBio={this.editBio}
                    />
                </section>
                {/* )} */}

                {/* <Route path="/user/:id" compmonent={OtherProfile} /> */}
                {/* render for bonus feature, to visit other profile, see their friends and visit them
                <Route path="/uder/:id" render={(props) => (
                    <OtherProfile
                        match={props.match}
                        key={props.match.url}
                        history={props.history}
                    />
                )}  */}

                <section>
                    {/* <h1>[SECTION -Uploader]</h1> */}
                    {this.state.uploaderIsVisible && (
                        <div className="modalUploader">
                            <Uploader
                                setImage={this.setImage}
                                /* toggleModalUploader={this.toggleModalUploader} */
                            />
                        </div>
                    )}
                </section>
                {/* </BrowserRouter> */}
            </>
        );
    }
}
