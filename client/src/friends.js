import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { BUTTON_TEXT } from "../../shared-datas/button-friendships-text";
import {
    getFriendsWannabesList,
    acceptFriendshipRequest,
    deleteFriendship,
} from "./actions";

export default function Friends() {
    console.log("Friends component mounted!");
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
            <div>
                <h1>
                    Ops, it seems you don&#39;t have any friends/friends
                    requests yet..
                </h1>
                <h4>
                    Note: You can click on &#39;Find People&#39; in order to
                    look for people to add as friend
                </h4>
            </div>
        );
    }

    return (
        <section>
            {/* <h1>FRIENDS COMPONENT</h1> */}
            {!friends && <h1>TEST</h1>}

            {!friends.length != 0 ? (
                <h1>It seems you don&#39;t have any friends yet, but..</h1>
            ) : (
                friends &&
                friends.map((friend) => (
                    <div key={friend.id}>
                        <div>
                            <h2>These people are currently your friends</h2>
                            <Link to={"/user/" + friend.id}>
                                <img
                                    className="profile_pic"
                                    src={friend.profile_pic}
                                />
                                <h3>
                                    {friend.first} {friend.last}
                                </h3>
                            </Link>
                            <button
                                onClick={() =>
                                    dispatch(deleteFriendship(friend.id))
                                }
                            >
                                {BUTTON_TEXT.UNFRIEND}
                            </button>
                        </div>
                    </div>
                ))
            )}

            {wannabes &&
                wannabes.map((wannabe) => (
                    <div key={wannabe.id}>
                        <div className="wannabesContainer">
                            <h2>These people want to be your friends</h2>
                            <Link to={"/user/" + wannabe.id}>
                                <img
                                    className="profile_pic"
                                    src={wannabe.profile_pic}
                                />
                                <h3>
                                    {wannabe.first} {wannabe.last}
                                </h3>
                            </Link>

                            <div>
                                <div>
                                    <button
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
                                <div>
                                    <p>or </p>
                                    <button
                                        onClick={() =>
                                            dispatch(
                                                deleteFriendship(wannabe.id)
                                            )
                                        }
                                    >
                                        Refuse {/* <p>Friend Request</p> */}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
        </section>
    );
}
