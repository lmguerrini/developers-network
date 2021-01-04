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
    elem = <p>Home Page!</p>;
}

//ReactDOM.render(<HelloWorld />, document.querySelector("main"));
//ReactDOM.render(<Registration />, document.querySelector("main"));
//ReactDOM.render(<Welcome />, document.querySelector("main"));
ReactDOM.render(elem, document.querySelector("main"));

/* 
start.js => render Welcome component (Registrtion is its child)

start.js => render HelloWorld component
HelloWorld => Greetee & Counter (which are siblings) components
*/
