import React from "react";
import { shallow } from "enzyme";
import moment from "moment";
import GlobalFilter from "../../../components/globalfilter/GlobalFilter";

describe("<GlobalFilter />", () => {
    const fixedDate = moment.utc("2019-08-08").startOf("day");
    const testProps = {
        dateStart: fixedDate.clone().subtract(7, "days"),
        dateEnd: fixedDate,
        allCountries: [],
        selectedCountries: [],
        allLocations: [],
        selectedLocations: [],
        selectedServiceTypes: [],
        selectedUsers: [],
        selectedServicePoints: [],
        selectedSurveyTypes: [],
        selectedSatisfied: [],
        selectedFreshIdea: [],
        users: [{id: "1"}],
        locations: [{id: "1"}],
        countries: [{id: "1"}],
        booleanOptions: [{id: "1"}],
        surveyTypes: [{id: "1"}],
        servicePoints: [{id: "1"}],
    };

    let wrapper;
    beforeEach(() => {
        wrapper = shallow(<GlobalFilter {...testProps} />);
    });

    it("should render correctly", () => {
        expect(wrapper.debug()).toMatchSnapshot();
    });

    it("should set mobile filter true when globalfilter back button is clicked", () => {
        wrapper.setState({showMobileFilter: false});
        const div = wrapper.find("div.globalfilter-back-button");
        div.simulate("click");
        expect(wrapper.state().showMobileFilter).toBe(true);
    });

    it("should change the state of mobile controls when toggleMobileControlsAndClose function is called", () => {
        navigator.__defineGetter__("userAgent", function() {
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

    it("should set image sizes when mobileControlsOpen state is false and toggleMobileControlsAndClose function is called", () => {
        wrapper.setState({mobileControlsOpen: true});
        navigator.__defineGetter__("userAgent", function(){
            return "Chrome/75.0.3770.142 Safari/537.3";
        });
        const event = {
            target: {
                style: {},
            },
        };
        const toggle = wrapper.find("NavbarToggler");
        toggle.simulate("click", event);
        expect(event.target.style).toBeTruthy();
    });

    it("should change the state of showMobileFilterCountries when displayMobileFilterCountries function is called", () => {
        const button = wrapper.find("GlobalFilterMobileButton").at(3);
        button.simulate("click");
        expect(wrapper.state().showMobileFilterCountries).toBe(true);
    });

    it("should change the state of showMobileFilterLocations when displayMobileFilterLocations function is called", () => {
        const button = wrapper.find("GlobalFilterMobileButton").at(4);
        button.simulate("click");
        expect(wrapper.state().showMobileFilterLocations).toBe(true);
    });

    it("should change the state of showMobileFilterUsers when displayMobileFilterUsers function is called", () => {
        const button = wrapper.find("GlobalFilterMobileButton").first();
        button.simulate("click");
        expect(wrapper.state().showMobileFilterUsers).toBe(true);
    });

    it("should change the state of showMobileFilterServicePoints when displayMobileFilterServicePoints function is called", () => {
        const button = wrapper.find("GlobalFilterMobileButton").at(5);
        button.simulate("click");
        expect(wrapper.state().showMobileFilterServicePoints).toBe(true);
    });

    it("should change the state of showMobileFilterStartDate when displayMobileFilterStartDate function is called", () => {
        const button = wrapper.find("GlobalFilterMobileButton").at(1);
        button.simulate("click");
        expect(wrapper.state().showMobileFilterStartDate).toBe(true);
    });

    it("should change the state of showMobileFilterEndDate when displayMobileFilterEndDate function is called", () => {
        const button = wrapper.find("GlobalFilterMobileButton").at(2);
        button.simulate("click");
        expect(wrapper.state().showMobileFilterEndDate).toBe(true);
    });

    it("should change the state of showMobileFilterSurveyTypes when displayMobileFilterSurveyTypes function is called", () => {
        const button = wrapper.find("GlobalFilterMobileButton").at(6);
        button.simulate("click");
        expect(wrapper.state().showMobileFilterSurveyTypes).toBe(true);
    });

    it("should change the state of showMobileFilterSatisfied when displayMobileFilterSatisfied function is called", () => {
        const button = wrapper.find("GlobalFilterMobileButton").at(7);
        button.simulate("click");
        expect(wrapper.state().showMobileFilterSatisfied).toBe(true);
    });

    it("should change the state of showMobileFilterFreshIdea when displayMobileFilterFreshIdea function is called", () => {
        const button = wrapper.find("GlobalFilterMobileButton").at(8);
        button.simulate("click");
        expect(wrapper.state().showMobileFilterFreshIdea).toBe(true);
    });
});
