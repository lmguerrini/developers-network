import { useState } from "react";
import axios from "./axios";

export const LocationEditor = (props) => {
    //console.log("LocationEditor props :", props);
    const [draftLocation, setDraftLocation] = useState("");
    const [locationEditorIsVisible, setLocationEditorIsVisible] = useState(
        false
    );
    const [error, setError] = useState(false);

    const locationToggleTextarea = () => {
        setLocationEditorIsVisible(!locationEditorIsVisible);
    };

    const locationHandleChange = (e) => {
        //console.log("locationHandleChange e.target  :", e.target.value);
        setDraftLocation(e.target.value);
    };

    const editLocation = (e) => {
        e.preventDefault();
        axios
            .post("/edit/location", { draftLocation: draftLocation })
            .then(({ data }) => {
                //console.log("editLocation data: ", data);
                if (data.error) {
                    setError(true);
                } else {
                    //console.log("editLocation props :", props, data.location);
                    props.editLocation(data.location); // newUpdatedBio {bio: draftBio}
                    locationToggleTextarea(); // editMode = false
                }
            })
            .catch(function (error) {
                console.log("error in axios editLocation/ catch: ", error);
                setError(true);
            });
    };

    return (
        <>
            <div className="registrationError">
                {error && <span>Ops, something went wrong!</span>}
            </div>
            <div className="locationEditorIsVisible">
                {locationEditorIsVisible ? (
                    <div>
                        <textarea
                            name="draftLocation"
                            rows="3"
                            cols="60"
                            defaultValue={props.location}
                            onChange={locationHandleChange}
                        />
                        <div className="savebackBtnWrap">
                            <button
                                className="savebackBtn"
                                id="backExtraInfoBtn"
                                onClick={locationToggleTextarea}
                            >
                                Back
                            </button>
                            <button
                                className="savebackBtn"
                                onClick={editLocation}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="locationEditorIsVisible">
                        {
                            <p>
                                {/* {props.location} */}
                                {props.location ? (
                                    props.location
                                ) : (
                                    <span id="uploaderSigns">
                                        (no location entered)
                                    </span>
                                )}
                            </p>
                        }
                        <button
                            className="addEditBtn"
                            onClick={locationToggleTextarea}
                        >
                            {!props.location ? "Add location" : "Edit"}
                        </button>
                    </div>
                )}
            </div>
        </>
    );
};

export const EducationEditor = (props) => {
    const [draftEducation, setDraftEducation] = useState("");
    const [educationEditorIsVisible, setEducationEditorIsVisible] = useState(
        false
    );
    const [error, setError] = useState(false);

    const educationToggleTextarea = () => {
        setEducationEditorIsVisible(!educationEditorIsVisible);
    };

    const educationHandleChange = (e) => {
        setDraftEducation(e.target.value);
    };

    const editEducation = (e) => {
        e.preventDefault();
        axios
            .post("/edit/education", { draftEducation: draftEducation })
            .then(({ data }) => {
                if (data.error) {
                    setError(true);
                } else {
                    props.editEducation(data.education);
                    educationToggleTextarea();
                }
            })
            .catch(function (error) {
                console.log("error in axios editEducation/ catch: ", error);
                setError(true);
            });
    };

    return (
        <>
            <div className="registrationError">
                {error && <span>Ops, something went wrong!</span>}
            </div>
            <div className="locationEditorIsVisible">
                {educationEditorIsVisible ? (
                    <div>
                        <textarea
                            name="draftEducation"
                            rows="3"
                            cols="60"
                            defaultValue={props.education}
                            onChange={educationHandleChange}
                        />
                        <div className="savebackBtnWrap">
                            <button
                                className="savebackBtn"
                                id="backExtraInfoBtn"
                                onClick={educationToggleTextarea}
                            >
                                Back
                            </button>
                            <button
                                className="savebackBtn"
                                onClick={editEducation}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="locationEditorIsVisible">
                        {
                            <p>
                                {props.education ? (
                                    props.education
                                ) : (
                                    <span id="uploaderSigns">
                                        (no education entered)
                                    </span>
                                )}
                            </p>
                        }
                        <button
                            className="addEditBtn"
                            onClick={educationToggleTextarea}
                        >
                            {!props.education ? "Add education" : "Edit"}
                        </button>
                    </div>
                )}
            </div>
        </>
    );
};

export const SkillsEditor = (props) => {
    const [draftSkills, setDraftSkills] = useState("");
    const [skillsEditorIsVisible, setSkillsEditorIsVisible] = useState(false);
    const [error, setError] = useState(false);

    const skillsToggleTextarea = () => {
        setSkillsEditorIsVisible(!skillsEditorIsVisible);
    };

    const skillsHandleChange = (e) => {
        setDraftSkills(e.target.value);
    };

    const editSkills = (e) => {
        e.preventDefault();
        axios
            .post("/edit/skills", { draftSkills: draftSkills })
            .then(({ data }) => {
                if (data.error) {
                    setError(true);
                } else {
                    props.editSkills(data.skills);
                    skillsToggleTextarea();
                }
            })
            .catch(function (error) {
                console.log("error in axios editSkills/ catch: ", error);
                setError(true);
            });
    };

    return (
        <>
            <div className="registrationError">
                {error && <span>Ops, something went wrong!</span>}
            </div>
            <div className="locationEditorIsVisible">
                {skillsEditorIsVisible ? (
                    <div>
                        <textarea
                            name="draftSkills"
                            rows="3"
                            cols="60"
                            defaultValue={props.skills}
                            onChange={skillsHandleChange}
                        />
                        <div className="savebackBtnWrap">
                            <button
                                className="savebackBtn"
                                id="backExtraInfoBtn"
                                onClick={skillsToggleTextarea}
                            >
                                Back
                            </button>
                            <button
                                className="savebackBtn"
                                onClick={editSkills}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="locationEditorIsVisible">
                        {
                            <p>
                                {props.skills ? (
                                    props.skills
                                ) : (
                                    <span id="uploaderSigns">
                                        (no skills entered)
                                    </span>
                                )}
                            </p>
                        }
                        <button
                            className="addEditBtn"
                            onClick={skillsToggleTextarea}
                        >
                            {!props.skills ? "Add skills" : "Edit"}
                        </button>
                    </div>
                )}
            </div>
        </>
    );
};

export const WorkEditor = (props) => {
    const [draftWork, setDraftWork] = useState("");
    const [workEditorIsVisible, setWorkEditorIsVisible] = useState(false);
    const [error, setError] = useState(false);

    const workToggleTextarea = () => {
        setWorkEditorIsVisible(!workEditorIsVisible);
    };

    const workHandleChange = (e) => {
        setDraftWork(e.target.value);
    };

    const editWork = (e) => {
        e.preventDefault();
        axios
            .post("/edit/work", { draftWork: draftWork })
            .then(({ data }) => {
                if (data.error) {
                    setError(true);
                } else {
                    props.editWork(data.work);
                    workToggleTextarea();
                }
            })
            .catch(function (error) {
                console.log("error in axios editWork/ catch: ", error);
                setError(true);
            });
    };

    return (
        <>
            <div className="registrationError">
                {error && <span>Ops, something went wrong!</span>}
            </div>
            <div className="locationEditorIsVisible">
                {workEditorIsVisible ? (
                    <div>
                        <textarea
                            name="draftWork"
                            rows="3"
                            cols="60"
                            defaultValue={props.work}
                            onChange={workHandleChange}
                        />
                        <div className="savebackBtnWrap">
                            <button
                                className="savebackBtn"
                                id="backExtraInfoBtn"
                                onClick={workToggleTextarea}
                            >
                                Back
                            </button>
                            <button className="savebackBtn" onClick={editWork}>
                                Save
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="locationEditorIsVisible">
                        {
                            <p>
                                {props.work ? (
                                    props.work
                                ) : (
                                    <span id="uploaderSigns">
                                        (no work entered)
                                    </span>
                                )}
                            </p>
                        }
                        <button
                            className="addEditBtn"
                            onClick={workToggleTextarea}
                        >
                            {!props.work ? "Add work" : "Edit"}
                        </button>
                    </div>
                )}
            </div>
        </>
    );
};

export const GitHubEditor = (props) => {
    const [draftGitHub, setDraftGitHub] = useState("");
    const [gitHubEditorIsVisible, setGitHubEditorIsVisible] = useState(false);
    const [error, setError] = useState(false);

    const gitHubToggleTextarea = () => {
        setGitHubEditorIsVisible(!gitHubEditorIsVisible);
    };

    const gitHubHandleChange = (e) => {
        setDraftGitHub(e.target.value);
    };

    const editGitHub = (e) => {
        e.preventDefault();
        axios
            .post("/edit/gitHub", { draftGitHub: draftGitHub })
            .then(({ data }) => {
                if (data.error) {
                    setError(true);
                } else {
                    props.editGitHub(data.gitHub);
                    gitHubToggleTextarea();
                }
            })
            .catch(function (error) {
                console.log("error in axios editGitHub/ catch: ", error);
                setError(true);
            });
    };

    return (
        <>
            <div className="registrationError">
                {error && <span>Ops, something went wrong!</span>}
            </div>
            <div className="locationEditorIsVisible">
                {gitHubEditorIsVisible ? (
                    <div>
                        <textarea
                            name="draftGitHub"
                            rows="3"
                            cols="60"
                            placeholder="https://github.com/.."
                            defaultValue={props.gitHub}
                            onChange={gitHubHandleChange}
                        />
                        <div className="savebackBtnWrap">
                            <button
                                className="savebackBtn"
                                id="backExtraInfoBtn"
                                onClick={gitHubToggleTextarea}
                            >
                                Back
                            </button>
                            <button
                                className="savebackBtn"
                                onClick={editGitHub}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="locationEditorIsVisible">
                        {
                            <p>
                                {props.gitHub ? (
                                    props.gitHub.startsWith(
                                        "https://github.com/"
                                    ) ? (
                                        <a
                                            href={props.gitHub}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="gitHubLink"
                                        >
                                            {props.gitHub}
                                        </a>
                                    ) : (
                                        <span>{props.gitHub}</span>
                                    )
                                ) : (
                                    <span id="uploaderSigns">
                                        (no gitHub entered)
                                    </span>
                                )}
                            </p>
                        }
                        <button
                            className="addEditBtn"
                            onClick={gitHubToggleTextarea}
                        >
                            {!props.gitHub ? "Add GitHub link" : "Edit"}
                        </button>
                    </div>
                )}
            </div>
        </>
    );
};

export const LinkedInEditor = (props) => {
    const [draftLinkedIn, setDraftLinkedIn] = useState("");
    const [linkedInEditorIsVisible, setLinkedInEditorIsVisible] = useState(
        false
    );
    const [error, setError] = useState(false);

    const linkedInToggleTextarea = () => {
        setLinkedInEditorIsVisible(!linkedInEditorIsVisible);
    };

    const linkedInHandleChange = (e) => {
        setDraftLinkedIn(e.target.value);
    };

    const editLinkedIn = (e) => {
        e.preventDefault();
        axios
            .post("/edit/linkedIn", { draftLinkedIn: draftLinkedIn })
            .then(({ data }) => {
                if (data.error) {
                    setError(true);
                } else {
                    props.editLinkedIn(data.linkedIn);
                    linkedInToggleTextarea();
                }
            })
            .catch(function (error) {
                console.log("error in axios editLinkedIn/ catch: ", error);
                setError(true);
            });
    };

    return (
        <>
            <div className="registrationError">
                {error && <span>Ops, something went wrong!</span>}
            </div>
            <div className="locationEditorIsVisible">
                {linkedInEditorIsVisible ? (
                    <div>
                        <textarea
                            name="draftLinkedIn"
                            rows="3"
                            cols="60"
                            placeholder="https://linkedin.com/in/.."
                            defaultValue={props.linkedIn}
                            onChange={linkedInHandleChange}
                        />
                        <div className="savebackBtnWrap">
                            <button
                                className="savebackBtn"
                                id="backExtraInfoBtn"
                                onClick={linkedInToggleTextarea}
                            >
                                Back
                            </button>
                            <button
                                className="savebackBtn"
                                onClick={editLinkedIn}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="locationEditorIsVisible">
                        {
                            <p>
                                {props.linkedIn ? (
                                    props.linkedIn.startsWith(
                                        "https://linkedin.com/in/"
                                    ) ? (
                                        <a
                                            href={props.linkedIn}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="gitHubLink"
                                        >
                                            {props.linkedIn}
                                        </a>
                                    ) : (
                                        <span>{props.linkedIn}</span>
                                    )
                                ) : (
                                    <span id="uploaderSigns">
                                        (no linkedIn entered)
                                    </span>
                                )}
                            </p>
                        }
                        <button
                            className="addEditBtn"
                            onClick={linkedInToggleTextarea}
                        >
                            {!props.linkedIn ? "Add LinkedIn link" : "Edit"}
                        </button>
                    </div>
                )}
            </div>
        </>
    );
};

export const LanguagesEditor = (props) => {
    const [draftLanguages, setDraftLanguages] = useState("");
    const [languagesEditorIsVisible, setLanguagesEditorIsVisible] = useState(
        false
    );
    const [error, setError] = useState(false);

    const languagesToggleTextarea = () => {
        setLanguagesEditorIsVisible(!languagesEditorIsVisible);
    };

    const languagesHandleChange = (e) => {
        setDraftLanguages(e.target.value);
    };

    const editLanguages = (e) => {
        e.preventDefault();
        axios
            .post("/edit/languages", { draftLanguages: draftLanguages })
            .then(({ data }) => {
                if (data.error) {
                    setError(true);
                } else {
                    props.editLanguages(data.languages);
                    languagesToggleTextarea();
                }
            })
            .catch(function (error) {
                console.log("error in axios editLanguages/ catch: ", error);
                setError(true);
            });
    };

    return (
        <>
            <div className="registrationError">
                {error && <span>Ops, something went wrong!</span>}
            </div>
            <div className="locationEditorIsVisible">
                {languagesEditorIsVisible ? (
                    <div>
                        <textarea
                            name="draftLanguages"
                            rows="3"
                            cols="60"
                            defaultValue={props.languages}
                            onChange={languagesHandleChange}
                        />
                        <div className="savebackBtnWrap">
                            <button
                                className="savebackBtn"
                                id="backExtraInfoBtn"
                                onClick={languagesToggleTextarea}
                            >
                                Back
                            </button>
                            <button
                                className="savebackBtn"
                                onClick={editLanguages}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="locationEditorIsVisible">
                        {
                            <p>
                                {props.languages ? (
                                    props.languages
                                ) : (
                                    <span id="uploaderSigns">
                                        (no languages entered)
                                    </span>
                                )}
                            </p>
                        }
                        <button
                            className="addEditBtn"
                            onClick={languagesToggleTextarea}
                        >
                            {!props.languages ? "Add languages" : "Edit"}
                        </button>
                    </div>
                )}
            </div>
        </>
    );
};
