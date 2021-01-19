import { useSelector } from "react-redux";
import { socket } from "./socket"; // to send messages to the server
import { useEffect } from "react";
import { useRef } from "react";
import { Link } from "react-router-dom";

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
            if (!abort) {
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
            <h1>Chat Room</h1>
            <div className="chatContainer" /* ref={elemRef} */>
                {chatMessages &&
                    chatMessages.map((message, index) => (
                        <div key={index}>
                            <div>
                                {/* <h2>These people are currently your friends</h2> */}
                                <Link to={"/user/" + message.id}>
                                    <img
                                        className="profile_pic"
                                        src={message.profile_pic}
                                        alt={message.name}
                                        /* alt={`${message.first} ${message.last}`} */
                                    />
                                    <h3>
                                        {message.name}
                                        {/* {message.first} {message.last} */}
                                    </h3>
                                </Link>
                                <span>{message.timestamp}</span>
                                <div id="chat-messages" ref={elemRef}>
                                    <p>{message.message}</p>
                                </div>
                            </div>
                        </div>
                    ))}
            </div>
            <div>
                <textarea
                    rows="5"
                    col="100"
                    placeholder="Enter your message here.."
                    onKeyDown={handlekeyDown}
                />
            </div>
            <button /* onClick={handlekeyDown} */>
                Post message in the chat
            </button>
        </>
    );
}
