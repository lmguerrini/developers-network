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
import useMediaQuery from "@material-ui/core/useMediaQuery";
// import OtherProfile from "./otherprofile";
//import OnlineUsers from "./onlineusers";

export default function PrivateMessages(props) {
    const [count, setCount] = useState(0);
    const privateChatMessages = useSelector(
        (state) => state && state.privateMessages
    );
    const namerecipientPM = props.nameFromOPforPM;
    const mediaQuery1024px = useMediaQuery("(max-device-width:1024px)");
    const mediaQuery375px = useMediaQuery("(max-device-width:430px)");
    const matrixCodeAnimation = document.getElementsByClassName("matrixCode");
    const appParentWrapper =
        document.getElementsByClassName("appParentWrapper");
    //const dispatch = useDispatch(); // delete PM
    const recipientId = props.match.params.id;
    //console.log("PrivateMessages recipientId: ", recipientId);

    /* const sendDataToParent = () => {
        console.log("PM length", newPMNum);
        props.parentCallback(newPMNum);
    }; */
    //var socket = io.connect("/privatemessage", { query: otherUserId });

    useEffect(() => {
        let abort;
        (async () => {
            if (!abort) {
                props.sendDataToParent(false); // App's state profilePage: false
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

            //socket.emit("new private message", message, otherUserId);
            const notificationCount = setCount(count + 1);
            console.log("notificationCount :", notificationCount, count);

            socket.emit("new private message", {
                message,
                //senderId: userId,
                recipientId,
                newNotificationPM: count + 1,
            });
            //dispatch(postNewPrivateMessage(message, otherUserId));

            e.target.value = "";
        }
    };

    const elemRef = useRef(); // for function
    //this.elemRef = React.createRef(); // for Class

    useEffect(() => {
        let abort;
        (async () => {
            if (!abort && elemRef.current) {
                if (!window.location.hash || window.location.hash == "") {
                    window.location = window.location + "#reloadedPM";
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
                    if (window.scrollY > 0) {
                        window.scroll({
                            top: 0,
                            left: 0,
                            behavior: "smooth",
                        });
                    }
                }, 1500);
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
            {/* <OtherProfile
                dataFromOP={props}
                // recipientNamePM={`${this.state.first} ${this.state.last}`}
            />{" "} */}
            {/* <h1>Private Messages between you and {otherUserId}</h1> */}
            <div className="sectionWrapper sectionChatWrapper">
                <div
                    className="cardContainer cardContainerPM cardContainer375" /* ref={elemRef} */
                >
                    <div className="cardChat">
                        {/* <OnlineUsers></OnlineUsers> */}

                        <div className="wallPostsGlassOverlayWrap">
                            <div className="wallPostsGlassOverlay visible wallPostsGlassOverlayPM">
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
                                                    className="profile_pic profile_picChat375"
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
                                                                privateMessageId:
                                                                    Number(
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
                                                className="chatMessages375"
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
                            {privateChatMessages == 0 && (
                                <p
                                    style={{
                                        zoom: "1.2",
                                        color: "gray",
                                        top: "40%",
                                        paddingTop: "20vh",
                                        textAlign: "center",
                                    }}
                                >
                                    No PM has been written yet_
                                </p>
                            )}
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
                                placeholder={
                                    privateChatMessages != 0
                                        ? "Enter your private message here.."
                                        : namerecipientPM
                                        ? "Say 👋🏼 to " + `${namerecipientPM}!`
                                        : "No PM has been written yet. Be the first one to write a message!"
                                }
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
                                <button className="friendButton closeBtnPM">
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
