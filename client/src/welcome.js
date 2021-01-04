//import React from 'react';
import Registration from "./registration";

export default function Welcome() {
    return (
        <div>
            <h1>Welcome to my Social Network!</h1>
            <Registration />
            <p>Already a member? <a href="#">Log in</a></p>
        </div>
    );
}