//import React from 'react'; // since vers.17 we don't need to import it anymore

/* export default function ProfilePic(props) {
    console.log("props in ProfilePic: ", props);
    return (
        <>
            <h1>Profile Picture: {props.first} {props.last}</h1>
        </>
    );
} */

// destructuring it, it's just a personal preference/choice 
export default function ProfilePic({first, last}) {
    console.log("props in ProfilePic: ", first, last);
    return (
        <>
            <h1>
                Profile Picture: {first} {last}
            </h1>
        </>
    );
}
