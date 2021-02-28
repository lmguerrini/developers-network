import { Link } from "react-router-dom";
import { useState } from "react";
import useAuthSubmitSpecErr from "./customhooks/useAuthSubmit_specErr";
import { FiLogOut } from "react-icons/fi";
import { AiOutlineUserDelete } from "react-icons/ai";

export default function EditProfile({
    first,
    last,
    email,
    toggleModalSettings,
    logout,
    deleteAccount,
}) {
    const [values, setValues] = useState({
        first: first,
        last: last,
        email: email,
    });

    const [error, handleSubmit] = useAuthSubmitSpecErr("/user/edit", values);

    const handleChange = (e) => {
        setValues({
            ...values,
            [e.target.name]: e.target.value,
        });
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleSubmit();
        }
    };

    return (
        <>
            {/* <div className="modalUploaderWrapper"> */}
            <div className="uploaderContainer">
                {/* <h3>Account Settings</h3> */}
                <div id="welcomeBack">
                    <p>
                        <small id="uploaderSigns">❮</small> Edit your profile
                        settings
                        <small id="uploaderSigns"> ❯</small>
                    </p>
                </div>
                {/*  <div> */}
                <div className="registrationError">
                    {/* {error && (
                            <p>Ops, something went wrong!</p>
                            )} */}
                    {error && <span>{error}</span>}
                </div>
                <input
                    onChange={handleChange}
                    name="first"
                    placeholder="First Name.."
                    type="text"
                    value={values.first}
                />
                <input
                    onChange={handleChange}
                    name="last"
                    placeholder="Last Name.."
                    type="text"
                    value={values.last}
                />
                <input
                    onChange={handleChange}
                    onKeyPress={handleKeyPress}
                    name="email"
                    placeholder="Email.."
                    type="email"
                    value={values.email}
                />
                <input
                    onChange={handleChange}
                    onKeyPress={handleKeyPress}
                    name="password"
                    placeholder="New Password.."
                    type="password"
                />
                <div className="saveCancelContainer">
                    <button id="saveChanges" onClick={handleSubmit}>
                        Save Changes
                    </button>
                    {/* <Link to="/"> */}
                    <button id="cancelChanges" onClick={toggleModalSettings}>
                        Back
                    </button>
                    {/* </Link> */}
                </div>
                {/* </div> */}
                <div className="logoutDeleteContainer">
                    <button>
                        <Link
                            to="/logout"
                            className="logoutLink"
                            id="logout"
                            /* onClick={(e) => {
                                                window.confirm(
                                                    "[LOGOUT] \nAre you sure you want to logout?"
                                                ) && this.logout(e);
                                            }} */
                            onClick={logout}
                        >
                            {/*  Log Out */}
                            <FiLogOut />
                        </Link>
                    </button>
                    <button
                        id="deleteAccount"
                        className="logoutLink"
                        onClick={(e) => {
                            window.confirm(
                                "[ACCOUNT DELETION] \nAre your sure you want to delete your account and all related data? \nNote: there is no going back! Please be certain."
                            ) && deleteAccount(e);
                        }}
                    >
                        {/* Delete Account */}
                        <AiOutlineUserDelete />
                    </button>
                </div>
            </div>
            {/* </div> */}
        </>
    );
}
