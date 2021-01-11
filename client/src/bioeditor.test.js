// we're using Jest and React Testing Library together

// import React from "react";
import BioEditor from "./bioeditor";
import { render, fireEvent, waitFor } from "@testing-library/react";
import axios from "./axios";
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
    //const mockHandleChange = jest.fn();
    const mockEditBio = jest.fn();
    /* var data = {
        bio: "some bio",
    }; */
    axios.post.mockResolvedValue({
        // .mockResolvedValue() => from Jest
        // it should return an object since we've ({data})
        data: {
            bio: "some bio",
        }
        //mockEditBio(data= {bio: "some bio"})
    });

    const { container } = render(
        <BioEditor
            //bio="someeee bio"
            //editBio="true"
            //bioEditorIsVisible="true"
            //onClick={mockEditBio}
            //onChange="some bio"
            editBio={mockEditBio}
            //onClick={this.mockEditBio}
        />
    ); // 0 // "Edit" // Edit
    /* console.log(
        "container BEFORE event: ",
        container.querySelector("button").innerHTML
    );  */

    //console.log("container: ", container.innerHTML);

    console.log(
        'container.querySelector("button").children.length BEFORE event: ',
        container.querySelector("button").children.length
    );

    fireEvent.click(
        container.querySelector("button") // Edit
    ); /* console.log(
        'container.querySelector("button").children.length AFTER event: ',
        container.querySelector("button").children.length
    ); */ // "Save" // Save

    /* console.log(
        "container AFTER event: ",
        container.querySelector("button").innerHTML
    ); */ 
    expect(
        container.querySelector("button").innerHTML
    ).toBe("Save");
    //await waitFor(() => expect(container.querySelector("button").innerHTML).toBe("Save"));
    /* console.log(
        "mockEditBio.mock.calls.length: ",
        mockEditBio.mock.calls.length
    ); */

    fireEvent.click(
        container.querySelector("button") // Save
    ); 
    /* console.log(
        "mockEditBio.mock.calls.length: ",
        mockEditBio.mock.calls.length
    ); */ /* await waitFor(() =>
        expect(container.querySelector("button").children.length).toBe(1)
    );  */ // 0 // 0 // 0

    /* /* console.log(
        'container.querySelector("button").children.length AFTER event: ',
        container.querySelector("button").children.length
    );  */  
    await waitFor(
        () => expect(mockEditBio.mock.calls.length).toBe(1)
    ); // 1
    //expect(container.querySelector("button").children.length).toBe(1); // 0
});
