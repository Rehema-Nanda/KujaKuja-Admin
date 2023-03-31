import React from "react";
import { mount } from "enzyme";
import BtnRow from "../../components/BtnRow";
import { StoreProvider } from "../../StoreContext";

describe("BtnRow component", () => {
    const testProps = {
        buttonLabel: "TestLabel",
        cancelForm: jest.fn(),
    };
    const wrapper = mount(<BtnRow {...testProps} />, { wrappingComponent: StoreProvider }); // eslint-disable-line react/jsx-props-no-spreading

    it("renders correctly", () => {
        expect(wrapper.debug()).toMatchSnapshot();
    });
});
