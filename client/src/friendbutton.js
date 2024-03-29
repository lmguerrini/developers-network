import axios from "./axios";
import { useState, useEffect } from "react";
import { BUTTON_TEXT } from "../../shared-datas/button-friendships-text";
import { socket } from "./socket";

export default function FriendButton({ id }) {
    const [buttonText, setButtonText] = useState("");
    const [error, setError] = useState(false);
    const recipientId = Number(id);

    // componentDidMount (class) => useEffect (fn)
    useEffect(() => {
        // everytime there's a re-render useEffect will be rentered
        let abort;
        // NB if we wanna use an async fn we have to use it in a IIFE
        (async () => {
            const { data } = await axios.get(
                `/friendship/status/${recipientId}`
            );
            //console.log("data: ", data);
            if (recipientId && !abort) {
                //console.log("data from GET /friendship/status/${recipientId}: ", data);
                if (data.friendshipRequest) {
                    if (!data.senderUser) {
                        //console.log("BUTTON_TEXT.ACCEPT_REQUEST");
                        return setButtonText(BUTTON_TEXT.ACCEPT_REQUEST);
                    } else {
                        //console.log("BUTTON_TEXT.REFUSE_REQUEST");
                        return setButtonText(BUTTON_TEXT.REFUSE_REQUEST);
                    }
                } else if (!data.friendship) {
                    //console.log("BUTTON_TEXT.SEND_REQUEST");
                    return setButtonText(BUTTON_TEXT.SEND_REQUEST);
                } else if (data.friendship) {
                    //console.log("BUTTON_TEXT.UNFRIEND");
                    return setButtonText(BUTTON_TEXT.UNFRIEND);
                } else if (data.error) {
                    return setError(true);
                }
            }
        })();

        // cleanup function
        return () => {
            // NB: this runs before every re-render
            abort = true;
        };
    }, [recipientId]);

    const handleClick = () => {
        if (buttonText == "Add Friend") {
            socket.emit("notification friend request", Number(recipientId));
        } else if (buttonText == "Cancel Friend Request") {
            socket.emit(
                "notification friend request revoked",
                Number(recipientId)
            );
        }
        axios
            //.get(`/other-user/info/${this.props.match.params.id}`)
            .post("/friendship/action", {
                action: buttonText,
                recipientId: Number(recipientId),
            })
            .then(({ data }) => {
                // console.log(
                //     "FriendButton POST handleClick: button value updated!)"
                // );
                setButtonText(data.buttonValue);
            })
            .catch((err) => {
                console.error(
                    "err axios POST/FriendButton/handleClick catch: ",
                    err
                );
                return setError(true);
            });
    };

    //console.log("FriendButton component rendered");
    return (
        <>
            {/* <h5>[FriendButton]</h5> */}
            {/* <div className="registrationError">
                {error && <span>Ops, something went wrong!</span>}
            </div> */}
            <div className="friendButtonContainer">
                <button className="friendButton" onClick={handleClick}>
                    {buttonText == "Cancel Friend Request" /* || */ ? (
                        /* buttonText == "Unfriend"  */ <p
                            style={{
                                color: "red",
                                fontSize: "1em",
                            }}
                        >
                            {buttonText}
                        </p>
                    ) : buttonText == "Unfriend" ? (
                        <p
                            style={{
                                color: "red",
                                height: "40px",
                                paddingTop: "10px",
                                fontSize: "0.95em",
                            }}
                        >
                            {buttonText}
                        </p>
                    ) : buttonText == "Accept Friend Request" ? (
                        <p
                            style={{
                                color: "lime",
                                height: "50px",
                                fontSize: "1em",
                            }}
                        >
                            {buttonText}
                        </p>
                    ) : (
                        // buttonText
                        <p
                            style={{
                                height: "40px",
                                padding: "10px 10px 0 10px",
                                fontSize: "0.95em",
                            }}
                        >
                            {buttonText}
                        </p>
                    )}
                </button>
            </div>
            <div className="registrationError">
                {error && <span>Ops, something went wrong!</span>}
            </div>
        </>
    );
}
