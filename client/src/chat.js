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
        /* console.log(
            "message which is about to be sent to the server: ",
            e.target.value
        ); */
        if (e.key === "Enter") {
            console.log("user pressed Enter!");
            // NB: we're going to send messages off using socket instead of axios
            // socket.emit will send a message to the server
            socket.emit("new chat message", e.target.value);
        }
    };

    /* useEffect(() => {
        console.log("useEffect");
        let abort;
        (async () => {
            if (!abort) {
                elemRef.current.scrollTop;
                //elemRef.current.scrollBottom({ behavior: "smooth" });
            }
        })();
        return () => {
            // NB: this runs before every next re-render
            abort = true;
        };
    }, []); */

    if (!chatMessages || !chatMessages.length) {
        return null;
    }

    return (
        <>
            <h1>Chat Room</h1>
            <div className="chatContainer">
                {/* <p>message..</p>
                <p>message..</p>
                <p>message..</p>
                <p>message..</p>
                <p>message..</p>
                <p>message..</p>
                <p>message..</p> */}
                {chatMessages &&
                    chatMessages.map((message) => (
                        <div key={message.id}>
                            <div>
                                {/* <h2>These people are currently your friends</h2> */}
                                <Link to={"/user/" + message.id}>
                                    <img
                                        className="profile_pic"
                                        src={message.profile_pic}
                                        alt={(message.first, message.last)}
                                    />
                                    <h3>
                                        {/* {message.first} {message.last} */}
                                        {message.name}
                                    </h3>
                                </Link>
                                <span>
                                    {/* on {message.created_at.substring(0, 10)} at{" "}
                                    {message.created_at.substring(11, 19)} */}
                                    {message.timestamp}
                                </span>
                                <div id="chat-messages" ref={elemRef}>
                                    <p>message: {message.message}</p>
                                </div>
                                {/* <p ref={elemRef}>{message.message}</p> */}
                            </div>
                        </div>
                    ))}
            </div>
            <textarea
                rows="5"
                col="100"
                placeholder="Enter your message here.."
                onKeyDown={handlekeyDown}
            />
            <button>Post message in the chat</button>
        </>
    );
}
