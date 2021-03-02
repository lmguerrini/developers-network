import ReactDOM from "react-dom";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import reduxPromise from "redux-promise";
import { composeWithDevTools } from "redux-devtools-extension"; // to be able to see what's going on in our Redux DevTools
import { reducer } from "./reducer";
import { init } from "./socket";
//import Registration from "./registration"; // => welcome.js
import Welcome from "./welcome";
import App from "./app";

let elem;

const store = createStore(
    reducer,
    composeWithDevTools(applyMiddleware(reduxPromise))
);

// location.pathname tells React to read the URL, and based on what's there render the appropriate view
if (location.pathname === "/welcome") {
    elem = <Welcome />;
} else {
    //elem = <h1>Home Page!</h1>;
    init(store); // => connect socket.io with redux!
    elem = (
        <Provider store={store}>
            <App />
        </Provider>
    );
}

//ReactDOM.render(<Registration />, document.querySelector("main"));
//ReactDOM.render(<Welcome />, document.querySelector("main"));
ReactDOM.render(elem, document.querySelector("main"));

/********************** React structure ***********************

* start.js *
    {Logged out}
        * Welcome (parent)
            - Registration (child)
            - Login (child)
            - ResetPassword (child)
                - component: 1 (enter email address)
                - component: 2 (enter code received by email)
                - component: 3 (success!)
    {Logged in}
        * App (parent)
            - Profile (child)
                - ProfilPic
                - BioEditor
                - Wall
            - EditProfile (child)
            - OtherProfile (child)
                - ProfilPic
                - FriendButton
            - FindPeople (child)
            - Friends (child)
            _ Chat (child)
                _ OnlineUsers
            - Uploader (child)
            
****************************************************************/

/* //**************** socket.io ****************
import { io } from "socket.io-client";

const socket = io.connect();
socket.on("hello", (data) => {
    console.log("data: ", data);
});
// no err message(?)
socket &&
    socket.on("hello", (data) => {
        console.log("data: ", data);
    });

socket.emit("another cool message", ["andrea", "david", "oli"]);

ReactDOM.render(<HelloWolrd />, document.querySelector("main"));

function HelloWolrd() {
    return (
        <div
            onClick={() => {
                socket.emit(
                    "helloWolrd clicked",
                    "hello jasmine - helloWorld was clicked!"
                );
            }}
        >
            Hello, World!
        </div>
    );
} */
