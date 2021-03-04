import { Component } from "react";
import axios from "./axios";
import ProfilePic from "./profilepic";
import FriendButton from "./friendbutton";
import { Link } from "react-router-dom";
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
        };
    }

    componentDidMount() {
        console.log("OtherProfile/componentDidMount mounted!");
        console.log(
            "OtherProfile/componentDidMount this.props.match.params.id: ",
            this.props.match.params.id
        );

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
                console.log("OtherProfile componentDidMount data: ", data[0]);
                /* console.log(
                    "data.requestedInvalidId: ",
                    data[0].requestedInvalidId
                ); */
                if (!data.error || !data.requestedInvalidId) {
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
                            //console.table("OtherProfile this.state: ", this.state);
                            //console.table("OtherProfile data[0]: ", data[0]);
                        }
                    );
                    /* this.setState({ ...data }, () => {
                    console.table("OtherProfile this.state: ", this.state);
                }); */
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
                <div className="otherProfileContainer">
                    <div className="cardContainer">
                        <div className="card">
                            <div className="sectionProfileFriendbutton">
                                {/* <h1>Profile=-ProfilePic</h1> */}
                                <div className="profile_picBigContainer">
                                    <ProfilePic
                                        profile_pic={this.state.profile_pic}
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
                                        {this.state.first} {this.state.last}
                                    </p>
                                    <p>{this.state.bio}</p>
                                </div>
                                <div className="otherProfileBtnWrapper">
                                    <div className="friendButtonOtherProfWrap">
                                        <FriendButton id={this.state.id} />
                                    </div>
                                    <div className="dmWrap">
                                        <Link
                                            to={`/privatemessage/${this.state.id}`}
                                        >
                                            <button className="friendButton">
                                                Direct Message
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <section>
                    <Wall id={this.state.id} myWall={false} />
                </section>
            </>
        );
    }
}

/*
    OtherProfile functions:
    _ Displaying the other users information including their profile pic and bio.
    _ It won't be able to edit their information!
*/
