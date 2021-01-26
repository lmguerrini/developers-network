import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef } from "react";
//import { socket } from "./socket";
import { Link } from "react-router-dom";
import {
    addMostRecentPrivateMessages,
    postNewPrivateMessage,
    deletePrivateMessage,
} from "./actions";
//import OnlineUsers from "./onlineusers";

export default function PrivateMessages(props) {
    const privateChatMessages = useSelector(
        (state) => state && state.privateMessages
    );
    console.log("private chatMessages: ", privateChatMessages);

    const dispatch = useDispatch();
    const otherUserId = props.match.params.id;

    useEffect(() => {
        let abort;
        (async () => {
            if (!abort) {
                dispatch(addMostRecentPrivateMessages(otherUserId));
            }
        })();
        return () => {
            // NB: this runs before every next re-render
            abort = true;
        };
    }, []);

    // post new messages
    const handlekeyDownPrivate = (e) => {
        //console.log("private e value: ", e.target.value);
        if (e.key === "Enter") {
            e.preventDefault();
            const message = e.target.value;

            // socket.emit will send a message to the server
            //socket.emit("new private message", message, otherUserId);
            /* socket.emit("new private message", {
                message: e.target.value,
                senderId: userId,
                recipientId: otherUserId,
            }); */
            dispatch(postNewPrivateMessage(message, otherUserId));
            e.target.value = "";
        }
    };

    const elemRef = useRef(); // for function
    //this.elemRef = React.createRef(); // for Class

    useEffect(() => {
        let abort;
        (async () => {
            if (!abort && elemRef.current) {
                // "scrollIntoView" shouldn't happen until "elemRef" exists
                elemRef.current.scrollIntoView({ behavior: "smooth" });
            }
        })();
        return () => {
            // NB: this runs before every next re-render
            abort = true;
        };
    }, [privateChatMessages]);

    if (!privateChatMessages || !privateChatMessages.length) {
        return null;
    }

    return (
        <>
            {" "}
            {/* <h1>Private Messages between you and {otherUserId}</h1> */}
            <div className="sectionWrapper">
                <div className="cardContainer" /* ref={elemRef} */>
                    <div className="cardChat">
                        {/* <OnlineUsers></OnlineUsers> */}

                        <div className="wallPostsGlassOverlayWrap">
                            <div className="wallPostsGlassOverlay">
                                <h1 id="directMessages">
                                    <small id="uploaderSigns">❮</small>
                                    &nbsp;Direct Messages{" "}
                                    <small id="uploaderSigns">❯</small>
                                </h1>
                            </div>
                        </div>

                        <div className="chatHistoryContainer">
                            {privateChatMessages &&
                                privateChatMessages.map((message, index) => (
                                    <div id="imgLatest" key={index}>
                                        <div>
                                            {/* <h2>These people are currently your friends</h2> */}
                                            {/* <Link to={"/user/" + message.id}> */}
                                            <div className="imgNameWrap">
                                                <img
                                                    className="profile_pic"
                                                    src={message.profile_pic}
                                                    alt={message.name}
                                                    /* alt={`${message.first} ${message.last}`} */
                                                />
                                                {/* <p>
                                                        <b id="messageName">
                                                            {message.name}
                                                        </b>
                                                    </p> */}
                                            </div>
                                            {/* </Link> */}
                                            <p>
                                                <b id="messageName">
                                                    {message.name}
                                                </b>{" "}
                                                <small id="uploaderSigns">
                                                    ❮
                                                </small>
                                                &nbsp;
                                                {message.timestamp}&nbsp;
                                                <small id="uploaderSigns">
                                                    ❯
                                                </small>
                                                {/* {message.first} {message.last} */}
                                                <button
                                                    id="deleteMessageBtn"
                                                    onClick={() =>
                                                        dispatch(
                                                            deletePrivateMessage(
                                                                message.messageId
                                                            )
                                                        )
                                                    }
                                                >
                                                    🗑
                                                    {/* Delete Message with id{" "}
                                                    {message.id} */}
                                                </button>
                                            </p>

                                            {/* <p>{message.timestamp}</p> */}
                                            <div
                                                id="chat-messages"
                                                ref={elemRef}
                                            >
                                                <pre className="prettyprint">
                                                    <code className="language-javascript">
                                                        {message.message.startsWith(
                                                            "https://"
                                                        ) ? (
                                                            <a
                                                                href={
                                                                    message.message
                                                                }
                                                                target="_blank"
                                                                rel="noreferrer"
                                                            >
                                                                {
                                                                    message.message
                                                                }
                                                            </a>
                                                        ) : (
                                                            <span>
                                                                {
                                                                    message.message
                                                                }
                                                            </span>
                                                        )}
                                                    </code>

                                                    {/* {message.message} */}
                                                </pre>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                        <div className="chatTextareaContainer">
                            <textarea
                                id="chatTextarea"
                                rows="5"
                                cols="98"
                                placeholder="Enter your message here.."
                                onKeyDown={handlekeyDownPrivate}
                            />
                        </div>
                        {/* <div id="chatbuttonWrap">
                            <button onClick={handleClickDown}>
                                Post message in the chat
                            </button>
                        </div> */}
                        <div id="chatbuttonWrap">
                            <Link to={`/user/${otherUserId}`}>
                                <button className="friendButton">
                                    Close Direct Messages Chat
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
