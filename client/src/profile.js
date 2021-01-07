import ProfilePic from "./profilepic";

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

export default function ProfilePic({ first, last, profile_pic }) {
    console.log("Profile props: ", first, last, profile_pic);
    return (
        <>
            <h1>User Profile Component</h1>
            <h3>
                Hello my name is {first} {last}
            </h3>
            <ProfilePic profile_pic="https://www.google.com/imgres?imgurl=https%3A%2F%2Fi.pinimg.com%2Foriginals%2Fd7%2F68%2Fdd%2Fd768dd77a468d0fb8e84c382cf69cd09.jpg&imgrefurl=https%3A%2F%2Fhu.pinterest.com%2Fpin%2F518336238346131124%2F&tbnid=zVtQSNZXi87BiM&vet=12ahUKEwjagMSLwonuAhVKiRoKHeGhBvsQMygQegUIARDKAQ..i&docid=x2hTP5AHBb4A7M&w=381&h=500&itg=1&q=cool%20ducky%20picture&client=safari&ved=2ahUKEwjagMSLwonuAhVKiRoKHeGhBvsQMygQegUIARDKAQ" />
            <BioEditor />
        </>
    );
}
