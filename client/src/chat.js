import { useSelector } from "react-redux";
import { socket } from "./socket"; // to send messages to the server
import { useEffect } from "react";
import { useRef } from "react";
import { Link } from "react-router-dom";
import OnlineUsers from "./onlineusers";

export default function Chat() {
    // 1. retrieve chat messages from Redux and rendere them
    const chatMessages = useSelector((state) => state && state.messages);

    const elemRef = useRef(); // for function
    //this.elemRef = React.createRef(); // for Class

    // 2. post new messages
    const handlekeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();

            // NB: we're going to send messages off using socket instead of axios
            // socket.emit will send a message to the server
            socket.emit("new chat message", e.target.value);
            e.target.value = "";
        }
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

    if (!chatMessages || !chatMessages.length) {
        return null;
    }

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
                            {chatMessages &&
                                chatMessages.map((message, index) => (
                                    <div id="imgLatest" key={index}>
                                        <div>
                                            {/* <h2>These people are currently your friends</h2> */}
                                            <Link to={"/user/" + message.id}>
                                                <div className="imgNameWrap">
                                                    <img
                                                        className="profile_pic"
                                                        src={
                                                            message.profile_pic
                                                        }
                                                        alt={message.name}
                                                        /* alt={`${message.first} ${message.last}`} */
                                                    />
                                                    {/* <p>
                                                        <b id="messageName">
                                                            {message.name}
                                                        </b>
                                                    </p> */}
                                                </div>
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
                                                </p>
                                            </Link>
                                            {/* <p>{message.timestamp}</p> */}
                                            <div
                                                id="chat-messages"
                                                ref={elemRef}
                                            >
                                                <p>{message.message}</p>
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
                                onKeyDown={handlekeyDown}
                            />
                        </div>
                        <div id="chatbuttonWrap">
                            <button /* onClick={handlekeyDown} */>
                                Post message in the chat
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
