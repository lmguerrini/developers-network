import { useSelector } from "react-redux";
import { socket } from "./socket"; // to send messages to the server

export default function Chat() {
    // 1. retrieve chat messages from Redux and rendere them
    const chatMessages = useSelector((state) => state && state.chatMessages);

    // 2. post new messages
    const handlekeyDown = (e) => {
        if (e.key === "Enter") {
            console.log("user pressed Enter!");
            // we are going to send messages off using socket instead of axios
            // socket.emit will send a message to the server
            socket.emit("my new chat message", e.target.value);
        }
    };

    return (
        <>
            <h1>Welcome to the chatroom</h1>
            <div className="chatContainer">
                <p>message..</p>
                <p>message..</p>
                <p>message..</p>
                <p>message..</p>
                <p>message..</p>
                <p>message..</p>
                <p>message..</p>
            </div>
            <textarea onKeyDown={handlekeyDown} />
        </>
    );
}
