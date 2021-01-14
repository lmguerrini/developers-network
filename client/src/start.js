import ReactDOM from "react-dom";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import reduxPromise from "redux-promise";
import { composeWithDevTools } from "redux-devtools-extension"; // to be able to see what's going on in our Redux DevTools
import { reducer } from "./reducer";

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
    elem = (
        <Provider store={store}>
            <App />
        </Provider>
    );
}

//ReactDOM.render(<Registration />, document.querySelector("main"));
//ReactDOM.render(<Welcome />, document.querySelector("main"));
ReactDOM.render(elem, document.querySelector("main"));

/* 
*** React structure ***

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
            - OtherProfile (child)
                - ProfilPic
                - FriendButton
            - FindPeople (child)
            - Uploader (child)
            
*/
