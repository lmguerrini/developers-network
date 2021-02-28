/* custom hooks for refactoring Login and Registration components */
import { useState } from "react";
import axios from "../axios";

export default function useAuthSubmit(path, fields) {
    const [error, setError] = useState("");

    const handleSubmit = async () => {
        try {
            const { data } = await axios.post(path, fields);
            console.log("data custom hook handleSubmit SpecificErrors: ", data);
            //data.success ? location.replace("/") : setError("Test custom hook handleSubmit SpecificErrors");

            data.success
                ? location.replace("/")
                : data.error == "!(first)"
                ? setError("Please fill in the 'First Name' field!")
                : data.error == "!(last)"
                ? setError("Please fill in the 'Last Name' field!")
                : data.error == "!(email)"
                ? setError("Please fill in the 'Email' field!")
                : data.error == "!(password)"
                ? setError("Please fill in the 'Password' field!")
                : data.error == "!(first && last && email && password)"
                ? setError("Please fill in all fields!")
                : data.error == "users_email_check"
                ? setError("Please enter a valid email!")
                : data.error == "users_email_key"
                ? setError(
                      "It seems this email already exists in our database. Please try again!"
                  )
                : setError("Ops, something went wrong!");
        } catch (err) {
            setError(true);
        }
    };

    return [error, handleSubmit];
}
