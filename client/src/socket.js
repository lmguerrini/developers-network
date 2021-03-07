// client/src/socket.js
import io from "socket.io-client";
import {
    postNewMessage,
    addMostRecentMessages,
    getOnlineUsersList,
    postNewPrivateMessage,
    addMostRecentPrivateMessages,
    deletePrivateMessage,
} from "./actions";
import toaster from "toasted-notes";
import { MdNotificationsActive } from "react-icons/md";

export let socket;

// here we can't use react like in a react-component
// we'll dispatch like we did in friends.js
export const init = (store) => {
    if (!socket) {
        // because we want one socket per user (not one socket per diff tabs opened)
        socket = io.connect();
    }

    socket.on("online users", (onlineUsers) => {
        //console.log("socket.js onlineUsers: ", onlineUsers);
        store.dispatch(getOnlineUsersList(onlineUsers));
    });

    // this file will RECEIVE messaged from the server
    socket.on("new message and user profile", (mostRecenteMessage) => {
        console.log("Socket new message and user profile!");
        // mostRecenteMessage = {message,id,profile_pic,name,timestamp,}
        // hand over to redux => dispatch an action(->reducer):
        console.log("socket.js mostRecenteMessage: ", mostRecenteMessage);
        store.dispatch(postNewMessage(mostRecenteMessage)); // "mostRecenteMessage": name of my action creator
    });

    socket.on("notification new chat message", (notificationNewChatMessage) => {
        const senderName = `${notificationNewChatMessage.senderName}`;
        const pushNotificationText = ` has just written a new message in Chat. Check it out!`;
        const pushNotification = (
            <>
                <MdNotificationsActive className="pushNotificationFriendRequestBell" />
                &emsp;
                <span className="pushNotificationFriendRequestText">
                    <b>{senderName}</b>
                    {pushNotificationText}
                </span>
            </>
        );

        toaster.notify(pushNotification, {
            duration: 5000,
        });
    });

    socket.on("10 most recent messages", (tenMostRecentMessages) => {
        // this runs when a new user connects (logs in)
        // and see the messages already there on the page
        console.log("socket.js tenMostRecentMessages: ", tenMostRecentMessages);
        store.dispatch(addMostRecentMessages(tenMostRecentMessages.reverse()));
    });

    socket.on("new private message and users profiles", (newPrivateMessage) => {
        console.log("socket.js newPrivateMessage: ", newPrivateMessage);
        store.dispatch(postNewPrivateMessage(newPrivateMessage)); // "newPrivateMessage": name of my action creator
    });

    socket.on(
        "notification new private chat message",
        (notificationNewChatMessage) => {
            const senderNamePM = `${notificationNewChatMessage.senderNamePM}`;
            const pushNotificationText1 = ` has just written you a Private Message.`;
            const pushNotificationText2 = ` Check it out!`;
            const pushNotification = (
                <>
                    <MdNotificationsActive className="pushNotificationFriendRequestBell" />
                    &emsp;
                    <span className="pushNotificationFriendRequestText">
                        <b>{senderNamePM}</b>
                        {pushNotificationText1}
                        <br></br>
                        {pushNotificationText2}
                    </span>
                </>
            );

            toaster.notify(pushNotification, {
                duration: 5000,
            });
        }
    );

    socket.on("most recent private messages", (mostRecentPrivateMessages) => {
        // this runs when a new user connects (logs in)
        // and see the messages already there on the page
        console.log(
            "socket.js mostRecentPrivateMessages: ",
            mostRecentPrivateMessages
        );
        store.dispatch(
            addMostRecentPrivateMessages(mostRecentPrivateMessages)
        );
    });

    socket.on("delete private message", (privateMessageId) => {
        console.log("socket.js privateMessageId to delete: ", privateMessageId);
        store.dispatch(deletePrivateMessage(privateMessageId)); 
    });

    socket.on("notification friend request", (notificationFriendRequest) => {
        const pushNotificationText = `You have just got a new friend request from `;
        const senderName = `${notificationFriendRequest.senderName}`;
        const pushNotification = (
            <>
                <MdNotificationsActive className="pushNotificationFriendRequestBell" />
                &emsp;
                <span className="pushNotificationFriendRequestText">
                    {pushNotificationText}
                    <b>{senderName}</b>
                </span>
            </>
        );

        toaster.notify(pushNotification, {
            duration: 5000,
        });
    });

    socket.on(
        "notification friend request revoked",
        (notificationFriendRequestRevoked) => {
            const pushNotificationText1 = `Your friend request from `;
            const senderName = `${notificationFriendRequestRevoked.senderName}`;
            const pushNotificationText2 = ` has just been revoked 🚫`;
            const pushNotification = (
                <>
                    <MdNotificationsActive
                        className="pushNotificationFriendRequestBell"
                        id="revoked"
                    />
                    &emsp;
                    <span
                        className="pushNotificationFriendRequestText"
                        id="revoked"
                    >
                        {pushNotificationText1}
                        <b>{senderName}</b>
                        {pushNotificationText2}
                    </span>
                </>
            );

            toaster.notify(pushNotification, {
                duration: 5000,
            });
        }
    );
};

// socket.io is not only for the chat room but it's available (potentially) for the site's functionalities

//NB: this all file we could have written in chat.js, but like that looks more organized
