//import React from 'react'; // since vers.17 we don't need to import it anymore

// Profile receives all it's data as props from the App component
/* export default function ProfilePic(props) {
    console.log("props in ProfilePic: ", props);
    return (
        <>
            <h1>Profile Picture: {props.first} {props.last}</h1>
        </>
    );
} */

// destructuring it, it's just a personal preference
export default function ProfilePic({
    first,
    last,
    profile_pic,
    toggleModalUploader,
}) {
    //console.log("props in ProfilePic: ", first, last, profile_pic, toggleModalUploader);
    return (
        // ProfilePic=> its job is to display the profile pic
        <div className="profilePicContiner profileContainer375">
            <h1>
                {/* Profile Picture Component */}
                {/* Profile Picture: {first} {last} */}
            </h1>
            <div title="Change your profile picture">
                {profile_pic ? (
                    <img
                        /* className="profile_picBig" */
                        className="profile_pic profile_pic375"
                        src={profile_pic}
                        alt={`${first} ${last}`}
                        onClick={toggleModalUploader}
                    />
                ) : (
                    <img
                        className="profile_pic"
                        src="/img/defaultProfilePic.png"
                        alt="default profile_pic"
                        onClick={toggleModalUploader}
                    />
                )}
            </div>
        </div>
    );
}
