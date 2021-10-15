import { Component } from "react";
import axios from "./axios";
import { BrowserRouter, Route } from "react-router-dom";
import { Link } from "react-router-dom";
import ProfilePic from "./profilepic";
import Profile from "./profile";
import EditProfile from "./editprofile";
import OtherProfile from "./otherprofile";
import Friends from "./friends";
import FindPeople from "./findpeople";
import Chat from "./chat";
import PrivateMessages from "./privatemessages";
import Uploader from "./uploader";
import Notifications from "./notifications";
import { bubble as Menu } from "react-burger-menu";
import { FiLogOut } from "react-icons/fi";
import { AiOutlineUserDelete } from "react-icons/ai";
import { RiWechatLine } from "react-icons/ri";
import { RiUserSearchFill } from "react-icons/ri";
//import { IoMdGitNetwork } from "react-icons/io";
import { BiNetworkChart } from "react-icons/bi";
//import { FaUserFriends } from "react-icons/fa";
import { AiOutlineUser } from "react-icons/ai";
import { RiNotification2Line } from "react-icons/ri";
// import { GrNotification } from "react-icons/gr";
import { DarkMode } from "./darkmode";
import ParticlesApp from "../public/anim/App[p]/particlesApp";
import { ParallaxProvider } from "react-scroll-parallax";
import { Parallax } from "react-scroll-parallax";

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
            otherprofile_pic: "",
            bio: "",
            location: "",
            education: "",
            skills: "",
            work: "",
            gitHub: "",
            linkedIn: "",
            languages: "",
            uploaderIsVisible: false,
            settingsIsVisible: false,
            notifications: 0,
            //active: false,
            menuOpen: false,
            // mediaQuery375px: window.matchMedia("(max-device-width:375px)"), // .matches(t/f)
            mediaQuery375px: window.matchMedia("(max-device-width:430px)"),
        };
        this.componentDidMount = this.componentDidMount.bind(this);
        this.deleteUser = this.deleteUser.bind(this);
        this.logout = this.logout.bind(this);
        this.toggleModalUploader = this.toggleModalUploader.bind(this);
        this.setImage = this.setImage.bind(this);
        this.toggleModalSettings = this.toggleModalSettings.bind(this);
        this.editBio = this.editBio.bind(this);
        this.editLocation = this.editLocation.bind(this);
        this.editEducation = this.editEducation.bind(this);
        this.editSkills = this.editSkills.bind(this);
        this.editWork = this.editWork.bind(this);
        this.editGitHub = this.editGitHub.bind(this);
        this.editLinkedIn = this.editLinkedIn.bind(this);
        this.editLanguages = this.editLanguages.bind(this);
        this.callbackFunction = (childData) => {
            // this.setState({ notifications: childData });
            this.setState({ otherprofile_pic: childData });
        };
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

        //current location
        if (this.state.location == "") {
            axios
                .get(
                    "https://geolocation-db.com/json/c0593a60-4159-11eb-80cd-db15f946225f"
                )
                .then(({ data }) => {
                    console.log("APP-data geolocation: ", data);
                    /*  this.setState({
                        location: data.city + ", " + data.country_name,
                    }); */
                });
        }
    }

    async deleteUser() {
        //console.log("async App/deleteUser is running!");
        const { data } = await axios.post("/user/delete");
        //console.log("data async deleteUser: ", data);
        if (data.success) {
            this.logout();
        }
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

    toggleModalSettings() {
        this.setState({
            settingsIsVisible: !this.state.settingsIsVisible,
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

    // edit user infos
    editBio(newBio) {
        this.setState({
            bio: newBio, // update bio w/ new newBio
        });
    }
    editLocation(newLocation) {
        console.log("editLocation worked!", newLocation);
        this.setState({
            location: newLocation,
        });
    }
    editEducation(newEducation) {
        this.setState({
            education: newEducation,
        });
    }
    editSkills(newSkills) {
        this.setState({
            skills: newSkills,
        });
    }
    editWork(newWork) {
        this.setState({
            work: newWork,
        });
    }
    editGitHub(newGitHub) {
        this.setState({
            gitHub: newGitHub,
        });
    }
    editLinkedIn(newLinkedIn) {
        this.setState({
            linkedIn: newLinkedIn,
        });
    }
    editLanguages(newLanguages) {
        this.setState({
            languages: newLanguages,
        });
    }

    handleStateChangeSideMenu(state) {
        this.setState({ menuOpen: state.isOpen });
    }
    closeMenu() {
        this.setState({ menuOpen: false });
    }
    /* showSettings(e) {
        e.preventDefault();
    } */

    render() {
        //console.log("App/render/this.state: ", this.state);
        return (
            <>
                {this.state.mediaQuery375px.matches && (
                    <div className="sideMenuContainer">
                        <Menu
                            width={"50%"}
                            style={{ transform: `rotate(45deg)` }}
                            className="sideMenu"
                            isOpen={this.state.menuOpen}
                            onStateChange={(state) =>
                                this.handleStateChangeSideMenu(state)
                            }
                        >
                            <BrowserRouter>
                                <div className="boxUnderX"></div>
                                <div className="profileIconWrap menuIconsMarginTop">
                                    <a
                                        href="/"
                                        title="Profile"
                                        id="profileIcon"
                                    >
                                        <AiOutlineUser
                                            onClick={() => this.closeMenu()}
                                        />
                                    </a>
                                    <a
                                        href="/"
                                        id="profileIconText"
                                        className=" iconTextTranslate"
                                        onClick={() => this.closeMenu()}
                                    >
                                        Profile{" "}
                                    </a>
                                </div>
                                <div className="profileIconWrap">
                                    <a
                                        href="/friends"
                                        title="My Developers Network"
                                        id="profileIcon"
                                        className="iconTextTranslateY5"
                                    >
                                        <BiNetworkChart
                                            onClick={() => this.closeMenu()}
                                        />
                                    </a>
                                    <a
                                        href="/friends"
                                        id="profileIconText"
                                        onClick={() => this.closeMenu()}
                                    >
                                        My Developers Network{" "}
                                    </a>
                                </div>
                                <div className="profileIconWrap">
                                    <a
                                        href="/users"
                                        title="Find Developers"
                                        id="profileIcon"
                                        className="iconTextTranslateY5"
                                    >
                                        <RiUserSearchFill
                                            onClick={() => this.closeMenu()}
                                        />
                                    </a>
                                    <a
                                        href="/users"
                                        id="profileIconText"
                                        onClick={() => this.closeMenu()}
                                    >
                                        Find Developers{" "}
                                    </a>
                                </div>
                                <div className="profileIconWrap">
                                    <a
                                        href="/chat"
                                        title="Developer Chat"
                                        id="profileIcon"
                                        className="iconTextTranslateY5"
                                    >
                                        <RiWechatLine
                                            onClick={() => this.closeMenu()}
                                        />
                                    </a>
                                    <a
                                        href="/chat"
                                        id="profileIconText"
                                        onClick={() => this.closeMenu()}
                                    >
                                        Developers Chat
                                    </a>
                                </div>
                                <div className="profileIconWrap">
                                    <a
                                        href="/notifications"
                                        title="Notifications"
                                        id="profileIcon"
                                    >
                                        <RiNotification2Line
                                            onClick={() => this.closeMenu()}
                                        />
                                    </a>
                                    <a
                                        href="/notifications"
                                        id="profileIconText"
                                        className=" iconTextTranslate"
                                        onClick={() => this.closeMenu()}
                                    >
                                        Notifications
                                    </a>
                                </div>
                                <div className="profileIconWrap logoutIconBorderTop">
                                    <a
                                        href="/logout"
                                        title="Logout"
                                        className="logoutLink iconTextTranslateY2"
                                        id="profileIcon"
                                        onClick={() => this.logout()}
                                    >
                                        <FiLogOut />
                                    </a>
                                    <a
                                        href="/logout"
                                        id="profileIconText"
                                        className=" iconTextTranslate"
                                        onClick={() => this.logout()}
                                    >
                                        Logout
                                    </a>
                                </div>
                                <div className="profileIconWrap">
                                    <p
                                        title="Delete Account"
                                        className="logoutLink deleteIconText"
                                        id="deleteIcon"
                                        onClick={(e) => {
                                            window.confirm(
                                                "[ACCOUNT DELETION] \nAre your sure you want to delete your account and all related data? \nNote: there is no going back! Please be certain."
                                            ) && this.deleteUser(e);
                                        }}
                                    >
                                        <AiOutlineUserDelete />
                                    </p>
                                    <p
                                        id="profileIconText"
                                        onClick={() => this.closeMenu()}
                                    >
                                        Delete Account
                                    </p>
                                </div>
                                <div className="DNLogo375">
                                    <img
                                        title="DN Logo"
                                        className="theDeveloperNetworkLogo theDeveloperNetworkLogo375"
                                        src="/img/theDeveloperNetworkLogo.png"
                                        alt="The Developer Network Logo"
                                    />
                                </div>
                            </BrowserRouter>
                        </Menu>
                    </div>
                )}
                <div className="appParentWrapper">
                    <div className="parentContainer">
                        <div className="childrenContainer">
                            <BrowserRouter>
                                {!this.state.mediaQuery375px.matches ? (
                                    <header className="headerApp">
                                        {/* <h1>App -L-</h1> */}
                                        <div
                                            className="headerAppGlass matrixCodeContainer matrixCode"
                                            id="particlesApp-js"
                                        >
                                            <ParallaxProvider>
                                                <Parallax
                                                    className="custom-class"
                                                    y={[-0.1, 10]}
                                                    tagOuter="figure"
                                                >
                                                    <ParticlesApp />
                                                </Parallax>
                                            </ParallaxProvider>
                                        </div>
                                        <img
                                            title="DN Logo"
                                            className="theDeveloperNetworkLogo"
                                            src="/img/theDeveloperNetworkLogo.png"
                                            alt="The Developer Network Logo"
                                        />
                                        {
                                            <ProfilePic
                                                /* firstName={this.state.first} */
                                                first={this.state.first}
                                                last={this.state.last}
                                                profile_pic={
                                                    this.state.profile_pic
                                                }
                                                toggleModalUploader={
                                                    this.toggleModalUploader
                                                }
                                            />
                                        }
                                    </header>
                                ) : (
                                    <header className="headerApp">
                                        {/* <h1>App -L-</h1> */}
                                        <div
                                            className="headerAppGlass matrixCode375 matrixCode375app"
                                            id="particlesApp-js"
                                        >
                                            <ParallaxProvider>
                                                <Parallax
                                                    className="custom-class"
                                                    y={[-0.1, 10]}
                                                    tagOuter="figure"
                                                >
                                                    <ParticlesApp />
                                                </Parallax>
                                            </ParallaxProvider>
                                        </div>
                                        {!this.state.otherprofile_pic ? (
                                            <ProfilePic
                                                /* firstName={this.state.first} */
                                                first={this.state.first}
                                                last={this.state.last}
                                                profile_pic={
                                                    this.state.profile_pic
                                                }
                                                toggleModalUploader={
                                                    this.toggleModalUploader
                                                }
                                            />
                                        ) : (
                                            <ProfilePic
                                                /* firstName={this.state.first} */
                                                first={this.state.first}
                                                last={this.state.last}
                                                profile_pic={
                                                    this.state.otherprofile_pic
                                                }
                                            />
                                        )}
                                    </header>
                                )}

                                {!this.state.mediaQuery375px.matches ? (
                                    <nav className="navApp">
                                        <p>
                                            <Link
                                                to="/"
                                                title="Profile"
                                                id="profileIcon"
                                                className="bounce" /* className="loginLink" */
                                            >
                                                {/* Profile */}
                                                <AiOutlineUser />
                                            </Link>
                                        </p>
                                        <p>
                                            <Link
                                                to="/friends"
                                                title="My Developers Network"
                                                /* title="My Developer friends / friend requests" */
                                                id="friendsIcon"
                                                className="bounce"
                                                /* className="loginLink" */
                                            >
                                                {/* Friends */}
                                                {/* <FaUserFriends /> */}
                                                <BiNetworkChart />
                                                {/* <IoMdGitNetwork /> */}
                                            </Link>
                                        </p>
                                        <p>
                                            <Link
                                                to="/users"
                                                title="Find Developers"
                                                id="navIcons"
                                                className="bounce"
                                                /* className="loginLink" */
                                            >
                                                {/* Find Devs */}
                                                <RiUserSearchFill />
                                            </Link>
                                        </p>
                                        <p>
                                            <Link
                                                to="/chat"
                                                title="Developer Chat"
                                                id="chatIcon"
                                                className="bounce"
                                                /* className="loginLink" */
                                            >
                                                {/* Chatroom */}
                                                <RiWechatLine />
                                            </Link>
                                        </p>
                                        <p>
                                            <Link
                                                to="/notifications"
                                                title="Notifications"
                                                id="notificationIcon"
                                                className="bounce"
                                                /* className="loginLink" */
                                            >
                                                {/* Notification */}
                                                {/* Notification Count: {this.state.notifications} */}
                                                {/* <GrNotification /> */}
                                                {/* <RiNotification2Line /> */}
                                                <RiNotification2Line />
                                            </Link>
                                        </p>

                                        {/* <div id="menuLine"></div> */}
                                        {/* <p>
                                            <Link
                                                to="/edit/profile"
                                                id="chatIcon"
                                                className="bounce"
                                            >
                                                <FaRegEdit />
                                            </Link>
                                        </p> */}
                                        <p>
                                            <Link
                                                to="/logout"
                                                title="Logout"
                                                className="logoutLink"
                                                id="logout"
                                                /* onClick={(e) => {
                                                window.confirm(
                                                    "[LOGOUT] \nAre you sure you want to logout?"
                                                ) && this.logout(e);
                                            }} */
                                                onClick={this.logout}
                                            >
                                                {/* Log Out */}
                                                <FiLogOut />
                                            </Link>
                                        </p>
                                        <p
                                            id="deleteAccount"
                                            title="Delete Account"
                                            className="logoutLink"
                                            onClick={(e) => {
                                                window.confirm(
                                                    "[ACCOUNT DELETION] \nAre your sure you want to delete your account and all related data? \nNote: there is no going back! Please be certain."
                                                ) && this.deleteUser(e);
                                            }}
                                        >
                                            {/* Delete Account */}
                                            <AiOutlineUserDelete />
                                        </p>
                                        <div id="darkModeWrap">
                                            <div
                                                id="darkModeContainer"
                                                title="Dark Mode"
                                            >
                                                <DarkMode />
                                            </div>
                                            <div id="darkModeCheckHiderWrap">
                                                <div id="darkModeCheckHider"></div>
                                            </div>
                                        </div>
                                    </nav>
                                ) : (
                                    <nav className="navApp navApp375">
                                        <div id="darkModeWrap">
                                            <div
                                                id="darkModeContainer"
                                                title="Dark Mode"
                                            >
                                                <DarkMode />
                                            </div>
                                            <div id="darkModeCheckHiderWrap">
                                                <div id="darkModeCheckHider"></div>
                                            </div>
                                        </div>
                                    </nav>
                                )}

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
                                                    profile_pic={
                                                        this.state.profile_pic
                                                    }
                                                    toggleModalUploader={
                                                        this.toggleModalUploader
                                                    }
                                                    toggleModalSettings={
                                                        this.toggleModalSettings
                                                    }
                                                    bio={this.state.bio}
                                                    editBio={this.editBio}
                                                    location={
                                                        this.state.location
                                                    }
                                                    editLocation={
                                                        this.editLocation
                                                    }
                                                    education={
                                                        this.state.education
                                                    }
                                                    editEducation={
                                                        this.editEducation
                                                    }
                                                    skills={this.state.skills}
                                                    editSkills={this.editSkills}
                                                    work={this.state.work}
                                                    editWork={this.editWork}
                                                    gitHub={this.state.gitHub}
                                                    editGitHub={this.editGitHub}
                                                    linkedIn={
                                                        this.state.linkedIn
                                                    }
                                                    editLinkedIn={
                                                        this.editLinkedIn
                                                    }
                                                    languages={
                                                        this.state.languages
                                                    }
                                                    editLanguages={
                                                        this.editLanguages
                                                    }
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
                                        <section className="sectionOtherProfile">
                                            <OtherProfile
                                                match={props.match}
                                                key={props.match.url}
                                                history={props.history}
                                                parentCallback={
                                                    this.callbackFunction
                                                }
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
                                <Route
                                    path="/chat"
                                    render={() => (
                                        <section>
                                            <Chat
                                            /* match={props.match}
                                                key={props.match.url}
                                                history={props.history}
                                                id={this.state.id}
                                                name={`${this.state.first} ${this.state.last}`} */
                                            />
                                        </section>
                                    )}
                                />
                                <Route
                                    path="/privatemessage/:id"
                                    render={(props) => (
                                        <section>
                                            <PrivateMessages
                                                match={props.match}
                                                key={props.match.url}
                                                history={props.history}
                                                name={`${this.state.first} ${this.state.last}`}
                                                parentCallback={
                                                    this.callbackFunction
                                                }
                                            />
                                        </section>
                                    )}
                                />
                                <Route
                                    path="/notifications"
                                    render={(props) => (
                                        <section>
                                            <Notifications
                                                match={props.match}
                                                key={props.match.url}
                                                history={props.history}
                                                name={`${this.state.first} ${this.state.last}`}
                                                id={this.state.id}
                                            />
                                        </section>
                                    )}
                                />
                                {/* <Route
                                    path="/edit/profile"
                                    render={() => (
                                        <EditProfile
                                            first={this.state.first}
                                            last={this.state.last}
                                            email={this.state.email}
                                        />
                                    )}
                                /> */}

                                {this.state.settingsIsVisible && (
                                    <section>
                                        <div className="modalsettingsWrapper">
                                            <EditProfile
                                                first={this.state.first}
                                                last={this.state.last}
                                                email={this.state.email}
                                                toggleModalSettings={
                                                    this.toggleModalSettings
                                                }
                                                logout={this.logout}
                                                deleteAccount={this.deleteUser}
                                                /* deleteUser={this.deleteUser} */
                                            />
                                        </div>
                                    </section>
                                )}

                                {/* <h1>[SECTION -Uploader]</h1> */}
                                {this.state.uploaderIsVisible && (
                                    <section>
                                        <div className="modalUploaderWrapper">
                                            <Uploader
                                                profile_pic={
                                                    this.state.profile_pic
                                                }
                                                setImage={this.setImage}
                                                toggleModalUploader={
                                                    this.toggleModalUploader
                                                }
                                                /* deleteUser={this.deleteUser} */
                                            />
                                        </div>
                                    </section>
                                )}
                            </BrowserRouter>
                        </div>

                        <footer
                            id="footerApp"
                            className="glitchFooterApp"
                            data-text="Copyright © 2021 DN, Inc. All rights reserved."
                        >
                            Copyright © 2021 DN, Inc. All rights reserved.
                        </footer>
                    </div>
                </div>
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
