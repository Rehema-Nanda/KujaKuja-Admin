import React from "react";
import { mount } from "enzyme";

import LanguageSelectionModal from "../../../components/data_review/LanguageSelectionModal";

describe("LanguageSelectionModal component", () => {
    const testProps = {
        isOpen: true,
        toggle: jest.fn(),
        selectedForUpdate: {
            columnName: "",
            name: "",
            value: {},
        },
        responsesToUpdate: [{ id: "1", ideaLanguage: "en" }],
        handleLanguageSelect: jest.fn(),
    };

    const wrapper = mount(<LanguageSelectionModal {...testProps} />);

    it("should render correctly", () => {
        expect(wrapper.debug()).toMatchSnapshot();
    });

    it("should call handler function on language select", () => {
        const toggleBtn = wrapper.find("button").at(1);
        expect(toggleBtn.text()).toBe("English");

        toggleBtn.simulate("click");
        expect(testProps.handleLanguageSelect).toHaveBeenCalled();
    });
});
