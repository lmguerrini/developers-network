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
            <div className="uploaderContainer editProfileContainer">
                {/* <h3>Account Settings</h3> */}
                <div className="closeEditProfileX">
                    <p
                        id="cancelChanges"
                        className="backgroundTransparent test"
                        onClick={toggleModalSettings}
                    >
                        x
                    </p>
                </div>
                <div id="welcomeBack" className="editProfileTitleDiv">
                    <p id="uploadYourProfPicture">
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
                    {/* <Link to="/"> */}
                    <button
                        id="cancelChanges"
                        className="backgroundTransparent"
                        onClick={toggleModalSettings}
                    >
                        ◁◀︎ Back
                    </button>
                    <button
                        id="saveChanges"
                        className="backgroundTransparent"
                        onClick={handleSubmit}
                    >
                        Save Changes
                    </button>
                    {/* </Link> */}
                </div>
                {/* </div> */}
                <div className="logoutDeleteContainer">
                    <button className="backgroundTransparent logoutContainer">
                        <Link
                            to="/logout"
                            className="logoutLink"
                            id="logoutEP"
                            /* onClick={(e) => {
                                                window.confirm(
                                                    "[LOGOUT] \nAre you sure you want to logout?"
                                                ) && this.logout(e);
                                            }} */
                            onClick={logout}
                        >
                            <span>Log Out</span>
                            {/* <br /> */}
                            <FiLogOut id="logoutEPIcon" />
                        </Link>
                    </button>
                    <button
                        id="deleteAccountEP"
                        className="logoutLink"
                        onClick={(e) => {
                            window.confirm(
                                "[ACCOUNT DELETION] \nAre your sure you want to delete your account and all related data? \nNote: there is no going back! Please be certain."
                            ) && deleteAccount(e);
                        }}
                    >
                        <span>Delete Account</span>
                        {/* <br /> */}
                        <AiOutlineUserDelete id="logoutEPIcon" />
                    </button>
                </div>
            </div>
            {/* </div> */}
        </>
    );
}
