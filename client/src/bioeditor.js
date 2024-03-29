import { Component } from "react";
import axios from "./axios";

// BioEditor needs to be a class component so that it can have state
export default class BioEditor extends Component {
    // The BioEditor component should expect to receive a prop that contains the user's current bio text
    constructor(props) {
        super(props);
        this.state = {
            draftBio: "", // what user is typing before to submit (onChange)
            bioEditorIsVisible: false,
            error: false,
            mediaQuery1550px: window.matchMedia("(max-device-width:1550px)"),
            mediaQuery375px: window.matchMedia("(max-device-width:430px)"),
        };
        this.editBio = this.editBio.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.toggleTextarea = this.toggleTextarea.bind(this);
    }

    toggleTextarea() {
        this.setState({
            bioEditorIsVisible: !this.state.bioEditorIsVisible,
        });
    }

    handleChange(e) {
        this.setState(
            {
                //[e.target.name]: e.target.value,
                draftBio: e.target.value,
            }
            //() => console.log("bioEditor/handleChange this.state: ", this.state)
        );
    }

    // function post request server => update value DB
    editBio(e) {
        //console.log("this.props in BioEditor: ", this.state);
        e.preventDefault();
        axios
            .post("/edit/bio", this.state)
            .then(({ data }) => {
                //console.log("data: ", data);
                if (data.error) {
                    this.setState({ error: true });
                } else {
                    this.props.editBio(data.bio); // newUpdatedBio {bio: draftBio}
                    this.toggleTextarea(); // editMode = false
                }
            })
            .catch(function (error) {
                console.log("error in axios BioEditor/editBio/ catch: ", error);
                this.setState({ error: true });
            });
    }

    render() {
        // props passed down from the parent (App) to its children (Uploader, in this case)
        //console.log("props in BioEditor: ", this.props);
        return (
            <>
                {/* <h1>Bio Editor Component</h1> */}
                <div className="registrationError">
                    {this.state.error && (
                        <span>Ops, something went wrong!</span>
                    )}
                </div>
                <div id="bioeditorTextarea">
                    {this.state.bioEditorIsVisible
                        ? this.state.bioEditorIsVisible && (
                              <div>
                                  {/* <h6>[editMode]</h6> */}
                                  <textarea
                                      name="draftBio"
                                      rows={
                                          !this.state.mediaQuery1550px
                                              .matches ||
                                          this.state.mediaQuery375px.matches
                                              ? "10"
                                              : "5"
                                      }
                                      cols="76"
                                      defaultValue={this.props.bio}
                                      onChange={this.handleChange}
                                  />
                                  <div id="saveBackBtnWrap">
                                      <button
                                          /* id="bioeditBtn" */
                                          className="bioeditBtn"
                                          onClick={this.toggleTextarea}
                                      >
                                          Back
                                      </button>
                                      <button
                                          /* id="bioeditBtn" */
                                          className="bioeditBtn"
                                          onClick={this.editBio}
                                      >
                                          Save
                                      </button>
                                  </div>
                              </div>
                          )
                        : !this.state.bioEditorIsVisible && (
                              <div id="bioEditorIsVisible">
                                  {/* <h6>[displayMode]</h6> */}
                                  {<p>{this.props.bio}</p>}
                                  <button
                                      /* id="bioeditBtn" */
                                      className="bioeditBtn"
                                      onClick={this.toggleTextarea}
                                  >
                                      {!this.props.bio ? "Add bio" : "Edit"}
                                  </button>
                              </div>
                          )}
                </div>
            </>
        );
    }
}
