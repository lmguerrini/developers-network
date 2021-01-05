import ReactDOM from "react-dom";
//import HelloWorld from "./helloWorld";
//import Registration from "./registration";
import Welcome from "./welcome";

// this tells React to read the URL, and based on what's there
// render the appropriate view
let elem;
if (location.pathname === "/welcome") {
    elem = <Welcome />;
} else {
    elem = <h1>Home Page!</h1>;
}

//ReactDOM.render(<HelloWorld />, document.querySelector("main"));
//ReactDOM.render(<Registration />, document.querySelector("main"));
//ReactDOM.render(<Welcome />, document.querySelector("main"));
ReactDOM.render(elem, document.querySelector("main"));

/* 
start.js => render Welcome component 
Welcome => render Registration, Login & ResetPassword (which are siblings and Welcome's children) components

start.js => render HelloWorld component
HelloWorld => render Greetee & Counter (which are siblings) components
*/
