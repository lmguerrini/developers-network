// not "export default" if we decide to import {reducer} [in start.js]
export function reducer(state = {}, action) {
    // we will deal with the actions here..
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
            onlineUsersList: action.onlineUsersList,
        };
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
