import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

export default function OnlineUsers() {
    const onlineUsers = useSelector((state) => state && state.onlineUsers);

    if (!onlineUsers || !onlineUsers.length) {
        return null;
    }

    return (
        <>
            {/* <div>Online Users</div> */}

            {onlineUsers && (
                <div className="onlineUsersTitleWrap">
                    <p id="findpeopleTitles">
                        These people <small id="uploaderSigns">❮&nbsp;</small>
                        <small>☟</small>
                        <small id="uploaderSigns">&nbsp;❯&nbsp;</small>
                        are currently online <b id="uploaderSigns">\n &nbsp;</b>
                    </p>
                </div>
            )}
            <div className="onlineUserContainerWrap">
                <div className="onlineUsersGlassOverlay">
                    {onlineUsers &&
                        onlineUsers.map((onlineUser) => (
                            <div
                                className="onlineUserContainer"
                                key={onlineUser.id}
                            >
                                <div>
                                    <Link to={"/user/" + onlineUser.id}>
                                        <img
                                            id="onlineUserProfilePic"
                                            className="profile_pic"
                                            src={onlineUser.profile_pic}
                                            alt={onlineUser.name}
                                        />
                                        <p
                                            /* id="friendsWannabesLink" */
                                            className="onlineUserNameWrap"
                                        >
                                            <small id="uploaderSigns">
                                                ❮&nbsp;
                                            </small>
                                            {onlineUser.name}
                                            <small id="uploaderSigns">
                                                &nbsp;❯
                                            </small>
                                        </p>
                                    </Link>
                                </div>
                            </div>
                        ))}
                </div>
            </div>
        </>
    );
}
