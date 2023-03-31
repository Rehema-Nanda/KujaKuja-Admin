import React from "react";
import { mount } from "enzyme";
import { BrowserRouter } from "react-router-dom";
import NoPage from "../../../components/no_page/NoPage";

describe("NoPage component", () => {
    const testProps = {
        history: {
            goBack: jest.fn(),
        },
    };
    const wrapper = mount(<BrowserRouter><NoPage {...testProps} /></BrowserRouter>);

    it("render correctly", () => {
        expect(wrapper.debug()).toMatchSnapshot();
    });

    it("should go back when go back option is clicked", () => {
        const option = wrapper.find(".no-page-back").first();
        expect(option.text()).toEqual(" Go Back");

        option.simulate("click");
        expect(testProps.history.goBack).toHaveBeenCalled();
    });
});
