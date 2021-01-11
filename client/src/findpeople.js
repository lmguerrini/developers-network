import { useState, useEffect } from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default function FindPeople() {
    const [query, setQuery] = useState("");
    const [users, setUsers] = useState([]);

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
                setUsers(data);
            }
            if (query && !abort) {
                const { data } = await axios.get(`/users/search/${query}`);
                //console.log("data from GET users/search: ", data);
                setUsers(data);
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
            <h2>Find People</h2>
            <div className="findPeopleContainer">
                {!query && <h4>Checkout who just joined!</h4>}
                {!query &&
                    users.map((users, index) => (
                        <div key={index}>
                            <Link to={"/user/" + users.id}>
                                {users.profile_pic ? (
                                    <img
                                        /* className="profile_picBig" */
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
                    ))}{" "}
                {!query && <h4>Are you looking for someone in particular?</h4>}
                {/* <input defaultValue={users.first} omChange={onChange} /> */}
                {/* <input
                    defaultValue={users.first}
                    omChange={(e) => setFirst(e.target.value)}
                    /> */}
                <input
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search people here.."
                />
                {query &&
                    users.map((users, index) => (
                        <div key={index}>
                            <Link to={"/user/" + users.id}>
                                {users.profile_pic ? (
                                    <img
                                        /* className="profile_picBig" */
                                        className="profile_pic"
                                        src={users.profile_pic}
                                        alt={`${users.first} ${users.last}`}
                                        /* onClick={users.toggleModalUploader} */
                                    />
                                ) : (
                                    <img
                                        className="profile_pic"
                                        src="/img/defaultProfilePic.png"
                                        alt="default profile_pic"
                                        /* onClick={users.toggleModalUploader} */
                                    />
                                )}
                                <h5>
                                    {users.first} {users.last}
                                </h5>
                            </Link>
                        </div>
                    ))}
                {!users.length && query && (
                    <div /* className="registrationError" */>
                        <span>Nothing found, try again!</span>
                    </div>
                )}
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
