import ProfilePic from "./profilepic";
import BioEditor from "./bioeditor";
import Wall from "./wall";
//import EditProfile from "./editprofile";
//import { Link } from "react-router-dom";

/* 
NB: The Profile component will be responsible for laying out the content we want to show: 
    the user's name, profile picture, and bio.
*/

/* export default function ProfilePic(props) {
    console.log("Profile props: ", props);
    return (
        <>
            <h1>User Profile Component</h1>
            <h3>
                Hello my name is {props.first} {props.last}
            </h3>
        </>
    );
} */

// destructuring it, it's just a personal preference
export default function Profile({
    id,
    first,
    last,
    profile_pic,
    bio,
    editBio,
    toggleModalUploader,
    toggleModalSettings,
}) {
    /* console.log(
        "Profile {props}: ",
        id,
        first,
        last,
        profile_pic,
        bio,
        editBio,
        toggleModalUploader,
    ); */

    return (
        <>
            <div className="sectionProfile">
                <div className="profileContainer">
                    {/* <h1>User Profile Component(P)</h1> */}
                    <div id="welcomeBack">
                        {/* <Link
                            to="/edit/profile"
                            style={{ textDecoration: "none" }}
                        > */}
                        <p id="toggleModalSettings" onClick={toggleModalSettings}>
                            {" "}
                            <b>
                                Welcome back&nbsp;
                                {first} {last}!
                            </b>
                            {/* &#39;s profile page! */}
                        </p>
                        {/* </Link> */}
                    </div>
                    {/* <div className="profileContainer"> */}
                    <div className="cardContainer">
                        <div className="card">
                            {/* <h1>Profile=-ProfilePic</h1> */}
                            <div className="profile_picBigContainer">
                                {/* <h1>Profile=-ProfilePic</h1> */}
                                {/* <h1>
                            {first} {last}&#39;s profile page!
                            </h1> */}
                                <ProfilePic
                                    toggleModalUploader={toggleModalUploader}
                                    profile_pic={profile_pic}
                                    /* <img className="profile_picBig" src={profile_pic} /> */
                                />
                            </div>

                            {/* <h1>Profile=-BioEditor</h1> */}
                            <div className="bioEditor">
                                <p id="introTitle">
                                    <b>Intro</b>
                                </p>
                                <BioEditor bio={bio} editBio={editBio} />
                            </div>
                            {/* <div className="modalUploaderWrapper">
                                <EditProfile
                                    toggleModalSettings={toggleModalSettings}
                                    
                                />
                            </div> */}
                        </div>
                    </div>
                    {/* </div> */}
                </div>
            </div>
            <div className="wallOuterContainer">
                <Wall id={id} myWall={true} />
            </div> 
        </>
    );
}
