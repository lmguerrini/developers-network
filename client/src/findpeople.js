import { useState, useEffect } from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default function FindPeople() {
    const [query, setQuery] = useState("");
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(false);

    // componentDidMount (class) => useEffect (fn)
    useEffect(() => {
        // everytime there's a re-render useEffect will be rentered
        let abort;
        // NB if we wanna use an async fn we have to use it in a IIFE
        (async () => {
            const { data } = await axios.get("/users/latest");
            if (!query && !abort) {
                //console.log("IF");
                //console.log("data from GET users/latest: ", data);
                return setUsers(data);
            } else if (query && !abort) {
                const { data } = await axios.get(`/users/search/${query}`);
                //console.log("data from GET users/search: ", data);
                if (data.error) {
                    return setError(true);
                } else {
                    return setUsers(data);
                }
            }
        })();

        // we can return a cleanup function
        return () => {
            // NB: this runs before every next re-render
            console.log(`About to replace ${query} wih a new value`);
            abort = true;
        };
    }, [query]); // "query" a 2nd argument => make get request only when "query is been updated

    console.log("Hooks component rendered");
    return (
        <>
            <div className="sectionWrapper">
                {/* <h2>Find People</h2> */}
                <div className="cardContainer">
                    <div className="card">
                        {!query && (
                            <div className="friendsGlassOverlay">
                                <p /* id="findpeopleTitles" */>
                                    Checkout who just joined!
                                </p>
                            </div>
                        )}
                        <div className="friendsWrapper">
                            {!query &&
                                users.map((users, index) => (
                                    <div id="imgLatest" key={index}>
                                        <Link to={"/user/" + users.id}>
                                            {users.profile_pic ? (
                                                <img
                                                    /* className="profile_picBig" */
                                                    className="profile_pic"
                                                    src={users.profile_pic}
                                                    alt={`${users.first} ${users.last}`}
                                                    onClick={
                                                        users.toggleModalUploader
                                                    }
                                                />
                                            ) : (
                                                <img
                                                    className="profile_pic"
                                                    src="/img/defaultProfilePic.png"
                                                    alt="default profile_pic"
                                                    onClick={
                                                        users.toggleModalUploader
                                                    }
                                                />
                                            )}
                                            <p>
                                                {users.first} {users.last}
                                            </p>
                                        </Link>
                                    </div>
                                ))}{" "}
                        </div>
                        {!query && (
                            <div className="friendsSearchGlassOverlay">
                                <p /* id="findpeopleTitles" */>
                                    Are you looking for someone in particular?
                                </p>
                            </div>
                        )}
                        {/* <input defaultValue={users.first} omChange={onChange} /> */}
                        {/* <input
                    defaultValue={users.first}
                    omChange={(e) => setFirst(e.target.value)}
                    /> */}
                        <div className="searchInputWrapper">
                            <input
                                id="searchInput"
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search people here.."
                            />
                        </div>
                        <div className="friendsWrapper">
                            {query &&
                                users.map((users, index) => (
                                    <div key={index}>
                                        <Link to={"/user/" + users.id}>
                                            {users.profile_pic ? (
                                                <div /* className="profile_picBig" */
                                                >
                                                    <img
                                                        /* className="profile_picBig" */
                                                        className="profile_pic"
                                                        src={users.profile_pic}
                                                        alt={`${users.first} ${users.last}`}
                                                        /* onClick={users.toggleModalUploader} */
                                                    />
                                                </div>
                                            ) : (
                                                <img
                                                    className="profile_pic"
                                                    src="/img/defaultProfilePic.png"
                                                    alt="default profile_pic"
                                                    /* onClick={users.toggleModalUploader} */
                                                />
                                            )}
                                            <p>
                                                {users.first} {users.last}
                                            </p>
                                        </Link>
                                    </div>
                                ))}
                            {!users.length && query && (
                                <div id="nothingFoundWrapper">
                                    <span id="nothingFound">
                                        Nothing found, try again!
                                    </span>
                                </div>
                            )}
                            <div className="registrationError">
                                {error && (
                                    <span>Ops, something went wrong!</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

/* {
    !query
        ? !query &&
          users.map((users, index) => (
              <div key={index}>
                  <Link to={"/user/" + users.id}>
                      {users.profile_pic ? (
                          <img
                              className="profile_pic"
                              src={users.profile_pic}
                              alt={`${users.first} ${users.last}`}
                              onClick={users.toggleModalUploader}
                          />
                      ) : (
                          <img
                              className="profile_pic"
                              src="/img/defaultProfilePic.png"
                              alt="default profile_pic"
                              onClick={users.toggleModalUploader}
                          />
                      )}
                      <h5>
                          {users.first} {users.last}
                      </h5>
                  </Link>
              </div>
          ))
        : query &&
          users.map((users, index) => (
              <div key={index}>
                  <Link to={"/user/" + users.id}>
                      {users.profile_pic ? (
                          <img
                              className="profile_pic"
                              src={users.profile_pic}
                              alt={`${users.first} ${users.last}`}
                          />
                      ) : (
                          <img
                              className="profile_pic"
                              src="/img/defaultProfilePic.png"
                              alt="default profile_pic"
                          />
                      )}
                      <h5>
                          {users.first} {users.last}
                      </h5>
                  </Link>
              </div>
          ));
} */
