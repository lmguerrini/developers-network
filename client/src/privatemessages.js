import { useSelector } from "react-redux"; // useDispatch
import { useEffect, useRef, useState } from "react";
import { socket } from "./socket";
import { Link } from "react-router-dom";
/* import {
    addMostRecentPrivateMessages,
    postNewPrivateMessage,
    deletePrivateMessage,
} from "./actions"; */
import { RiDeleteBinLine } from "react-icons/ri";
import { RiGitRepositoryPrivateLine } from "react-icons/ri";
//import OnlineUsers from "./onlineusers";

export default function PrivateMessages(props) {
    //console.log("PrivateMessages props: ", props);
    const [count, setCount] = useState(0);
    const privateChatMessages = useSelector(
        (state) => state && state.privateMessages
    );

    //const dispatch = useDispatch(); // delete PM
    const recipientId = props.match.params.id;
    //console.log("PrivateMessages recipientId: ", recipientId);
    let newPMNum = [];

    //console.log(" privateChatMessagesNum: ", privateChatMessagesNum);
    if (
        privateChatMessages /* &&
        privateChatMessagesNum != isNaN &&
        privateChatMessagesNum != undefined */
    ) {
        /* const count = 0;
        newPMNum =
            privateChatMessages.length - (privateChatMessages.length - 1);
        console.log("privateChatMessagesNum: ", newPMNum); */
        //console.log(" privateChatMessagesNum: ", privateChatMessagesNum);
        console.log("PrivateMessages length: ", privateChatMessages.length);
    }
    if (privateChatMessages && newPMNum < privateChatMessages.length) {
        console.log("new, all: ", newPMNum, privateChatMessages.length);
    }

    //console.log("PrivateMessages props: ", props);
    /* const sendDataToParent = () => {
        console.log("PM length", newPMNum);
        props.parentCallback(newPMNum);
    }; */
    //var socket = io.connect("/privatemessage", { query: otherUserId });

    useEffect(() => {
        let abort;
        (async () => {
            if (!abort) {
                //console.log("PrivateMessages useEffect");

                socket.emit(
                    "get most recent private messages",
                    Number(recipientId)
                );

                //dispatch(addMostRecentPrivateMessages(recipientId));
            }
        })();
        return () => {
            // NB: this runs before every next re-render
            abort = true;
        };
    }, []);

    // post new private messages
    const handlekeyDownPrivate = (e) => {
        //console.log("private e value: ", e.target.value);
        if (e.key === "Enter") {
            e.preventDefault();
            const message = e.target.value;

            // socket.emit will send a message to the server
            //socket.emit("new private message", message, otherUserId);
            console.log("notificationCount B :", notificationCount, count);
            const notificationCount = setCount(count + 1);
            console.log("notificationCount A :", notificationCount);
            socket.emit("new private message", {
                message,
                //senderId: userId,
                recipientId,
                newNotificationPM: count + 1,
            });
            //dispatch(postNewPrivateMessage(message, otherUserId));

            /* newPMNum.push(1);
            console.log("(newPMNum += 1) :", newPMNum);
            if (newPMNum > 1) {
                //props.parentCallback(newPMNum + 1);
                //sendDataToParent();
                console.log("count B :", count);
                props.parentCallback(setCount(count + 1));
                console.log("count A :", count);
            }
            console.log("count B :", count);
            props.parentCallback(setCount(count + 1));
            console.log("count A :", count); */
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

    /* if (!privateChatMessages || !privateChatMessages.length) {
        return null;
    } */

    return (
        <>
            {" "}
            {/* <h1>Private Messages between you and {otherUserId}</h1> */}
            <div className="sectionWrapper">
                <div className="cardContainer" /* ref={elemRef} */>
                    <div className="cardChat">
                        {/* <OnlineUsers></OnlineUsers> */}

                        <div className="wallPostsGlassOverlayWrap">
                            <div className="wallPostsGlassOverlay visible">
                                <h1 id="directMessages">
                                    <small id="uploaderSigns">❮</small>
                                    &nbsp;
                                    <RiGitRepositoryPrivateLine id="privateChatIcon" />{" "}
                                    Private Chat{/* Messages */}{" "}
                                    <small id="uploaderSigns">❯</small>
                                </h1>
                            </div>
                        </div>

                        <div className="chatHistoryContainer">
                            <div id="privateChatPaddingTop"></div>
                            {privateChatMessages &&
                                privateChatMessages.map((message, index) => (
                                    <div id="imgLatest" key={index}>
                                        <div>
                                            {/* <h2>These people are currently your friends</h2> */}
                                            {/* <Link to={"/user/" + message.id}> */}
                                            <div className="imgNameWrap">
                                                <img
                                                    className="profile_pic"
                                                    src={
                                                        message.senderProfile_picPM
                                                    }
                                                    alt={message.senderNamePM}
                                                    /* alt={`${message.first} ${message.last}`} */
                                                />
                                                {/* <p>
                                                        <b id="messageName">
                                                            {message.name}
                                                        </b>
                                                    </p> */}
                                            </div>
                                            {/* </Link> */}
                                            <p className="messageDateTimeDeleteBtnWrapPM">
                                                <b id="messageName">
                                                    {message.senderNamePM}&nbsp;
                                                </b>{" "}
                                                <small id="uploaderSigns">
                                                    ❮
                                                </small>
                                                &nbsp;
                                                {message.privateMessageDateTime}
                                                &nbsp;
                                                <small id="uploaderSigns">
                                                    ❯
                                                </small>
                                                {/* {message.first} {message.last} */}
                                                {/* <button
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
                                                    Delete Message with id{" "}
                                                    {message.id}
                                                </button> */}
                                                <RiDeleteBinLine
                                                    className="deleteMessageBtn"
                                                    /* id="deleteAccount" */
                                                    /* onClick={() =>
                                                        dispatch(
                                                            deletePrivateMessage(
                                                                message.privateMessageId
                                                            )
                                                        )
                                                    } */
                                                    /* onClick={() =>
                                                        socket.emit(
                                                            "delete private message",
                                                            {
                                                                privateMessageId: Number(
                                                                    message.privateMessageId
                                                                ),
                                                                privateMessageDateTime:
                                                                    message.privateMessageDateTime,
                                                            }
                                                        )
                                                    } */
                                                    onClick={() => {
                                                        /* message.privateMessage.toString()
                                                            .lenght < 150
                                                            ? window.confirm(
                                                                  `[PM DELETION] \nAre your sure you want to delete the Private Message ` +
                                                                  `"${message.privateMessage}"` +
                                                                      ` written ` +
                                                                      `${message.privateMessageDateTime}` +
                                                                      `? \n\nNote: there is no going back! Please be certain.`
                                                              ) &&
                                                              socket.emit(
                                                                  "delete private message",
                                                                  {
                                                                      privateMessageId: Number(
                                                                          message.privateMessageId
                                                                      ),
                                                                      privateMessageDateTime:
                                                                          message.privateMessageDateTime,
                                                                  }
                                                              )
                                                            : */ /* window.confirm(
                                                            `[PM DELETION] \nAre your sure you want to delete the Private Message ` +
                                                                ` written ` +
                                                                `${message.privateMessageDateTime}` +
                                                                `? \n\nNote: there is no going back! Please be certain.`
                                                        ) && */
                                                        socket.emit(
                                                            "delete private message",
                                                            {
                                                                privateMessageId: Number(
                                                                    message.privateMessageId
                                                                ),
                                                                privateMessageDateTime:
                                                                    message.privateMessageDateTime,
                                                            }
                                                        );
                                                    }}
                                                />
                                            </p>

                                            {/* <p>{message.timestamp}</p> */}
                                            <div
                                                id="chat-messages"
                                                ref={elemRef}
                                            >
                                                {message.privateMessage.startsWith(
                                                    "https://"
                                                ) ? (
                                                    <pre>
                                                        <a
                                                            href={
                                                                message.privateMessage
                                                            }
                                                            target="_blank"
                                                            rel="noreferrer"
                                                        >
                                                            {
                                                                message.privateMessage
                                                            }
                                                        </a>
                                                    </pre>
                                                ) : (
                                                    <pre className="prettyprint">
                                                        <code className="language-javascript">
                                                            <span>
                                                                {
                                                                    message.privateMessage
                                                                }
                                                            </span>
                                                        </code>
                                                    </pre>
                                                )}
                                                {/* {message.privateMessage} */}
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
                                onKeyDown={handlekeyDownPrivate}
                            />
                        </div>
                        {/* <div id="chatbuttonWrap">
                            <button onClick={handleClickDown}>
                                Post message in the chat
                            </button>
                        </div> */}
                        <div id="chatbuttonWrap">
                            <Link to={`/user/${recipientId}`}>
                                <button className="friendButton">
                                    Close Private {/* Messages */} Chat
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
