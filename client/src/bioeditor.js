import { Component } from "react";
// import axios from "axios";

// BioEditor needs to be a class component so that it can have state
export default class BioEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bioEditorIsVisible: false,
            draftBio: "", // what usere is typing before to submit (onChange)
        };
        //this.handleClick = this.handleClick.bind(this);
        //this.handleChange = this.handleChange.bind(this);
        this.toggleTextarea = this.toggleTextarea.bind(this);
    }

    toggleTextarea() {
        this.setState({
            bioEditorIsVisible: !this.state.bioEditorIsVisible,
        });
    }

    // function post request server => update value DB

    render() {
        // props passed down from the parent (App) to its children (Uploader, in this case)
        console.log("props in BioEditor: ", this.props);
        return (
            <>
                <h1>Bio Editor Component</h1>
                {this.state.bioEditorIsVisible && <textarea />}
                {/* <button onClick={() => this.toggleTextarea()}>Click Me!</button> */}
                <button onClick={this.toggleTextarea}>Click Me!</button>
            </>
        );
    }
}
