import ReactDOM from "react-dom";
//import Registration from "./registration"; // => welcome.js
import Welcome from "./welcome";
import App from "./app";

// this tells React to read the URL, and based on what's there
// render the appropriate view
let elem;
if (location.pathname === "/welcome") {
    elem = <Welcome />;
} else {
    //elem = <h1>Home Page!</h1>;
    elem = <App />;
}

//ReactDOM.render(<Registration />, document.querySelector("main"));
//ReactDOM.render(<Welcome />, document.querySelector("main"));
ReactDOM.render(elem, document.querySelector("main"));

/* 
start.js => render Welcome component 
Welcome => render Registration, Login & ResetPassword (which are siblings and Welcome's children) components

*** React structure ***

* start.js *
    * Welcome (parent)
        - Registration (child)
        - Login (child)
        - ResetPassword (child)
            - component: 1 (enter email address)
            - component: 2 (enter code received by email)
            - component: 3 (success!)

    * App (parent)
        - ProfilPic (child)
        - Uploader (child)
*/
