import { Component } from "react";

export default class Uploader extends Component {
    constructor() {
        super();
        this.state = {};
        this.handleClick = this.handleClick.bind(this);
    }

    /*
    Uploader three functions:
    1. store the image the user selected in its own state
    2. send the file to the server
    3. let App know that there's a new profile picture, and that App needs to update its own state
    NB: App = only component which can update App's state
    */

    handleClick() {
        console.log("this.props in Uploader: ", this.props);
        // setImage is called in Uploader but it runs in App!
        // component is called by:
        this.props.setImage("I'm an argument being ");
    }

    render() {
        // props passed down from the parent (App) to its children (Uploader, in this case)
        console.log("props in Uploader: ", this.props);
        return (
            <>
                {/* <h1 onClick={() => this.handleClick()}>Uploader</h1> */}
                <h1 onClick={this.handleClick}>Uploader</h1>
            </>
        );
    }
}
