import { Component } from "react";
import axios from "./axios";
import { BrowserRouter, Route } from "react-router-dom";
import { Link } from "react-router-dom";
import ProfilePic from "./profilepic";
import Profile from "./profile";
import OtherProfile from "./otherprofile";
import FindPeople from "./findpeople";
import Friends from "./friends";
import Uploader from "./uploader";

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
        this.logout = this.logout.bind(this);
        this.toggleModalUploader = this.toggleModalUploader.bind(this);
        this.setImage = this.setImage.bind(this);
        this.editBio = this.editBio.bind(this);
    }

    // componentDidMount = Vue's "mounted" function
    /* componentDidMount() {
        console.log("App/componentDidMount/component App mounted!");
        // use axios to make a request to the server
        // the server will have to retrieve information about the user
        // once we get a response from axios, store that data in the state of App
        axios
            .get("/user/info")
            .then(({ data }) => {
                console.log("App componentDidMount data[0]: ", data[0]);
                console.log("App componentDidMount ...data: ", ...data);
                this.setState(
                    {
                        // ...data
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
                // this.setState({ ...data }, () => {
                //     console.table("App this.state: ", this.state);
                // });
            })
            .catch((err) => {
                console.error(
                    "err axios GET/App/componentDidMount catch: ",
                    err
                );
                this.setState({ error: true });
            });
    } */

    // asyn fn
    async componentDidMount() {
        //console.log("async App/componentDidMount mounted!");
        const { data } = await axios.get("/user/info");
        //console.log("data async componentDidMount: ", data);
        this.setState({ ...data });
    }

    logout() {
        axios.get("/logout").then(() =>
            location.replace("/welcome#/login").catch((err) => {
                console.error("error in App GET/logout catch: ", err);
            })
        );
    }

    toggleModalUploader() {
        console.log("toggleModalUploader is running!");
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
        //console.log("setImage worked!");
        console.log("setImage profile_pic:", newProfilePic);
        // I can call setImage from every App's children
        // but setImage will only update the state of App
        // regardless of which component it's called from
        this.setState({
            profile_pic: newProfilePic, // set new newProfilePic's url
            uploaderIsVisible: false, // close modal after delete/newProfilePic updated
        });
    }

    editBio(newBio) {
        console.log("editBio worked!");
        this.setState({
            bio: newBio, // update bio w/ new newBio
        });
    }

    render() {
        //console.log("App/render/this.state: ", this.state);
        return (
            <>
                <BrowserRouter>
                    <header className="headerApp">
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
                    <nav className="navApp">
                        <h4>
                            <Link to="/">Profile</Link>
                        </h4>
                        <h4>
                            <Link to="/friends">Friends</Link>
                        </h4>
                        <h4>
                            <Link to="/users">Find People</Link>
                        </h4>
                        <h4>
                            <Link to="/logout" onClick={this.logout}>
                                Log Out
                            </Link>
                        </h4>
                    </nav>
                    <Route
                        exact
                        path="/"
                        render={() => (
                            <section>
                                {/* <h1>[SECTION -Profile]</h1> */}
                                <div className="profile-bioeditorContainer">
                                    <Profile
                                        id={this.state.id}
                                        first={this.state.first}
                                        last={this.state.last}
                                        profile_pic={this.state.profile_pic}
                                        toggleModalUploader={
                                            this.toggleModalUploader
                                        }
                                        bio={this.state.bio}
                                        editBio={this.editBio}
                                    />
                                </div>
                            </section>
                        )}
                    />
                    {/* <Route path="/user/:id" compmonent={OtherProfile} /> 
                    render for bonus feature, to visit other profile, see
                    their friends and visit them  */}
                    <Route
                        path="/user/:id"
                        /* path="/other-user/info/:id" */
                        render={(props) => (
                            <section>
                                <OtherProfile
                                    match={props.match}
                                    key={props.match.url}
                                    history={props.history}
                                />
                            </section>
                        )}
                    />

                    <Route
                        path="/users"
                        render={() => (
                            <section>
                                <FindPeople
                                /* match={props.match}
                                key={props.match.url}
                                history={props.history} */
                                />
                            </section>
                        )}
                    />
                    <Route
                        path="/friends"
                        render={() => (
                            <section>
                                <Friends
                                /* match={props.match}
                                key={props.match.url}
                                history={props.history} */
                                />
                            </section>
                        )}
                    />

                    {/* <h1>[SECTION -Uploader]</h1> */}
                    {this.state.uploaderIsVisible && (
                        <section>
                            <div className="modalUploader">
                                <Uploader
                                    profile_pic={this.state.profile_pic}
                                    setImage={this.setImage}
                                    toggleModalUploader={
                                        this.toggleModalUploader
                                    }
                                />
                            </div>
                        </section>
                    )}
                </BrowserRouter>
            </>
        );
    }
}

/* 
NB: [BrowserRouter] is an alternative to HashRouter (<Welcome/>) that works similarly 
    except that it bases its matching on the path portion of the url rather than the hash.

NB: [Key] In order to reset the value when moving to a different item, 
    we can use the special React attribute called key. 
    When a key changes, React will create a new component instance 
    rather than update the current one.
*/
