import { Component } from "react";
import axios from "./axios";
import ProfilePic from "./profilepic";
import FriendButton from "./friendbutton";
import { Link } from "react-router-dom";
import { ProfileMoreBtnFront } from "./profilemorebtn";
import { ProfileLessBtnBack } from "./profilemorebtn";
import { LocationEditor } from "./extraprofileinfos";
import { EducationEditor } from "./extraprofileinfos";
import { SkillsEditor } from "./extraprofileinfos";
import { WorkEditor } from "./extraprofileinfos";
import { GitHubEditor } from "./extraprofileinfos";
import { LinkedInEditor } from "./extraprofileinfos";
import { LanguagesEditor } from "./extraprofileinfos";
import { BiCodeCurly } from "react-icons/bi";
import Wall from "./wall";

export default class OtherProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: "",
            first: "",
            last: "",
            email: "",
            profile_pic: "",
            bio: "",
            location: "",
            education: "",
            skills: "",
            work: "",
            gitHub: "",
            linkedIn: "",
            languages: "",
            mediaQuery1550px: window.matchMedia("(max-device-width:1550px)"),
            // mediaQuery375px: window.matchMedia("(max-device-width:375px)"),
            mediaQuery375px: window.matchMedia("(max-device-width:430px)"),
        };
    }

    /*  sendDataToParent() {
        console.log("----sendDataToParent", this.state.profile_pic);
        props.parentCallback(this.state.profile_pic);
    } */
    /* sendDataToParent(e) {
        console.log("----sendDataToParent", this.state.profile_pic);
        this.props.parentCallback(this.state.profile_pic);
        // this.props.parentCallback("Data from child");
        e.preventDefault();
    } */

    componentDidMount() {
        this.props.sendDataToParent(true); // App's state profilePage: false

        // console.log("OtherProfile/componentDidMount mounted!");
        // console.log(
        //     "OtherProfile/componentDidMount this.props.match.params.id: ",
        //     this.props.match.params.id
        // );

        //we should make a request to our server to get the other user's data
        // if we are viewing our own profile, we should make sure to send the user back to the "/" route

        /* if (this.props.params.id == 34) {
            // NB: == and not ===, since id = string
            this.props.history.push("/");
        } */

        //axios request to the server to get information about the user whose page we're currently on
        axios
            .get(`/other-user/info/${this.props.match.params.id}`)
            .then(({ data }) => {
                if (!data.error || !data.requestedInvalidId) {
                    /* this.setState(
                        {
                            //...data,
                            id: data[0].id, 
                            first: data[0].first,
                            last: data[0].last,
                            email: data[0].email,
                            profile_pic: data[0].profile_pic,
                            bio: data[0].bio,
                        },
                        () => {
                            //console.table("OtherProfile this.state: ", this.state);
                            //console.table("OtherProfile data[0]: ", data[0]);
                        }
                    ); */
                    this.setState({ ...data }, () => {
                        // console.table("OtherProfile this.state: ", this.state);

                        this.props.callbackDataFromOP(this.state); // send data to App (parent) for PM (child)
                        // this.props.parentCallback(this.state.profile_pic);
                        // this.props.callbackNameFromOPforPM(`${this.state.first} ${this.state.last}`);
                    });
                } else {
                    //console.log("requestedId == id");
                    this.props.history.push("/");
                }
            })
            .catch((err) => {
                console.error(
                    "err axios POST/OtherProfile/componentDidMount catch: ",
                    err
                );
                this.setState({ error: true });
            });
    }

    render() {
        // props passed down from the parent (App) to its children (OtherProfile, in this case)
        //console.log("props in OtherProfile: ", this.props);
        return (
            <>
                {/* <h1>Other Profile Component</h1> */}
                <div
                    className="otherProfileContainer"
                    onChange={this.sendDataToParent}
                >
                    {/* <div id="welcomeBack">
                        <p id="toggleModalSettings">
                            <b>
                                {this.state.first} {this.state.last}!
                            </b>
                        </p>
                    </div> */}

                    <div
                        className={
                            !this.state.mediaQuery375px
                                ? "frontBackCardsWrap frontBackCardsWrapOp"
                                : "frontBackCardsWrap "
                        }
                    >
                        <div className="front side">
                            <div className="content">
                                <div className="otherProfileCardContainer">
                                    <div className="otherProfileCard">
                                        <div>
                                            {/* <h1>Profile=-ProfilePic</h1> */}
                                            <div className="profile_picBigContainer">
                                                <ProfilePic
                                                    profile_pic={
                                                        this.state.profile_pic
                                                    }
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            {/* {<h1>Profile=-BioEditor</h1>} */}
                                            <div
                                                className="bioEditor"
                                                id="otherProfileBioeditor bioEditorIsVisible"
                                            >
                                                <p id="introTitle">
                                                    {this.state.first}{" "}
                                                    {this.state.last}
                                                </p>
                                                <p>{this.state.bio}</p>
                                            </div>
                                            <div className="otherProfileBtnWrapper">
                                                <div className="friendButtonOtherProfWrap">
                                                    <FriendButton
                                                        id={this.state.id}
                                                    />
                                                </div>
                                                <div className="dmWrap">
                                                    <Link
                                                        /* to={`/privatemessage/${this.state.id}`} */
                                                        to={{
                                                            pathname: `/privatemessage/${this.state.id}`,
                                                            name:
                                                                `${this.state.first}` +
                                                                `${this.state.last}`,
                                                        }}
                                                    >
                                                        <button className="friendButton friendButtonOp">
                                                            Private Chat
                                                        </button>
                                                    </Link>
                                                </div>
                                            </div>
                                            <ProfileMoreBtnFront
                                                otherProfilePage={true}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* <div className="back side op"> */}
                        <div
                            className={
                                !this.state.mediaQuery375px.matches
                                    ? !this.state.mediaQuery1550px.matches
                                        ? "back mirror invisible side"
                                        : "back1550 mirror invisible side1550"
                                    : "side back375 front-back375op back375op displayNone"
                            }
                        >
                            <div className="content">
                                <div className="cardContainer">
                                    <div className="card">
                                        <div
                                            id="introTitle"
                                            className="listExtraInfos"
                                        >
                                            <BiCodeCurly />
                                        </div>
                                        <div id="extraInfoTitle">
                                            <p id="extraInfoTitleOp">
                                                <b>Location:</b>
                                            </p>
                                            <LocationEditor
                                                myProfile={false}
                                                location={this.state.location}
                                            />
                                        </div>
                                        <div id="separationLine"></div>
                                        <div id="extraInfoTitle">
                                            <p id="extraInfoTitleOp">
                                                <b>Education:</b>
                                            </p>
                                            <EducationEditor
                                                myProfile={false}
                                                education={this.state.education}
                                            />
                                        </div>
                                        <div id="separationLine"></div>
                                        <div id="extraInfoTitle">
                                            <p id="extraInfoTitleOp">
                                                <b>Skills:</b>
                                            </p>
                                            <SkillsEditor
                                                myProfile={false}
                                                skills={this.state.skills}
                                            />
                                        </div>
                                        <div id="separationLine"></div>
                                        <div id="extraInfoTitle">
                                            <p id="extraInfoTitleOp">
                                                <b>Work:</b>
                                            </p>
                                            <WorkEditor
                                                myProfile={false}
                                                work={this.state.work}
                                            />
                                        </div>
                                        <div id="separationLine"></div>
                                        <div id="extraInfoTitle">
                                            <p id="extraInfoTitleOp">
                                                <b>GitHub:</b>
                                            </p>
                                            <GitHubEditor
                                                myProfile={false}
                                                gitHub={this.state.gitHub}
                                            />
                                        </div>
                                        <div id="separationLine"></div>
                                        <div id="extraInfoTitle">
                                            <p id="extraInfoTitleOp">
                                                <b>LinkedIn:</b>
                                            </p>
                                            <LinkedInEditor
                                                myProfile={false}
                                                linkedIn={this.state.linkedIn}
                                            />
                                        </div>
                                        <div id="separationLine"></div>
                                        <div id="extraInfoTitle">
                                            <p id="extraInfoTitleOp">
                                                <b>Languages:</b>
                                            </p>
                                            <LanguagesEditor
                                                myProfile={false}
                                                languages={this.state.languages}
                                            />
                                        </div>
                                        <div id="separationLine"></div>

                                        <div id="privateChatPaddingTop"></div>
                                        <ProfileLessBtnBack
                                            otherProfilePage={
                                                true
                                            } /* className="profileMoreBtnBack" */
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <section>
                    <Wall
                        id={this.state.id}
                        myWall={false}
                        name={`${this.state.first} ${this.state.last}`}
                    />
                </section>
            </>
        );
    }
}
