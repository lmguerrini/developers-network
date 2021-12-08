import { useSelector } from "react-redux"; // useDispatch
import { socket } from "./socket"; // to send messages to the server
import { useEffect } from "react";
import { useRef } from "react";
import { Link } from "react-router-dom";
import OnlineUsers from "./onlineusers";
//import { deleteMessage } from "./actions";
import { RiDeleteBinLine } from "react-icons/ri";
import useMediaQuery from "@material-ui/core/useMediaQuery";

export default function Chat({ sendDataToParent }) {
    // retrieve chat messages from Redux and render them
    const chatMessages = useSelector((state) => state && state.messages);
    //const dispatch = useDispatch();
    const mediaQuery1024px = useMediaQuery("(max-device-width:1024px)");
    const mediaQuery375px = useMediaQuery("(max-device-width:430px)");
    const matrixCodeAnimation = document.getElementsByClassName("matrixCode");
    const appParentWrapper =
        document.getElementsByClassName("appParentWrapper");
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
        } else if (e.key != "Backspace") {
            message = e.target.value + e.key;
            //e.target.value = "";
        } else if (e.key == "Backspace") {
            message = message.slice(0, -1);
        }
    };

    // post new message
    const handleClickDown = () => {
        socket.emit("new chat message", message);
        //e.target.value = "";
    };

    useEffect(() => {
        let abort;
        // let reload = false;
        (async () => {
            if (!abort && elemRef.current) {
                if (!window.location.hash) {
                    window.location = window.location + "#reloaded";
                    window.location.reload();
                } else {
                    if (!mediaQuery1024px) {
                        for (let a = 0; a < matrixCodeAnimation.length; a++) {
                            matrixCodeAnimation[a].classList.add(
                                "matrixCodeVisible"
                            );
                        }
                        for (let b = 0; b < appParentWrapper.length; b++) {
                            appParentWrapper[b].classList.add(
                                "appParentWrapperVisible"
                            );
                        }
                    }
                }
                // "scrollIntoView" shouldn't happen until "elemRef" exists
                elemRef.current.scrollIntoView({
                    block: "end",
                    inline: "nearest",
                    behavior: "smooth",
                });

                setTimeout(function () {
                    sendDataToParent(false); // App's state profilePage: false
                    // console.log("window.scrollY--: ", window.scrollY);
                    if (window.scrollY > 0) {
                        window.scroll({
                            top: 0,
                            left: 0,
                            behavior: "smooth",
                        });
                    }
                    // console.log("window.location.hash :", window.location.hash);
                }, 1500);
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
            <div className="sectionWrapper sectionChatWrapper">
                <div
                    className="cardContainer cardContainer375" /* ref={elemRef} */
                >
                    <div className="cardChat  cardChat375">
                        {" "}
                        {/* cardFriends375 */}
                        <OnlineUsers></OnlineUsers>
                        <div className="chatHistoryContainer">
                            <div id="generalChatPaddingTop"></div>
                            {chatMessages &&
                                chatMessages.map((message, index) => (
                                    <div id="imgLatest" key={index}>
                                        <div>
                                            {/* <h2>These people are currently your friends</h2> */}

                                            <div className="imgNameWrap">
                                                <Link
                                                    to={
                                                        "/user/" +
                                                        message.senderId
                                                    }
                                                >
                                                    <img
                                                        className="profile_pic profile_picChat375"
                                                        src={
                                                            message.profile_pic
                                                        }
                                                        alt={message.name}
                                                        /* alt={`${message.first} ${message.last}`} */
                                                    />
                                                </Link>
                                                {/* <p>
                                                        <b id="messageName">
                                                            {message.name}
                                                        </b>
                                                    </p> */}
                                            </div>

                                            <p className="messageDateTimeDeleteBtnWrap">
                                                <b id="messageName">
                                                    &nbsp;{message.senderName}
                                                    &emsp;
                                                </b>{" "}
                                                <span>
                                                    <small id="uploaderSigns">
                                                        ❮
                                                    </small>
                                                    &nbsp;
                                                    {
                                                        message.chatMessageDateTime
                                                    }
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
                                                                chatMessageId:
                                                                    Number(
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
                                                className="chatMessages375"
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
                                                                className="chatLink"
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
                                                    </code>{" "}
                                                </pre>

                                                {/* {message.message} */}

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
                                rows="3"
                                cols={
                                    !mediaQuery375px
                                        ? !mediaQuery1024px
                                            ? "93"
                                            : "110"
                                        : "60"
                                }
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
