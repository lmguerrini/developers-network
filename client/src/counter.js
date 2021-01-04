import { Component } from "react";

// Class components allow you to have "state"
// "state" is the Vue equivalent of data!
// can do everything a function component does plus more! (use state, lifecycle methods, etc)

export default class Counter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            count: 0,
            name: "",
        };

        //this.incrementCount = this.incrementCount.bind(this); //otherwise this of incrementCount = undefined!
        // we need bind only for <button onClick={this.incrementCount}>Click me!</button>
    }

    // this is a lifecycle method!
    componentDidMount() {
        // = mount in Vue
        console.log("component Mounted!");
    }

    incrementCount() {
        console.log("incrementing count!");
        this.setState({
            count: this.state.count + 1,
        });
    }

    handleChange(e) {
        //we don't need bind cause we used the 2nd method on render
        console.log("Counter/ handleChange");
        this.setState({
            name: e.target.value,
        });
    }

    render() {
        // NB: always return JSX
        return (
            <div>
                <h1>I am the counter! The counter is: {this.state.count}</h1>
                <button onClick={() => this.incrementCount()}>Click me!</button>
                <input onChange={(e) => this.handleChange(e)}></input>
                <div>{this.state.name}</div>
            </div>
        );
    }
}

/*
if we run our method this way..
<button onClick={this.incrementCount}>Click Me!</button>; 

we HAVE to bind this (inside "class Counter extends Component"):
this.incrementCount = this.incrementCount.bind(this); 
*/
