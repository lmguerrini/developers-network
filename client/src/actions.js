/* This will contain all of our action creators.
Action creator is just a function that returns an object.
The object that gets returned is the action. */
import axios from "./axios";
import { BUTTON_TEXT } from "../../shared-datas/button-friendships-text";
import toaster from "toasted-notes";
import { MdNotificationsActive } from "react-icons/md";
import moment from "moment";

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

export async function deleteMessage(chatMessageId) {
    //console.log("Action deleteMessage!", chatMessageId);
    /* await axios.post("/message/delete", {
        message: messageId,
    }); */
    //console.log("Action POST /message/delete messageId: ", messageId);

    return {
        type: "DELETE_MESSAGE",
        chatMessageToDelete: chatMessageId,
    };
}

export async function deletePrivateMessage(privateMessageId) {
    //console.log("Action deletePrivateMessage!");

    /* await axios.post("/privatemessage/delete", {
        message: privateMessageId,
    }); */
    /* console.log(
        "Action POST /privatemessage/delete privateMessageId: ",
        privateMessageId
    ); */
    return {
        type: "DELETE_PRIVATE_MESSAGE",
        privatemessageToDelete: privateMessageId,
    };
}

export async function addMostRecentMessages(mostRecentChatMessages) {
    //console.log("Action getMostRecentMessages!");
    return {
        type: "ADD_TEN_MOST_RECENT_MESSAGES",
        messages: mostRecentChatMessages,
    };
}

export async function getOnlineUsersList(onlineUsers) {
    //console.log("Action getOnlineUsers!"):
    return {
        type: "GET_ONLINE_USERS_LIST",
        onlineUsersList: onlineUsers,
    };
}

export async function postNewPrivateMessage(newPrivateMessage) {
    //console.log("Action postNewPrivateMessages!");

    return {
        type: "POST_NEW_PRIVATE_MESSAGE",
        privateMessage: newPrivateMessage,
    };
}

export async function postNewPrivateMessageNotification(newPMNotification) {
    console.log("Action postNewPrivateMessageNotification!", newPMNotification);

    return {
        type: "POST_NEW_PRIVATE_MESSAGE_NOTIFICATION",
        privateMessageNotification: newPMNotification,
    };
}

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

export async function addMostRecentPrivateMessages(mostRecentPrivateMessages) {
    //console.log("Action addMostRecentPrivateMessages!");

    //const { data } = await axios.get(`/privatemessage/${id}`);
    //console.log("Action GET /privatemessage/:id data.newRows: ", data.newRows);

    return {
        type: "ADD_MOST_RECENT_PRIVATE_MESSAGES",
        latestPrivateMessages: mostRecentPrivateMessages,
    };
}
/* 
//without socket.io
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
} */

export async function addmostRecentPMNotifications(mostRecentPMNotifications) {
    /* console.log(
        "Action addMostRecentPrivateMessages!",
        mostRecentPMNotifications
    ); */

    return {
        type: "ADD_MOST_RECENT_PM_NOTIFICATIONS",
        notificationPM: mostRecentPMNotifications,
    };
}

export async function addmostRecentFriendshipRequestNotifications(
    mostRecentFriendshipRequestNotifications
) {
    /* console.log(
        "Action addmostRecentFriendshipRequestNotifications!",
        mostRecentFriendshipRequestNotifications
    ); */

    return {
        type: "ADD_MOST_RECENT_FRIENDSHIP_REQUEST_NOTIFICATIONS",
        notificationFriendshipRequest: mostRecentFriendshipRequestNotifications,
    };
}

export async function getWallPosts(id) {
    //console.log("Action getWallPosts!", id);
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

export async function getWallPostComments(id) {
    //console.log("Action getWallPostComments!", id);
    const { data } = await axios.get(`/wall/post/comments/${id}`);
    //console.log("Action GET /wall/post/comments/:id data: ", data);

    return {
        type: "GET_WALL_POST_COMMENTS",
        wallPostComments: data,
    };
}

export async function postWallPostComment(
    newWallPostComment,
    userWallId,
    postId
) {
    //console.log("Action postWallPostComment!", newWallPostComment);
    const { data } = await axios.post("/wall/post/comments", {
        newWallPostComment,
        userWallId,
        postId,
    });
    if (data.error) {
        //console.log("Action POST /wall/post/comments data.error: ", data.error);
        return {
            type: "POST_WALL_POST_COMMENT_ERROR",
            newWallPostCommentError: data.error,
        };
    } else {
        //console.log("Action POST /wall/post/comments data[0]: ", data[0]);

        return {
            type: "POST_WALL_POST_COMMENT",
            newWallPostComment: data[0],
        };
    }
}

export async function deleteComment(commentId) {
    //console.log("Action deleteComment!", commentId);
    const { data } = await axios.post("/comment/delete", {
        commentId,
    });
    //console.log("Action POST /comment/delete data: ", data[0]);

    // notification comment deletion
    const commentTextDeleted = data[0].comment;
    const commentDateTimeFromNowDeleted = moment(data[0].created_at).fromNow();
    const pushNotificationText1 = `✅ You have just successfully deleted the comment with the text '`;
    const pushNotification = (
        <>
            <MdNotificationsActive id="pushNotificationFriendRequestBell" />
            &emsp;
            <span className="pushNotificationFriendRequestText">
                {pushNotificationText1}
                {commentTextDeleted}&apos; written
                {commentDateTimeFromNowDeleted}.
            </span>
        </>
    );
    toaster.notify(pushNotification, {
        duration: 5000,
    });

    return {
        type: "DELETE_COMMENT",
        wallPostCommentToDelete: commentId,
    };
}

export async function getWallPostCommentsReplies(userWallId) {
    //console.log("Action getWallPostCommentsReplies!", id);
    const { data } = await axios.get(
        `/wall/post/comments-replies/${userWallId}`
    );
    //console.log("Action GET /wall/post/comments-replies/:id data: ", data);

    return {
        type: "GET_WALL_POST_COMMENTS_REPLIES",
        getWallPostCommentsReplies: data,
    };
}

export async function postWallPostCommentReply(
    newWallPostCommentReply,
    userWallId,
    postId,
    commentId
) {
    const { data } = await axios.post("/wall/post/comments-replies", {
        newWallPostCommentReply,
        userWallId,
        postId,
        commentId,
    });
    if (data.error) {
        return {
            type: "POST_WALL_POST_COMMENT_REPLY_ERROR",
            newWallPostCommentReplyError: data.error,
        };
    } else {
        return {
            type: "POST_WALL_POST_COMMENT_REPLY",
            newWallPostCommentReply: data[0],
        };
    }
}

export async function deleteCommentReply(replyId) {
    console.log("Action deleteCommentReply!", replyId);
    const { data } = await axios.post("/comment-reply/delete", {
        replyId,
    });
    //console.log("Action POST /comment-reply/delete data: ", data[0]);

    // notification comment-reply deletion
    const commentReplyTextDeleted = data[0].reply;
    const commentReplyDateTimeFromNowDeleted = moment(
        data[0].created_at
    ).fromNow();
    const pushNotificationText1 = `✅ You have just successfully deleted the comment reply with the text '`;
    const pushNotification = (
        <>
            <MdNotificationsActive id="pushNotificationFriendRequestBell" />
            &emsp;
            <span className="pushNotificationFriendRequestText">
                {pushNotificationText1}
                {commentReplyTextDeleted}&apos; written
                {commentReplyDateTimeFromNowDeleted}.
            </span>
        </>
    );
    toaster.notify(pushNotification, {
        duration: 5000,
    });

    return {
        type: "DELETE_COMMENT_REPLY",
        wallPostCommentReplyToDelete: replyId,
    };
}

export async function getActiveUserInfos() {
    //console.log("Action getActiveUserInfos!");
    const { data } = await axios.get(`/active/user/infos`);
    //console.log("Action GET /active/user/infos data: ", data);

    return {
        type: "GET_ACTIVE_USER_INFOS",
        getActiveUserInfos: data,
    };
}
