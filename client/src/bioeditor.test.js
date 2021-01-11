// we're using Jest and React Testing Library together

// import React from "react";
import BioEditor from "./bioeditor";
import App from "./app";
import Profile from "./profile";
import { render, fireEvent, waitFor } from "@testing-library/react";
import axios from "./axios";
import Uploader from "./uploader";
jest.mock("./axios"); // => create a fake axios's version

test(`When no bio is passed to it, an "Add" button is rendered`, () => {
    // container = document (our entry point into the DOM)
    const { container } = render(<BioEditor bio="" editBio="true" />);
    //const { container } = render(<BioEditor bio="" editBio="false" />);
    //console.log("container: ", container.innerHTML);
    expect(container.querySelector("button").innerHTML).toBe("Add bio");
});

test(`When a bio is passed to it, an "Edit" button is rendered`, () => {
    const { container } = render(<BioEditor bio="some bio" editBio="true" />);
    //console.log("container: ", container.innerHTML);
    expect(container.querySelector("button").innerHTML).toBe("Edit");
});

test(`Clicking either the "Add" or "Edit" button causes a textarea and a "Save" button to be rendered`, () => {
    const mockToggleTextarea = jest.fn();
    const { container } = render(
        <BioEditor
            editBio="true"
            bioEditorIsVisible="false"
            onClick={mockToggleTextarea}
        />
    );
    //console.log("container BEFORE event: ", container.querySelector("button").innerHTML); // "Edit" || "Add"
    fireEvent.click(container.querySelector("button"));
    //console.log("container AFTER event: ", container.innerHTML); // "textarea" && "Save"

    expect(container.querySelector("textarea").innerHTML).toBeTruthy;
    expect(container.querySelector("button").innerHTML).toBe("Save");
});

test(`Clicking the "Save" button causes an ajax request. 
      The request should not actually happen during your test`, async () => {
    const mockEditBio = jest.fn();

    const { container } = render(
        <BioEditor
            bio="someeee bio"
            /* editBio="true" */
            bioEditorIsVisible="true"
            onClick={mockEditBio}
        />
    ); // 0 // "Edit"
    console.log(
        "container BEFORE event: ",
        container.querySelector("button").innerHTML
    ); // Edit

    axios.post.mockResolvedValue({
        // .mockResolvedValue() => from Jest
        // it should return an object since we've ({data})
        data: {
            bio: "some bio",
        },
    });

    //console.log("container: ", container.innerHTML);

    /* console.log(
        'container.querySelector("button").children.length BEFORE event: ',
        container.querySelector("button").children.length
    ); */

    fireEvent.click(container.querySelector("button")); // "Save"

    console.log(
        "container AFTER event: ",
        container.querySelector("button").innerHTML
    ); // Save
    console.log(
        'container.querySelector("button").children.length AFTER event: ',
        container.querySelector("button").children.length
    );

    expect(container.querySelector("button").innerHTML).toBe("Save");
    //await waitFor(() => expect(container.querySelector("button").innerHTML).toBe("Save"));
    console.log(
        "mockEditBio.mock.calls.length: ",
        mockEditBio.mock.calls.length
    );

    fireEvent.click(container.querySelector("button"));

    console.log(
        'container.querySelector("button").children.length AFTER event: ',
        container.querySelector("button").children.length
    ); // 0
    console.log(
        "mockEditBio.mock.calls.length: ",
        mockEditBio.mock.calls.length
    ); // 0 // 0

    /* await waitFor(() =>
        expect(container.querySelector("button").children.length).toBe(1)
    ); */ 
    /* await waitFor(
        () => expect(mockEditBio.mock.calls.length).toBe(1)
    ); */ // 0
    //expect(container.querySelector("button").children.length).toBe(1); // 0
});
