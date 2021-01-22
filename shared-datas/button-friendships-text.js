// "export const BUTTON_TEXT = {...}"" won't work with node (server-side)

exports.BUTTON_TEXT = {
    SEND_REQUEST: "Add Friend",
    ACCEPT_REQUEST: "Accept Friend Request",
    REFUSE_REQUEST: "Cancel Friend Request",
    UNFRIEND: "Unfriend",
};

/*  
********** Shared "BUTTON_TEXT" links **********

* server-side:
    _ server.js (POST("/friendship/action"))

* client-side:
    _ actions.js
    _ friends.js
    _ friendbutton.js (useEffect[logic])
*/
