import ProfilePic from "./profilepic";
import BioEditor from "./bioeditor";

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
    first,
    last,
    profile_pic,
    bio,
    editBio,
    toggleModalUploader,
}) {
    /* console.log(
        "Profile {props}: ",
        first,
        last,
        profile_pic,
        bio,
        editBio,
        toggleModalUploader
    ); */
    return (
        <>
            {/* <h1>User Profile Component(P)</h1> */}
            <div className="profileContainer">
                <div>
                    {/* <h1>Profile=-ProfilePic</h1> */}
                    <div className="profile_picBigContainer">
                        <ProfilePic
                            toggleModalUploader={toggleModalUploader}
                            profile_pic={profile_pic}
                            /* <img className="profile_picBig" src={profile_pic} /> */
                        />
                    </div>
                </div>
                <div>
                    {/* <h1>Profile=-BioEditor</h1> */}
                    <div className="bioEditor">
                        <h3>
                            Welcome back {first} {last}!
                        </h3>
                        <BioEditor bio={bio} editBio={editBio} />
                    </div>
                </div>
            </div>
        </>
    );
}
