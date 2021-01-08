import { Component } from "react";
import axios from "./axios";

export default class OtherProfile extends Component {
    // The BioEditor component should expect to receive a prop that contains the user's current bio text
    constructor(props) {
        super(props);
        this.state = {};
        //this.handleClick = this.handleClick.bind(this);
        //this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        //console.log("OtherProfile/componentDidMount this.props.matach: ", this.props.match.params.id)

        //we should make a request to our server to get the other user's data
        // if we are viewing our own profile, we should make sure to send the user back to the "/" route

        if (this.props.params.id == 34) {
            // NB: == and not ===, since id = string
            this.props.history.push("/");
        }
    }

    render() {
        // props passed down from the parent (App) to its children (OtherProfile, in this case)
        //console.log("props in OtherProfile: ", this.props);
        return (
            <>
                <h1>Other Profile Component</h1>
                <h2>
                    I will be displaying the other users information including
                    their profile pic and bio. However, I will NOT be able to
                    edit their information!{" "}
                </h2>
            </>
        );
    }
}
