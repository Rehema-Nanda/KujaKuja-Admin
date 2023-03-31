import React from "react";
import { shallow } from "enzyme";
import ConfirmationModal from "../../components/ConfirmationModal";
import StoreProvider from "../../StoreContext";

describe("<ConfirmationModal />", () => {
    const testProps = {
        isOpen: false,
        toggle: jest.fn(),
        buttonFunction: jest.fn(),
    };
    const wrapper = shallow(<ConfirmationModal {...testProps} />, { wrappingComponent: StoreProvider }); // eslint-disable-line react/jsx-props-no-spreading

    it("renders correctly", () => {
        expect(wrapper.debug()).toMatchSnapshot();
    });
});
