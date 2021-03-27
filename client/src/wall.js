import { useDispatch, useSelector } from "react-redux";
import { getWallPosts, postWallPost } from "./actions";
import useStatefulFields from "./customhooks/use-stateful-fields";
import { useState, useEffect } from "react";

export default function Wall({ id, myWall, name }) {
    console.log("-------", id, myWall, name);
    const dispatch = useDispatch();
    const [fields, handleChange] = useStatefulFields(); // => customhooks
    const [fileLabel, setFileLabel] = useState("Choose an image (< 2mb): ");
    const [file, setFile] = useState();
    const error = useSelector((state) => state && state.error);
    const wallPosts = useSelector((state) => state && state.wallPosts);
    console.log("wallPosts from wall.js: ", wallPosts);

    useEffect(() => {
        dispatch(getWallPosts(id));
    }, [id]);

    const handlePostWallPost = (e) => {
        e.preventDefault();
        // Create a FormData instance and append the relevant fields
        const formData = new FormData();
        formData.append("image", file);
        formData.append("description", fields.description);
        dispatch(postWallPost(formData));
    };

    const handleFileChange = ({ target }) => {
        setFile(target.files[0]);
        setFileLabel(target.files[0].name);
    };

    /* if (!wallPosts || !wallPosts.length) {
        //return null;
        return (
            <div className="opsNoFriendsNorRequestsFirstWrap">
                <div className="opsNoFriendsNorRequestsSecondtWrap">
                    <h1>Ops, it seems you don&#39;t have any posts yet..</h1>
                </div>
            </div>
        );
    } */

    return (
        <div className="wallWrapper">
            <div className="wallContainer">
                {/* <h1>Wall</h1> */}

                <div className="cardWallWrapper">
                    <div className="cardWallWrapperZindex">
                        <div className="sectionWrapper">
                            <div className="cardWallContainer">
                                <div className="cardWall">
                                    {/* <OnlineUsers></OnlineUsers> */}

                                    {/* {wallPosts == "undefined" && (
                                        <p id="noPostsYet">It seems you haven't post anything yet</p>
                                    )} */}

                                    {myWall ? (
                                        <div className="wallPostsGlassOverlayWrap">
                                            <div className="wallPostsGlassOverlay">
                                                {/* <h1>Wall posts</h1> */}
                                                <div>
                                                    {/* <p id="noPostsYet">No posts yet</p> */}
                                                    <p id="wallTitle">
                                                        Here you can upload
                                                        something on your wall_
                                                    </p>
                                                    <form
                                                        id="wallForm"
                                                        method="POST"
                                                        action="/upload"
                                                        autoComplete="off"
                                                        encType="multipart/form-data"
                                                    >
                                                        <label
                                                            id="labelImage"
                                                            htmlFor="image"
                                                        >
                                                            {fileLabel}
                                                        </label>
                                                        <input
                                                            name="image"
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={
                                                                handleFileChange
                                                            }
                                                        />

                                                        <input
                                                            id="inputTitle"
                                                            name="description"
                                                            placeholder="Add a title here.."
                                                            type="text"
                                                            onChange={
                                                                handleChange
                                                            }
                                                        />
                                                        <button
                                                            id="postWallBtn"
                                                            onClick={
                                                                handlePostWallPost
                                                            }
                                                        >
                                                            Post
                                                        </button>
                                                        <div className="registrationError">
                                                            {error && (
                                                                <span>
                                                                    Ops,
                                                                    something
                                                                    went wrong!
                                                                </span>
                                                            )}
                                                        </div>
                                                    </form>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="wallPostsGlassOverlayWrap">
                                            <div className="wallPostsGlassOverlay">
                                                <div>
                                                    <p
                                                        id="wallTitle"
                                                        className="onHoverNoCursor"
                                                        style={{
                                                            fontSize: "1.7em",
                                                            marginTop: "21px",
                                                            //color: "lime",
                                                        }}
                                                    >
                                                        {name} wall_
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="wallHistoryContainer">
                                        {wallPosts &&
                                            wallPosts.map((post, index) => (
                                                <div
                                                    id="wallHistoryElements"
                                                    key={index}
                                                >
                                                    <div>
                                                        <div className="wallPostsPicContainer">
                                                            <img
                                                                src={post.image}
                                                            />
                                                        </div>
                                                        <div
                                                            className="bioEditor"
                                                            id="titleTimestampWrap"
                                                        >
                                                            <p>
                                                                <b id="messageName">
                                                                    {post.title ==
                                                                    "undefined"
                                                                        ? null
                                                                        : post.title}
                                                                </b>{" "}
                                                            </p>
                                                            <p>
                                                                <small id="uploaderSigns">
                                                                    ❮
                                                                </small>
                                                                &nbsp; posted{" "}
                                                                {post.timestamp}
                                                                &nbsp;&nbsp;
                                                                <small id="uploaderSigns">
                                                                    ❯
                                                                </small>
                                                            </p>
                                                        </div>

                                                        <div id="chat-messages">
                                                            <p>
                                                                {post.message}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
