/* This will contain all of our action creators.
Action creator is just a function that returns an object.
The object that gets returned is the action. */
import axios from "./axios";
import { BUTTON_TEXT } from "../../shared-datas/button-friendships-text";

export async function getFriendsWannabesList() {
    const { data } = await axios.get("/friends-wannabes");
    //console.log("Action GET /friends-wannabes data: ", data);
    return {
        type: "GET_FRIENDS_WANNABES_LIST",
        friendsWannabesList: data.rows,
    };
}

export async function acceptFriendshipRequest(id) {
    await axios.post("/friendship/action", {
        recipientId: Number(id),
        action: BUTTON_TEXT.ACCEPT_REQUEST,
    });
    //console.log("Action POST /friends/action: Accepted friend request!");
    return {
        type: "ACCEPT_FRIEND_REQUEST",
        acceptUserId: Number(id),
    };
}

export async function deleteFriendship(id) {
    await axios.post("/friendship/action", {
        recipientId: Number(id),
        action: BUTTON_TEXT.UNFRIEND,
    });
    //console.log("Action POST /friends/action: Refused friendship request!");
    return {
        type: "DELETE_FRIEND",
        unfriendUserId: Number(id),
    };
}

export async function postNewMessage(mostRecenteMessage) {
    //console.log("Action postNewMessage!");
    return {
        type: "POST_NEW_MESSAGE",
        message: mostRecenteMessage,
    };
}

export async function deleteMessage(messageId) {
    //console.log("Action deleteMessage!");
    await axios.post("/message/delete", {
        message: messageId,
    });
    //console.log("Action POST /message/delete messageId: ", messageId);

    return {
        type: "DELETE_MESSAGE",
        message: messageId,
    };
}

export async function deletePrivateMessage(messageId) {
    //console.log("Action deletePrivateMessage!");
    await axios.post("/privatemessage/delete", {
        message: messageId,
    });
    //console.log("Action POST /privatemessage/delete messageId: ", messageId);

    return {
        type: "DELETE_PRIVATE_MESSAGE",
        privatemessage: messageId,
    };
}

export async function addMostRecentMessages(tenMostRecentMessages) {
    //console.log("Action getMostRecentMessages!");
    return {
        type: "ADD_TEN_MOST_RECENT_MESSAGES",
        messages: tenMostRecentMessages,
    };
}

export async function getOnlineUsersList(onlineUsers) {
    //console.log("Action getOnlineUsers!"):
    return {
        type: "GET_ONLINE_USERS_LIST",
        onlineUsersList: onlineUsers,
    };
}

/* export async function postNewPrivateMessage(newPrivateMessage) {
    //console.log("Action getNewPrivateMessages!");
    console.log("Action mostRecentePrivateMessage: ", newPrivateMessage);

    return {
        type: "POST_NEW_PRIVATE_MESSAGE",
        privateMessage: newPrivateMessage,
    };
} */

/* export async function addMostRecentPrivateMessages(mostRecentPrivateMessages) {
    //console.log("Action addMostRecentPrivateMessages!");
    console.log(
        "Action mostRecentPrivateMessages: ",
        mostRecentPrivateMessages
    );
    return {
        type: "ADD_MOST_RECENT_PRIVATE_MESSAGES",
        latestPrivateMessages: mostRecentPrivateMessages,
    };
} */

export async function addMostRecentPrivateMessages(id) {
    //console.log("Action addMostRecentPrivateMessages!");
    const { data } = await axios.get(`/message/private/${id}`);
    //console.log("Action GET /message/private/:id data: ", data.newRows);

    return {
        type: "ADD_MOST_RECENT_PRIVATE_MESSAGES",
        latestPrivateMessages: data.newRows,
    };
}

export async function postNewPrivateMessage(message, otherUserId) {
    //console.log("Action postNewPrivateMessage!");
    const { data } = await axios.post("/message/private", {
        message: message,
        recipientId: Number(otherUserId),
    });
    //console.log("Action POST /message/private data: ", data.newRows);

    return {
        type: "POST_NEW_PRIVATE_MESSAGE",
        privateMessage: data.newRows,
    };
}

export async function getWallPosts(id) {
    //console.log("Action addMostRecentPrivateMessages!");
    const { data } = await axios.get(`/wall/posts/${id}`);
    //console.log("Action GET /wall/posts/:id data: ", data.newRows);

    return {
        type: "GET_WALL_POSTS",
        wallPost: data.newRows,
    };
}

export async function postWallPost(formData) {
    //console.log("Action addMostRecentPrivateMessages!");
    const { data } = await axios.post(`/wall/posts/`, formData);
    //console.log("Action POST /wall/posts/ data: ", data.newRows);

    return {
        type: "POST_WALL_POST",
        wallPost: data.newRows,
    };
}
