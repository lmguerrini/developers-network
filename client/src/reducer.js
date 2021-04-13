// not "export default" if we decide to import {reducer} [in start.js]
export function reducer(state = {}, action) {
    if (action.type == "ERROR") {
        //console.log("Reducer (general) ERROR", state);
        state = {
            ...state,
            error: action.error,
        };
        //console.log("Reducer ERROR A", state);
    }

    if (action.type == "GET_FRIENDS_WANNABES_LIST") {
        state = {
            ...state,
            friendsWannabesList: action.friendsWannabesList,
        };
    }
    if (action.type == "ACCEPT_FRIEND_REQUEST") {
        console.log("ACCEPT-reducer");
        state = {
            ...state,
            friendsWannabesList: state.friendsWannabesList.map((user) => {
                console.log("user.id: ", user.id);
                console.log("action.acceptUserId: ", action.acceptUserId);
                /* user.id == action.acceptUserId &&
                    (user = {
                        ...user,
                        accepted: true,
                    }); */
                if (user.id == action.acceptUserId) {
                    user.accepted = true;
                    return user;
                } else {
                    return user;
                }
            }),
        };
    }
    if (action.type == "DELETE_FRIEND") {
        console.log("DELETE-reducer");
        state = {
            ...state,
            friendsWannabesList: state.friendsWannabesList.filter((user) => {
                /* console.log("action.acceptUserId: ", action.acceptUserId); */
                return user.id != action.unfriendUserId;
            }),
        };
    }

    if (action.type == "POST_NEW_MESSAGE") {
        //console.log("Reducer POST_NEW_MESSAGE");

        state = {
            ...state,
            messages: [...state.messages, action.message],
        };
    }

    if (action.type == "DELETE_MESSAGE") {
        //console.log("Reducer DELETE_MESSAGE");

        state = {
            ...state,
            messages: state.messages.filter((deleteChatMessage) => {
                return (
                    deleteChatMessage.chatMessageId !=
                    action.chatMessageToDelete
                );
            }),
        };
    }

    if (action.type == "DELETE_PRIVATE_MESSAGE") {
        console.log("Reducer DELETE_PRIVATE_MESSAGE");

        /* const privateMessagesFiltered = state.privateMessages.filter(
            (deletePrivateMessage) =>
                deletePrivateMessage.privateMessageId ===
                action.privateMessage
        ); */

        state = {
            ...state,
            privateMessages: state.privateMessages.filter(
                (deletePrivateMessage) => {
                    return (
                        deletePrivateMessage.privateMessageId !=
                        action.privatemessageToDelete
                    );
                }
            ),
            /* privateMessages: state.privateMessages.reduce(
                (p, c) => (
                    c.privateMessageId !== action.privateMessage && p.push(c), p
                ),
                []
            ), */
            /* privateMessages: privateMessagesFiltered.forEach((f) =>
                state.privateMessages.splice(
                    state.privateMessages.findIndex(
                        (e) => e.privateMessageId === f.privateMessageId
                    ),
                    1
                )
            ), */
            /* privateMessages: [
                ...state.privateMessages.slice(0, action.privateMessage),
                ...state.privateMessages.slice(action.privateMessage + 1),
            ], */
        };
    }

    if (action.type == "ADD_TEN_MOST_RECENT_MESSAGES") {
        //console.log("Reducer GET_TEN_MOST_RECENT_MESSAGES");

        state = {
            ...state,
            messages: action.messages,
        };
    }

    if (action.type == "GET_ONLINE_USERS_LIST") {
        //console.log("Reducer GET_ONLINE_USERS_LIST");

        state = {
            ...state,
            onlineUsers: action.onlineUsersList,
        };
    }

    /* if (action.type == "POST_NEW_PRIVATE_MESSAGE") {
        //console.log("Reducer POST_NEW_PRIVATE_MESSAGE");

        state = {
            ...state,
            privateMessages: [...state.privateMessages, action.privateMessage],
        };
        console.log("reducer new private msg state: ", state);
    } */

    /* if (action.type == "ADD_MOST_RECENT_PRIVATE_MESSAGES") {
        //console.log("Reducer ADD_MOST_RECENT_PRIVATE_MESSAGES");

        state = {
            ...state,
            privateMessages: action.latestPrivateMessages,
        };
        console.log("reducer recent private msgs state: ", state);
    } */

    if (action.type == "POST_NEW_PRIVATE_MESSAGE") {
        //console.log("Reducer POST_NEW_PRIVATE_MESSAGE");

        state = {
            ...state,
            privateMessages: [...state.privateMessages, action.privateMessage],
        };
    }

    if (action.type == "ADD_MOST_RECENT_PRIVATE_MESSAGES") {
        //console.log("Reducer ADD_MOST_RECENT_PRIVATE_MESSAGES");

        state = {
            ...state,
            privateMessages: action.latestPrivateMessages,
        };
    }

    if (action.type == "POST_NEW_PRIVATE_MESSAGE_NOTIFICATION") {
        //console.log("Reducer POST_NEW_PRIVATE_MESSAGE_NOTIFICATION :", state);

        state = {
            ...state,
            privateMessageNotifications: action.privateMessageNotification,
        };
        console.log("Reducer PM_NOTIFICATION A state :", state);
    }

    if (action.type == "ADD_MOST_RECENT_PM_NOTIFICATIONS") {
        //console.log("Reducer ADD_MOST_RECENT_PM_NOTIFICATIONS :", state);

        state = {
            ...state,
            notificationsPM: action.notificationPM,
        };
    }

    if (action.type == "ADD_MOST_RECENT_FRIENDSHIP_REQUEST_NOTIFICATIONS") {
        /* console.log(
            "Reducer ADD_MOST_RECENT_FRIENDSHIP_REQUEST_NOTIFICATIONS B:",
            state
        ); */

        state = {
            ...state,
            notificationsFR: [action.notificationFriendshipRequest],
        };
    }

    if (action.type == "GET_WALL_POSTS") {
        //console.log("Reducer GET_WALL_POSTS!");

        state = {
            ...state,
            wallPosts: action.wallPost,
        };

        //console.log("reducer GET wall posts state: ", state);
    }

    if (action.type == "POST_WALL_POST") {
        console.log("Reducer POST_WALL_POST");

        state = {
            ...state,
            wallPosts: [action.wallPost, ...state.wallPosts],
        };
        //console.log("reducer POST new wall post state: ", state);
    }

    if (action.type == "GET_WALL_POST_COMMENTS") {
        //console.log("Reducer GET_WALL_POST_COMMENTS!");

        state = {
            ...state,
            wallPostComments: action.wallPostComments,
        };
        //console.log("reducer GET wall post comments state: ", state);
    }

    if (action.type == "POST_WALL_POST_COMMENT") {
        //console.log("Reducer POST_NEW_PRIVATE_MESSAGE", state);

        state = {
            ...state,
            wallPostComments: [
                ...state.wallPostComments,
                action.newWallPostComment,
            ],
            newWallPostCommentError: false,
        };
        //console.log("Reducer POST_NEW_PRIVATE_MESSAGE (A)", state);
    }

    if (action.type == "POST_WALL_POST_COMMENT_ERROR") {
        //console.log("Reducer POST_WALL_POST_COMMENT_ERROR", state);
        state = {
            ...state,
            newWallPostCommentError: action.newWallPostCommentError,
        };
        //console.log("Reducer POST_WALL_POST_COMMENT_ERROR A", state);
    }

    if (action.type == "DELETE_COMMENT") {
        console.log("Reducer DELETE_COMMENT");

        state = {
            ...state,
            wallPostComments: state.wallPostComments.filter(
                (deletewallPostComment) => {
                    return (
                        deletewallPostComment.commentId !=
                        action.wallPostCommentToDelete
                    );
                }
            ),
        };
    }

    if (action.type == "GET_WALL_POST_COMMENTS_REPLIES") {
        //console.log("Reducer GET_WALL_POST_COMMENTS_REPLIES!", state);

        state = {
            ...state,
            wallPostCommentsReplies: action.getWallPostCommentsReplies,
        };

        //console.log("reducer GET wall post comments replies state: ", state);
    }

    if (action.type == "POST_WALL_POST_COMMENT_REPLY") {
        //console.log("Reducer POST_WALL_POST_COMMENT_REPLY", state);

        state = {
            ...state,
            /* wallPostCommentsReplies: [
                ...state.wallPostCommentsReplies,
                action.newWallPostCommentReply,
            ], */
            wallPostCommentsReplies: [action.newWallPostCommentReply],

            newWallPostCommentReplyError: false,
        };
        //console.log("Reducer POST_WALL_POST_COMMENT_REPLY (A)", state);
    }

    if (action.type == "POST_WALL_POST_COMMENT_REPLY_ERROR") {
        //console.log("Reducer POST_WALL_POST_COMMENT_REPLY_ERROR", state);
        state = {
            ...state,
            newWallPostCommentReplyError: action.newWallPostCommentReplyError,
        };
        //console.log("Reducer POST_WALL_POST_COMMENT_REPLY_ERROR A", state);
    }

    if (action.type == "DELETE_COMMENT_REPLY") {
        //console.log("Reducer DELETE_COMMENT_REPLY", state);

        state = {
            ...state,
            wallPostCommentsReplies: state.wallPostCommentsReplies.filter(
                (deletewallPostCommentReply) => {
                    return (
                        deletewallPostCommentReply.replyId !=
                        action.wallPostCommentReplyToDelete
                    );
                }
            ),
        };
        //console.log("Reducer DELETE_COMMENT_REPLY (A)", state);
    }

    return state;
}

/* const obj = {
    first: "FirstName",
};
//making "obj" clone (so that it remains untouched)
const newObj = {
    ...obj, // copying eveerything from "obj"
    last: "LastName",
};

const arr = [1, 2, 3];
//making "arr" clone (so that it remains untouched)
const newArr = [...arr]; // copying eveerything from "arr"


NB: there are a copuple of really useful array methods 
that don't mutate the original array , like:
_ MAP
_ FILTER
 */
