//import React from 'react'; // since vers.17 we don't need to import it anymore

/* export default function ProfilePic(props) {
    console.log("props in ProfilePic: ", props);
    return (
        <>
            <h1>Profile Picture: {props.first} {props.last}</h1>
        </>
    );
} */

// destructuring it, it's just a personal preference
export default function ProfilePic({ first, last, profile_pic, toggleModalUploader }) {
    //console.log("props in ProfilePic: ", first, last, profile_pic, toggleModalUploader);
    return (
        // ProfilePic=> its job is to display the profile pic
        <>
            <h1>
                {/* Profile Picture Component */}
                {/* Profile Picture: {first} {last} */}
            </h1>
            <div>
                {profile_pic ? (
                    <img
                        className="profile_pic"
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
        </>
    );
}


