// we're using Jest and React Testing Library together

// import React from "react";
import ProfilePic from "./profilepic";
import { render, fireEvent } from "@testing-library/react";

// npm test => to run the test

test("When no url is passed, /default.jpg is used as src", () => {
    // container = document (our entry point into the DOM)
    const { container } = render(<ProfilePic />);
    //console.log("container: ", container);
    /*  console.log(
        'container.querySelector("img"): ',
        container.querySelector("img")
    ); */
    /* console.log(
        'container.querySelector("img").src: ',
        container.querySelector("img").src
    ); */

    /* expect(container.querySelector("img").src).toBe(
        "http://localhost/img/defaultProfilePic.png"
    ); */

    expect(container.querySelector("img").src.endsWith("defaultProfilePic.png"))
        .true;
});

test("When url is passed as a prop, that url is set as the value of the src attribute", () => {
    const { container } = render(
        <ProfilePic profile_pic="https://www.fillmurray.com/500/500" />
    );

    /* console.log(
        'container.querySelector("img").src: ',
        container.querySelector("img").src
    ); */

    expect(container.querySelector("img").src).toBe(
        "https://www.fillmurray.com/500/500"
    );
});

test("When first and last props are passed, first and last are assigned as the value of the alt attribute", () => {
    //const { container } = render(<ProfilePic first="first1" last="last1" />);
    const { container } = render(
        <ProfilePic
            profile_pic="https://www.fillmurray.com/500/500"
            first="first1"
            last="last1"
        />
    );

    /* console.log(
        'container.querySelector("img").src: ',
        container.querySelector("img").src
    ); */

    // NB: I don't care, in this case, about first and last's value,
    //     but instead that they'll be there
    expect(container.querySelector("img").alt).toBe("first1 last1");
    // failed with the 1st {container} cause of conditional (ternary) operator: profile_pic? alt={`${first} ${last}`} : alt="default profile_pic"
    // expect(container.querySelector("img").alt).toBe("default profile_pic");
    // now it passed adding to the 2nd {container} the url (profile_pic)
});

/* **** Mock Functions **** */
// in this case we need to mock our onClick fn, cause:
// 1. if we wanna know (test) if and how many times (length) our fn is called when we click
// 2. if we wanna know what our fn was passed
// 3. if we wanna know what our fn return
// NB: mock is not the only way to achieve it
// To create a mock function: const myMockFn = jest.fn();

/* const myMockFn = jest.fn((n) => n * 2);

test("map calls function correctly", () => {
    const a = [10, 20, 30];
    a.map(myMockFn);

    expect(myMockFn.mock.calls.length).toBe(3);

    expect(myMockFn.mock.calls[0]).toEqual([10, 0, a]);

    expect(myMockFn.mock.calls[1]).toEqual([20, 1, a]);

    expect(myMockFn.mock.calls[2]).toEqual([30, 2, a]);

    expect(myMockFn.mock.results[0].value).toBe(20);

    expect(myMockFn.mock.results[1].value).toBe(40);

    expect(myMockFn.mock.results[2].value).toBe(60);
}); */

/* mockFn.mock.calls; // https://jestjs.io/docs/en/mock-function-api#mockfnmockcalls
// An array containing the call arguments of all calls that have been made to this mock function.
// Each item in the array is an array of arguments that were passed during the call.
// For example: A mock function f that has been called twice, with the arguments f('arg1', 'arg2'), and then with the arguments f('arg3', 'arg4'),
// would have a mock.calls array that looks like this:
[
    ["arg1", "arg2"],
    ["arg3", "arg4"],
];
// in our case:
[
    [10, 0, a], // myMockFn.mock.calls[0]
    [20, 1, a], // myMockFn.mock.calls[1]
    [30, 2, a], // myMockFn.mock.calls[2]
]; */

/* mockFn.mock.results; // https://jestjs.io/docs/en/mock-function-api#mockfnmockresults
// An array containing the results of all calls that have been made to this mock function.
// Each entry in this array is an object containing a "type" property, and a value" property.
// "type" will be one of the following:
//    'return' - Indicates that the call completed by returning normally.
//    'throw' - Indicates that the call completed by throwing a value.
//    'incomplete' - Indicates that the call has not yet completed.
//                   This occurs if you test the result from within the mock function itself,
//                   or from within a function that was called by the mock.
[
    {
        type: "return",
        value: "result1",
    },
    {
        type: "throw",
        value: {
            // Error instance 
        },
    },
    {
        type: "return",
        value: "result2",
    },
]; */

test("onClick prop runs when the ims is clicked", () => {
    const mockToggleModalUploader = jest.fn(); // fn empty cause we just wanna know if it runs
    const { container } = render(
        <ProfilePic onClick={mockToggleModalUploader} />
    );

    console.log(
        'container.querySelector("img") BEFORE event: ',
        container.querySelector("img")
    );

    // but how to fire an event in a test (in this case click on an img)?
    // for this we imported {fireEvent}, so that we can:
    fireEvent.click(container.querySelector("img"));
    // all code after this= after the img has been clicked

    console.log(
        'container.querySelector("img") AFTER event: ',
        container.querySelector("img")
    );

    // confirm the click handler was triggered just once
    expect(mockToggleModalUploader.mock.calls.length).toBe(1); // cause should run only once
    // NB: doesn't work, event didn't fire for some reason..
});
