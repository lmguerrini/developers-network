// we're using Jest and React Testing Library together

// import React from "react";
import App from "./app";
import { render, waitForElement } from "@testing-library/react";
import axios from "./axios";

// what's the test we should run for async functions?

// (1st step) => mock axios 
jest.mock("./axios"); // => create a fake axios's version
// but we need also to return fake data (axio's response):
axios.get.mockResolvedValue({
    // .mockResolvedValue() => from Jest
    // it should return an object since we've ({data})
    // data is also an object since data => this.state = const {id, first, last, url}
    data: {
        id: 1,
        first: "someFirstName",
        last: "someLastName",
        profile_pic: "www.google.com",
    },
});

// (2st step) => import waitForElement
// this tell test to wait for the <div> to appear in DOM

test("app eventually renders the div", () => {
    const { container } = render(<App />);

    console.log("container.innerHTML BEFORE await: ", container.innerHTML); 
    // if in App we've an aync componentDidMount() we should have an empty container.innerHTML console.log

    // NB: 'await' is only allowed within async functions
    await waitForElement (() => container.querySelector("div"));

    console.log("container.innerHTML AFTER await: ", container.innerHTML);

    // checking something has been rendered in the DOM
    // but there're of course other ways to check it
    expect(container.querySelector("div").children.length).toBe(1);

    // NB: in order for this test to pass we NEED an ASYN fn
    //     otherwise => SyntaxError/ Test failed!
});
