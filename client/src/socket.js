// client/src/socket.js
import io from "socket.io-client";
import { postNewMessage, addTenMostRecentMessages } from "./actions";

export let socket;

// here we can't use react like in a react-component
// we'll dispatch like we did in friends.js
export const init = (store) => {
    if (!socket) {
        // because we want one socket per user (not one socket per diff tabs opened)
        socket = io.connect();
    }

    // this file will RECEIVE messaged from the server
    socket.on("new message and user profile", (mostRecenteMessage) => {
        // mostRecenteMessage = {message,id,profile_pic,name,timestamp,}
        // hand over to redux => dispatch an action(->reducer):
        console.log("socket.js mostRecenteMessage: ", mostRecenteMessage);
        store.dispatch(postNewMessage(mostRecenteMessage)); // "postNewMessage": name of my action creator
    });

    socket.on("10 most recent messages", (tenMostRecentMessages) => {
        // this runs when a new user connects (logs in)
        // and see the messages already there on the page

        store.dispatch(addTenMostRecentMessages(tenMostRecentMessages.reverse()));
    });

    /* socket.on("someThirdEvent", (payload) => {
        // do something
    }); */
};

// socket.io is not only for the chat room but it's available (potentially) for the site's functionalities

//NB: this all file we could have written in chat.js, but like that looks more organized
