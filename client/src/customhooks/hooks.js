import { useState, useEffect } from "react";
import axios from "../axios";

export default function Hooks() {
    const [first, setFirst] = useState("Pete"); // array destructoring
    // first = Pete
    // setFirst = fn to change useState value
    const [query, setQuery] = useState("");
    const [countries, setCountries] = useState([]);

    function onChange(e) {
        console.log("e.target.value: ", e.target.value); // what we write in the input field (live)
        setFirst(e.target.value); // first <= setFirst
    }
    // NB: there's no need to bind (vs class)!
    // => omChange={(e) => setFirst(e.target.value)}

    // componentDidMount (class) => useEffect (fn)
    useEffect(() => {
        // everytime there's a re-render useEffect will be rentered
        //console.log(`Hooks/useEffect: {first}`);
        let abort;
        // NB if we wanna use an async fn we have to use it in a IIFE
        (async () => {
            const { data } = await axios.get(
                `https://spicedworld.herokuapp.com/?q=${query}`
            );
            if (!abort) {
                console.log("data from spiceworld: ", data);
                setCountries(data);
            }
        })();

        // we can return a cleanup function
        return () => {
            // NB: this runs before every next re-render
            console.log(`About to replace ${query} wih a new value`);
            abort = true;
        };
    }, [query]); // "query" a 2nd argument => make get request only when "query is been updated

    //console.log("Hooks component rendered");
    return (
        <>
            <h2>Hello {first}! We are learnig hooks today</h2>
            {/* <input defaultValue={first} omChange={onChange} /> */}
            {/* <input
                defaultValue={first}
                omChange={(e) => setFirst(e.target.value)}
            /> */}
            <input
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type country here.."
            />
            <ul>
                {countries.map((country, index) => (
                    <li>
                        key={index}>{country}
                    </li>
                ))}{" "}
                :{!countries.length && query && <li>Nothing found</li>}
            </ul>
        </>
    );
}
