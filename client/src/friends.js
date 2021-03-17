import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { BUTTON_TEXT } from "../../shared-datas/button-friendships-text";
import { RiUserSearchFill } from "react-icons/ri";
import {
    getFriendsWannabesList,
    acceptFriendshipRequest,
    deleteFriendship,
} from "./actions";

export default function Friends() {
    //console.log("Friends component mounted!");
    const dispatch = useDispatch();

    const wannabes = useSelector(
        (state) =>
            state.friendsWannabesList &&
            state.friendsWannabesList.filter((user) => user.accepted == false)
    );

    const friends = useSelector(
        (state) =>
            state.friendsWannabesList &&
            state.friendsWannabesList.filter((user) => user.accepted == true)
    );
    //console.log("friends: ", friends);

    /* useEffect(() => {
        dispatch(getFriendsWannabesList());
    }, []); */
    useEffect(() => {
        let abort;
        (async () => {
            if (!abort) {
                dispatch(getFriendsWannabesList());
            }
        })();
        return () => {
            // NB: this runs before every next re-render
            abort = true;
        };
    }, []);

    //console.log("wannabes B/A: ", wannabes);
    //console.log("friends B/A: ", friends);

    if ((!friends || !friends.length) && (!wannabes || !wannabes.length)) {
        //return null;
        return (
            <div className="opsNoFriendsNorRequestsFirstWrap">
                <div className="opsNoFriendsNorRequestsSecondtWrap">
                    <h1>
                        Ops, it seems you don&#39;t have any friends (requests)
                        yet..
                    </h1>
                    <h4>
                        Note: You can click on{" "}
                        <RiUserSearchFill id="RiUserSearchFill" /> (Find
                        Developers) in order to look for developers to add as
                        friends.
                    </h4>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="sectionWrapper">
                {/* <h1>FRIENDS COMPONENT</h1> */}
                {/* {!friends && <h1>TEST</h1>} */}

                <div className="cardContainer">
                    <div className="card">
                        {friends.length > 0 && (
                            <div className="friendsGlassOverlay">
                                <p>
                                    These developers are currently your friends
                                </p>
                            </div>
                        )}

                        <div className="friendsWrapper">
                            {!friends.length != 0 ? (
                                <pre
                                    style={{
                                        opacity: "0.8",
                                        fontSize: "16px",
                                        paddingLeft: "50%",
                                    }}
                                >
                                    It seems you don&#39;t have any friends yet,
                                    but..
                                </pre>
                            ) : (
                                friends &&
                                friends.map((friend) => (
                                    <div key={friend.id}>
                                        <div className="imgNameAlign">
                                            {/* <p>
                                                These people are currently your
                                                friends
                                            </p> */}
                                            <Link to={"/user/" + friend.id}>
                                                <img
                                                    className="profile_pic"
                                                    src={friend.profile_pic}
                                                />
                                                <p id="friendsWannabesLink">
                                                    {friend.first} {friend.last}{" "}
                                                    {/* {friends.length} */}
                                                </p>
                                            </Link>
                                            <button
                                                onClick={() =>
                                                    dispatch(
                                                        deleteFriendship(
                                                            friend.id
                                                        )
                                                    )
                                                }
                                            >
                                                {BUTTON_TEXT.UNFRIEND}
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {wannabes.length > 0 && (
                            <div className="friendsGlassOverlay">
                                <p>These developers want to be your friends</p>
                            </div>
                        )}

                        {/* <p>These people want to be your friends</p> */}
                        <div className="wannabesWrapper">
                            {wannabes &&
                                wannabes.map((wannabe) => (
                                    <div key={wannabe.id}>
                                        <div className="wannabesContainer">
                                            <Link to={"/user/" + wannabe.id}>
                                                <img
                                                    className="profile_pic"
                                                    src={wannabe.profile_pic}
                                                />
                                                <p id="friendsWannabesLink">
                                                    {wannabe.first}{" "}
                                                    {wannabe.last}
                                                </p>
                                            </Link>

                                            <div className="acceptBtnWrapper">
                                                <button
                                                    id="acceptBtn"
                                                    onClick={() =>
                                                        dispatch(
                                                            acceptFriendshipRequest(
                                                                wannabe.id
                                                            )
                                                        )
                                                    }
                                                >
                                                    {BUTTON_TEXT.ACCEPT_REQUEST}
                                                </button>
                                            </div>

                                            <div className="refuseBtnWrapper">
                                                <button
                                                    onClick={() =>
                                                        dispatch(
                                                            deleteFriendship(
                                                                wannabe.id
                                                            )
                                                        )
                                                    }
                                                >
                                                    Refuse Friend Requesst{" "}
                                                    {/* <p>Friend Request</p> */}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
