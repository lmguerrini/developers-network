// we're using Jest and React Testing Library together

// import React from "react";
import App from "./app";
import { render, waitFor } from "@testing-library/react";
// NB: waitForElement: deprecated, use waitFor instead!
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

test("app eventually renders the div", async () => {
    const { container } = render(<App />);

    /* console.log(
        "container.innerHTML BEFORE await: ",
        container.querySelector("div").innerHTML
    ); */
    // if in App we've an aync componentDidMount() we should have an empty/diff
    // container.querySelector("div").innerHTML); console.log
    //expect(container.querySelector("div").children.length).toBe(0); // 1
    // NB: 'await' is only allowed within async functions
    await waitFor(() => container.querySelector("div"));

    /* console.log(
        "container.innerHTML AFTER await: ",
        container.querySelector("div").innerHTML
    ); */
    /* console.log(
        'container.querySelector("div").children.length AFTER await: ',
        container.querySelector("div").children.length
    ); */

    // checking something has been rendered in the DOM
    // but there're of course other ways to check it
    expect(container.querySelector("div").children.length).toBe(1);

    // NB: in order for this test to pass we NEED an ASYN fn
    //     otherwise => SyntaxError/ Test failed!
});
