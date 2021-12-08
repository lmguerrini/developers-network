import ProfilePic from "./profilepic";
import BioEditor from "./bioeditor";
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
//import { SiCodefactor } from "react-icons/si";
import Wall from "./wall";
//import EditProfile from "./editprofile";
//import { Link } from "react-router-dom";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useEffect } from "react";

// destructuring it, it's just a personal preference
export default function Profile({
    id,
    first,
    last,
    profile_pic,
    bio,
    editBio,
    location,
    editLocation,
    education,
    editEducation,
    skills,
    editSkills,
    work,
    editWork,
    gitHub,
    editGitHub,
    linkedIn,
    editLinkedIn,
    languages,
    editLanguages,
    toggleModalUploader,
    toggleModalSettings,
    sendDataToParent,
}) {
    /* console.log(
        "Profile {props}: ",
        id,
        first,
        last,
        profile_pic,
        bio,
        editBio,
        location,
        editLocation,
        education,
        editEducation,
        skills,
        editSkills,
        work,
        editWork,
        gitHub,
        editGitHub,
        linkedIn,
        editLinkedIn,
        languages,
        editLanguages,
        toggleModalUploader
    ); */
    const mediaQuery1550px = useMediaQuery("(max-width:1550px)");
    // const mediaQuery375px = useMediaQuery("(max-device-width:375px)");
    const mediaQuery375px = useMediaQuery("(max-device-width:430px)");

    useEffect(() => {
        let abort;
        (async () => {
            if (!abort) {
                sendDataToParent(true);
            }
        })();
        return () => {
            abort = true;
        };
    }, []);

    return (
        <>
            <div className="sectionProfile">
                <div className="profileContainer">
                    {/* <h1>User Profile Component(P)</h1> */}
                    <div
                        id="welcomeBack"
                        className={
                            mediaQuery375px ? "welcomeBack375" : undefined
                        }
                    >
                        {/* <Link
                            to="/edit/profile"
                            style={{ textDecoration: "none" }}
                        > */}
                        <p
                            id="toggleModalSettings"
                            onClick={toggleModalSettings}
                        >
                            {" "}
                            {!mediaQuery375px ? (
                                <b>
                                    Welcome back&nbsp;
                                    {first} {last}!
                                </b>
                            ) : (
                                <b>
                                    {first} {last}
                                </b>
                            )}
                            {/* &#39;s profile page! */}
                        </p>
                        {/* </Link> */}
                    </div>
                    {/* <div className="profileContainer"> */}

                    <div className="frontBackCardsWrap">
                        <div className="front side">
                            <div className="content">
                                <div className="cardContainer">
                                    <div className="card cardProfile375">
                                        {/* <h1>Profile=-ProfilePic</h1> */}
                                        <div className="profile_picBigContainer">
                                            {/* <h1>Profile=-ProfilePic</h1> */}
                                            {/* <h1>
                                                {first} {last}&#39;s profile
                                                page!
                                            </h1> */}
                                            <ProfilePic
                                                toggleModalUploader={
                                                    toggleModalUploader
                                                }
                                                profile_pic={profile_pic}
                                                /* <img className="profile_picBig" src={profile_pic} /> */
                                            />
                                        </div>
                                        {/* <h1>Profile=-BioEditor</h1> */}
                                        <div className="bioEditor">
                                            <p id="introTitle">
                                                <b>Intro</b>
                                            </p>
                                            <BioEditor
                                                bio={bio}
                                                editBio={editBio}
                                            />
                                        </div>
                                        {/* <div className="more">MORE</div> */}
                                        <ProfileMoreBtnFront
                                            otherProfilePage={false}
                                        />
                                        {/* <div className="modalUploaderWrapper">
                                            <EditProfile
                                                toggleModalSettings={
                                                    toggleModalSettings
                                                }
                                            />
                                        </div> */}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div
                            className={
                                !mediaQuery375px
                                    ? !mediaQuery1550px
                                        ? "back invisible side"
                                        : "back1550 mirror invisible side1550"
                                    : "side back375 displayNone"
                            }
                        >
                            <div className="content">
                                <div className="cardContainer cardContainerBackExtraInfo">
                                    <div className="card cardProfileBack1550 cardProfileBack375">
                                        {/* <div id="privateChatPaddingTop"></div> */}
                                        <div
                                            id="introTitle"
                                            className="listExtraInfos"
                                        >
                                            {/*  <SiCodefactor /> */}
                                            <BiCodeCurly />
                                            {/* <p>extra info</p> */}
                                        </div>
                                        <div id="extraInfoTitle">
                                            <p>
                                                <b>Location:</b>
                                            </p>
                                            <LocationEditor
                                                myProfile={true}
                                                location={location}
                                                editLocation={editLocation}
                                            />
                                        </div>
                                        <div id="separationLine"></div>
                                        <div id="extraInfoTitle">
                                            <p>
                                                <b>Education:</b>
                                            </p>
                                            <EducationEditor
                                                myProfile={true}
                                                education={education}
                                                editEducation={editEducation}
                                            />
                                        </div>
                                        <div id="separationLine"></div>
                                        <div id="extraInfoTitle">
                                            <p>
                                                <b>Skills:</b>
                                            </p>
                                            <SkillsEditor
                                                myProfile={true}
                                                skills={skills}
                                                editSkills={editSkills}
                                            />
                                        </div>
                                        <div id="separationLine"></div>
                                        <div id="extraInfoTitle">
                                            <p>
                                                <b>Work:</b>
                                            </p>
                                            <WorkEditor
                                                myProfile={true}
                                                work={work}
                                                editWork={editWork}
                                            />
                                        </div>
                                        <div id="separationLine"></div>
                                        <div id="extraInfoTitle">
                                            <p>
                                                <b>GitHub:</b>
                                            </p>
                                            <GitHubEditor
                                                myProfile={true}
                                                gitHub={gitHub}
                                                editGitHub={editGitHub}
                                            />
                                        </div>
                                        <div id="separationLine"></div>
                                        <div id="extraInfoTitle">
                                            <p>
                                                <b>LinkedIn:</b>
                                            </p>
                                            <LinkedInEditor
                                                myProfile={true}
                                                linkedIn={linkedIn}
                                                editLinkedIn={editLinkedIn}
                                            />
                                        </div>
                                        <div id="separationLine"></div>
                                        <div id="extraInfoTitle">
                                            <p>
                                                <b>Languages:</b>
                                            </p>
                                            <LanguagesEditor
                                                myProfile={true}
                                                languages={languages}
                                                editLanguages={editLanguages}
                                            />
                                        </div>
                                        <div id="separationLine"></div>

                                        <div id="extraProfilePaddingBottom"></div>
                                        <ProfileLessBtnBack
                                            otherProfilePage={
                                                false
                                            } /* className="profileMoreBtnBack" */
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* </div> */}
                </div>
            </div>
            <div className="wallOuterContainer">
                <Wall id={id} myWall={true} name={`${first} ${last}`} />
            </div>
        </>
    );
}
