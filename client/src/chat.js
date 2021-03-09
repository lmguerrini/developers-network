import { useDispatch, useSelector } from "react-redux";
import { socket } from "./socket"; // to send messages to the server
import { useEffect } from "react";
import { useRef } from "react";
//import { Link } from "react-router-dom";
import OnlineUsers from "./onlineusers";
//import { deleteMessage } from "./actions";
import { RiDeleteBinLine } from "react-icons/ri";

export default function Chat() {
    // retrieve chat messages from Redux and rendere them
    const chatMessages = useSelector((state) => state && state.messages);
    console.log("chatoroom chatMessages: ", chatMessages);

    //const dispatch = useDispatch();

    const elemRef = useRef(); // for function
    //this.elemRef = React.createRef(); // for Class
    let message;
    // post new message
    const handlekeyDown = (e) => {
        if (e.key === "Enter") {
            //console.log("About to emit new chat msg from Chat.js..");
            e.preventDefault();

            // NB: we're going to send messages off using socket instead of axios
            // socket.emit will send a message to the server
            socket.emit("new chat message", e.target.value);
            e.target.value = "";
            socket.emit("notification new chat message");
        } else if (e.key) {
            message = e.target.value + e.key;
            //e.target.value = "";
        }
    };

    // post new message
    const handleClickDown = () => {
        socket.emit("new chat message", message);
        //e.target.value = "";
    };

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
    }, [chatMessages]);

    /* if (!chatMessages || !chatMessages.length) {
        return null;
    } */

    return (
        <>
            {/* <div id="welcomeBack">
                <p>
                    {" "}
                    <b>Chat Room</b>
                </p>
            </div> */}
            {/* <h1>Chat Room</h1> */}
            <div className="sectionWrapper">
                <div className="cardContainer" /* ref={elemRef} */>
                    <div className="cardChat">
                        <OnlineUsers></OnlineUsers>
                        <div className="chatHistoryContainer">
                            <div id="generalChatPaddingTop"></div>
                            {chatMessages &&
                                chatMessages.map((message, index) => (
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
                                            <p className="messageDateTimeDeleteBtnWrap">
                                                <b id="messageName">
                                                    {message.name}&emsp;
                                                </b>{" "}
                                                <span>
                                                    <small id="uploaderSigns">
                                                        ❮
                                                    </small>
                                                    &nbsp;
                                                    {message.timestamp}
                                                    &nbsp;
                                                    <small id="uploaderSigns">
                                                        ❯
                                                    </small>
                                                </span>
                                                {/* {message.first} {message.last} */}
                                                {/* <button
                                                    id="deleteMessageBtn"
                                                    onClick={() =>
                                                        dispatch(
                                                            deleteMessage(
                                                                message.id
                                                            )
                                                        )
                                                    }
                                                >
                                                    🗑
                                                    Delete Message with id{" "}
                                                    {message.id}
                                                </button> */}
                                                <RiDeleteBinLine
                                                    className="deleteMessageBtn"
                                                    /* id="deleteAccount" */
                                                    /* onClick={() =>
                                                        dispatch(
                                                            deleteMessage(
                                                                message.id
                                                            )
                                                        )
                                                    } */
                                                    onClick={() =>
                                                        /* {
                                                        window.confirm(
                                                            `[Chat Message DELETION] \nAre your sure you want to delete the Chat Message ` +
                                                                ` written ` +
                                                                `${message.chatMessageDateTime}` +
                                                                `? \n\nNote: there is no going back! Please be certain.`
                                                        ) && */
                                                        socket.emit(
                                                            "delete chat message",
                                                            {
                                                                chatMessageId: Number(
                                                                    message.chatMessageId
                                                                ),
                                                                chatMessageDateTime:
                                                                    message.chatMessageDateTime,
                                                            }
                                                        )
                                                    }
                                                />
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

                                                {/* <RiDeleteBinLine
                                                    onClick={() =>
                                                        dispatch(
                                                            deleteMessage(
                                                                message.id
                                                            )
                                                        )
                                                    }
                                                /> */}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                        <div className="chatTextareaContainer">
                            <textarea
                                id="chatTextarea"
                                rows="5"
                                cols="101"
                                placeholder="Enter your message here.."
                                onKeyDown={handlekeyDown}
                            />
                        </div>
                        <div id="chatbuttonWrap">
                            <button onClick={handleClickDown}>
                                Post message in the chat
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
