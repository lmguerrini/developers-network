/* This will contain all of our action creators.
Action creator is just a function that returns an object.
The object that gets returned is the action. */
import axios from "./axios";
import { BUTTON_TEXT } from "../../shared-datas/button-friendships-text";

export async function getFriendsWannabesList() {
    const { data } = await axios.get("/friends-wannabes");
    console.log("Action GET /friends-wannabes data: ", data);
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
    console.log("Action POST /friends/action: Accepted friend request!");
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
    console.log("Action POST /friends/action: Refused friendship request!");
    return {
        type: "DELETE_FRIEND",
        unfriendUserId: Number(id),
    };
}

export async function postNewMessage(mostRecenteMessage) {
    console.log("Action postNewMessage!");
    console.log("action mostRecenteMessage: ", mostRecenteMessage);
    return {
        type: "POST_NEW_MESSAGE",
        message: mostRecenteMessage,
    };
}

export async function addTenMostRecentMessages(tenMostRecentMessages) {
    console.log("Action getTenMostRecentMessages!");
    console.log("tenMostRecentMessages: ", tenMostRecentMessages);

    return {
        type: "ADD_TEN_MOST_RECENT_MESSAGES",
        messages: tenMostRecentMessages,
    };
}
