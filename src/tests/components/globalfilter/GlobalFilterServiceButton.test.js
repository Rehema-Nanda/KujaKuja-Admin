import React from "react";
import { shallow } from "enzyme";
import GlobalFilterServiceButton from "../../../components/globalfilter/GlobalFilterServiceButton";

describe("<GlobalFilterServiceButton />", () => {
    let wrapper;
    const testProps = {
        selectedServiceTypes: ["1"],
        id: "1",
        toggleServiceType: jest.fn(),
    };
    beforeEach(() => {
        wrapper = shallow(<GlobalFilterServiceButton {...testProps} />);
    });
    it("renders correctly", () => {
        expect(wrapper.debug()).toMatchSnapshot();
    });

    it("toggles the buttton state when the button is clicked", () => {
        const button = wrapper.find("Button");
        const buttonState = wrapper.state().buttonState;
        button.simulate("click");
        expect(wrapper.state().buttonState).toEqual(!buttonState);
    });
});
