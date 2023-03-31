import React from "react";
import { mount } from "enzyme";

import LocalFilter from "../../../components/data_review/LocalFilter";
import DateOptions from "../../../components/data_review/DateOptions";

describe("LocalFilter component", () => {
    const testProps = {
        handleLocalFilterDateOptionSelect: jest.fn(),
        selectedDateOption: DateOptions.CREATED_AT,
        locations: [{ id: "1", name: "test Location" }],
        handleUserLocationChange: jest.fn(),
        selectedUserLocations: [],
    };

    let wrapper;

    beforeEach(() => {
        wrapper = mount(<LocalFilter {...testProps} />);
    });

    it("renders correctly", () => {
        expect(wrapper.debug()).toMatchSnapshot();
    });

    it("should change the state of mobile controls when toggleMobileControlsAndClose function is called", () => {
        navigator.__defineGetter__("userAgent", () => {
            return "Chrome/75.0.3770.142 Safari/537.3";
        });

        const event = {
            target: {
                style: {},
            },
        };
        const toggle = wrapper.find("NavbarToggler");

        toggle.simulate("click", event);
        expect(wrapper.state().showMobileFilter).toBe(true);
    });

    it("should change showMobileFilterLocations state when displayMobileFilterLocations function is called", () => {
        const button = wrapper.find("Button.globalfilter-mobile-button").at(1);
        button.simulate("click");
        expect(wrapper.state().showMobileFilterLocations).toBe(true);
    });

    it("should change showMobileFilterDates state when displayMobileFilterDates function is called", () => {
        const button = wrapper.find("Button.globalfilter-mobile-button").first();
        button.simulate("click");
        expect(wrapper.state().showMobileFilterDates).toBe(true);
    });

    it("should set showMobileFilter state to true when global filter back button is clicked", () => {
        wrapper.setState({ showMobileFilter: false });
        const back = wrapper.find("div.globalfilter-back-button");
        back.simulate("click");
        expect(wrapper.state().showMobileFilter).toBe(true);
    });
});
