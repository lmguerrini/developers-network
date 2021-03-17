import { useSelector } from "react-redux"; // useDispatch
import { useEffect } from "react";
import { socket } from "./socket";
import { Link } from "react-router-dom";

export default function Notification(props) {
    const chatMessages = useSelector((state) => state && state.messages);
    const notificationsPM = useSelector(
        (state) => state && state.notificationsPM
    );
    const notificationsFR = useSelector(
        (state) => state && state.notificationsFR
    );

    const recipientId = props.id;
    const recipientFirst = props.name.split(" ")[0];
    /* const index = props.name.indexOf(" ");
    const recipientFirst = props.name.substring(0, index); */
    const myNameFromProps = props.name;

    let senderFR;

    for (const myName in notificationsFR) {
        if (notificationsFR[myName].name == myNameFromProps) {
            senderFR = notificationsFR[myName].name;
        }
    }

    useEffect(() => {
        let abort;
        (async () => {
            if (!abort) {
                //console.log("PrivateMessages useEffect");

                if (recipientId != 0) {
                    socket.emit(
                        "get most recent notifications",
                        Number(recipientId)
                    );
                }
            }
        })();
        return () => {
            // NB: this runs before every next re-render
            abort = true;
        };
    }, [recipientId]);

    return (
        <>
            {/* <h1>Notifications</h1> */}
            <div className="sectionWrapper">
                <div className="cardContainer" /* ref={elemRef} */>
                    <div className="cardChat">
                        <div className="wallPostsGlassOverlayWrap">
                            <div className="wallPostsGlassOverlay visible">
                                <h1 id="directMessages">
                                    <small id="uploaderSigns">❮</small>
                                    &nbsp; Notifications{" "}
                                    <small id="uploaderSigns">❯</small>
                                </h1>
                            </div>
                        </div>

                        <div className="chatHistoryContainer">
                            <div id="privateChatPaddingTop"></div>
                            <div className="wallPostsGlassOverlay">
                                <h1 id="directMessages">
                                    <small id="uploaderSigns">❮</small>
                                    &nbsp; Chat Notifications{" "}
                                    <small id="uploaderSigns">❯</small>
                                </h1>
                            </div>
                            {chatMessages &&
                                chatMessages
                                    .map((chatMessages, index) => (
                                        <div id="imgLatest" key={index}>
                                            <div>
                                                <p
                                                    className="messageDateTimeDeleteBtnWrap"
                                                    id="notificationsFlex"
                                                >
                                                    <Link
                                                        to={
                                                            "/user/" +
                                                            chatMessages.senderId
                                                        }
                                                    >
                                                        {/* <img
                                                        className="profile_pic"
                                                        src={
                                                            chatMessages.profile_pic
                                                        }
                                                        alt={
                                                            chatMessages.senderName
                                                        }
                                                    /> */}
                                                        {chatMessages.profile_pic ? (
                                                            <img
                                                                className="profile_pic visible"
                                                                src={
                                                                    chatMessages.profile_pic
                                                                }
                                                                alt={
                                                                    chatMessages.senderName
                                                                }
                                                            />
                                                        ) : (
                                                            <img
                                                                className="profile_pic visible"
                                                                src="/img/defaultProfilePic.png"
                                                                alt="default profile_pic"
                                                            />
                                                        )}
                                                    </Link>
                                                    <b id="messageName">
                                                        &nbsp;
                                                        {
                                                            chatMessages.senderName
                                                        }
                                                        &emsp;
                                                    </b>{" "}
                                                    <span>
                                                        wrote something&nbsp;
                                                        <small id="uploaderSigns">
                                                            ❮
                                                        </small>
                                                        &nbsp;
                                                        {
                                                            chatMessages.createdAtFromNow
                                                        }
                                                        &nbsp;
                                                        <small id="uploaderSigns">
                                                            ❯
                                                        </small>
                                                    </span>
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                    .reverse()
                                    .slice(0, 1)}

                            {/* <div id="privateChatPaddingTop"></div> */}
                            <br></br>
                            <div className="wallPostsGlassOverlay">
                                <h1 id="directMessages">
                                    <small id="uploaderSigns">❮</small>
                                    &nbsp; Private Messages Notifications{" "}
                                    <small id="uploaderSigns">❯</small>
                                </h1>
                            </div>
                            {notificationsPM === undefined ||
                                (notificationsPM.length === 0 && (
                                    <div id="noNotificationsTextWrap">
                                        <p
                                            className="messageDateTimeDeleteBtnWrap"
                                            id="notificationsFlex"
                                        >
                                            You don&apos;t have any P.M. at the
                                            moment, {recipientFirst}
                                        </p>
                                    </div>
                                ))}
                            {notificationsPM &&
                                notificationsPM
                                    .map((notificationsPM, index) => (
                                        <div id="imgLatest" key={index}>
                                            <div>
                                                <p
                                                    className="messageDateTimeDeleteBtnWrap"
                                                    id="notificationsFlex"
                                                >
                                                    <Link
                                                        to={
                                                            "/user/" +
                                                            notificationsPM.senderId
                                                        }
                                                    >
                                                        {/* <img
                                                        className="profile_pic visible"
                                                        src={
                                                            notifications.senderProfile_picPM
                                                        }
                                                        alt={
                                                                notifications.senderNamePM
                                                            }
                                                    /> */}
                                                        {notificationsPM.senderProfile_picPM ? (
                                                            <img
                                                                className="profile_pic visible"
                                                                src={
                                                                    notificationsPM.senderProfile_picPM
                                                                }
                                                                alt={
                                                                    notificationsPM.senderNamePM
                                                                }
                                                            />
                                                        ) : (
                                                            <img
                                                                className="profile_pic visible"
                                                                src="/img/defaultProfilePic.png"
                                                                alt="default profile_pic"
                                                            />
                                                        )}
                                                    </Link>
                                                    <b id="messageName">
                                                        &nbsp;
                                                        {
                                                            notificationsPM.senderNamePM
                                                        }
                                                        &emsp;
                                                    </b>{" "}
                                                    <span>
                                                        wrote you a P.M. &nbsp;
                                                        <small id="uploaderSigns">
                                                            ❮
                                                        </small>
                                                        &nbsp;
                                                        {
                                                            notificationsPM.privateMessageDateTimeFromNow
                                                        }
                                                        &nbsp;
                                                        <small id="uploaderSigns">
                                                            ❯
                                                        </small>
                                                    </span>
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                    .slice(0, 2)}

                            <br></br>
                            <div className="wallPostsGlassOverlay">
                                <h1 id="directMessages">
                                    <small id="uploaderSigns">❮</small>
                                    &nbsp; Friendship Request Notifications{" "}
                                    <small id="uploaderSigns">❯</small>
                                </h1>
                            </div>
                            {!notificationsFR && !senderFR && (
                                <div id="noNotificationsTextWrap">
                                    <p
                                        className="messageDateTimeDeleteBtnWrap"
                                        id="notificationsFlex"
                                    >
                                        You don&apos;t have any F.R. at the
                                        moment, {recipientFirst}
                                    </p>
                                </div>
                            )}
                            {notificationsFR &&
                                !senderFR &&
                                notificationsFR
                                    .map((notificationsFR, index) => (
                                        <div id="imgLatest" key={index}>
                                            <div>
                                                <p
                                                    className="messageDateTimeDeleteBtnWrap"
                                                    id="notificationsFlex"
                                                >
                                                    <Link
                                                        to={
                                                            "/user/" +
                                                            notificationsFR.senderIdFriendshipNotification
                                                        }
                                                    >
                                                        {notificationsFR.senderProfile_picFriendshipNotification ? (
                                                            <img
                                                                className="profile_pic visible"
                                                                src={
                                                                    notificationsFR.senderProfile_picFriendshipNotification
                                                                }
                                                                alt={
                                                                    notificationsFR.name
                                                                }
                                                            />
                                                        ) : (
                                                            <img
                                                                className="profile_pic visible"
                                                                src="/img/defaultProfilePic.png"
                                                                alt="default profile_pic"
                                                            />
                                                        )}
                                                    </Link>
                                                    <b id="messageName">
                                                        &nbsp;
                                                        {notificationsFR.name}
                                                        &emsp;
                                                    </b>{" "}
                                                    <span>
                                                        sent you a F.R. &nbsp;
                                                        <small id="uploaderSigns">
                                                            ❮
                                                        </small>
                                                        &nbsp;
                                                        {
                                                            notificationsFR.friendshipRequestFromNow
                                                        }
                                                        &nbsp;
                                                        <small id="uploaderSigns">
                                                            ❯
                                                        </small>
                                                    </span>
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                    .slice(0, 5)}
                        </div>
                        <div>
                            <textarea id="textAreaHidden" rows="1" cols="101" />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
