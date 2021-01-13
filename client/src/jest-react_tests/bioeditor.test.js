// we're using Jest and React Testing Library together

// import React from "react";
import BioEditor from "../bioeditor";
import { render, fireEvent, waitFor } from "@testing-library/react";
import axios from "../axios";
jest.mock("../axios"); // => create a fake axios's version

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
      The request should not actually happen during your test.
      When the mock request is successful, 
      the function that was passed as a prop to the component gets called`, async () => {
    const mockEditBio = jest.fn();

    axios.post.mockResolvedValue({
        data: {
            bio: "some bio test",
        },
    });

    const { container } = render(<BioEditor editBio={mockEditBio} />);

    //console.log("container BEFORE event: ", container.querySelector("button").innerHTML);

    fireEvent.click(
        container.querySelector("button") // Edit
    );
    //console.log("container AFTER event: ", container.querySelector("button").innerHTML);

    expect(container.querySelector("button").innerHTML).toBe("Save");
    //await waitFor(() => expect(container.querySelector("button").innerHTML).toBe("Save"));

    //console.log("B: ", mockEditBio.mock.calls.length);

    fireEvent.click(
        container.querySelector("button") // Save
    );
    //console.log("A: ", mockEditBio.mock.calls.length);

    await waitFor(() => expect(mockEditBio.mock.calls.length).toBe(1)); // 1
});
