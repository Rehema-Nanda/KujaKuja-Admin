import React from "react";
import { mount } from "enzyme";

import AddTagModal from "../../../components/data_review/AddTagModal";

describe("AddTagModal component", () => {
    const props = {
        isOpen: true,
        toggle: jest.fn(),
        tags: [{ name: "TestTAg" }],
        tagResponse: jest.fn(),
        setTagToState: jest.fn(),
        selectedTag: "",
    };

    const wrapper = mount(<AddTagModal {...props} />);

    it("renders correctly", () => {
        expect(wrapper.debug()).toMatchSnapshot();
    });
});
