import React from "react";
import { mount } from "enzyme";
import moment from "moment";
import MyData from "../../components/MyData";
import { StoreProvider } from "../../StoreContext";
import CountryStore from "../../stores/Country/CountryStore";
import Country from "../../stores/Country/Country";
import LocationStore from "../../stores/Location/LocationStore";
import Location from "../../stores/Location/Location";
import UserStore from "../../stores/User/UserStore";
import User from "../../stores/User/User";
import ServiceTypeStore from "../../stores/ServiceType/ServiceTypeStore";
import ServiceType from "../../stores/ServiceType/ServiceType";
import ServicePoint from "../../stores/ServicePoint/ServicePoint";
import ServicePointStore from "../../stores/ServicePoint/ServicePointStore";
import MyDataStore from "../../stores/MyData/MyDataStore";
import Response from "../../stores/MyData/Response";

jest.mock("../../stores/Country/CountryStore");
jest.mock("../../stores/Location/LocationStore");
jest.mock("../../stores/User/UserStore");
jest.mock("../../stores/ServiceType/ServiceTypeStore");
jest.mock("../../stores/ServicePoint/ServicePointStore");
jest.mock("../../stores/MyData/MyDataStore");

ServiceTypeStore.mockImplementation(() => {
    return {
        serviceTypes: [
            new ServiceType(
                null,
                {
                    id: "1",
                    name: "Test Service Type",
                    created_at: null,
                    updated_at: null,
                },
            ),
        ],
    };
});

CountryStore.mockImplementation(() => {
    return {
        enabledCountries: [
            new Country(
                null,
                {
                    id: "1",
                    enabled: false,
                    name: "Afghanistan",
                    iso_two_letter_code: "AF",
                    geojson: null,
                    lat: "0.00000000",
                    lng: "0.00000000",
                    created_at: null,
                    updated_at: null,
                },
            ),
        ],
    };
});

LocationStore.mockImplementation(() => {
    return {
        locationsSyndicated: [
            new Location(
                null,
                {
                    id: "1",
                    name: "Test Location",
                    geojson: null,
                    lat: "0.00000000",
                    lng: "0.00000000",
                    created_at: null,
                    updated_at: null,
                    country_id: "1",
                    country_name: "Afghanistan",
                },
            ),
        ],
    };
});

UserStore.mockImplementation(() => {
    return {
        usersSyndicated: [
            new User(
                null,
                {
                    id: "1",
                    email: "testuser@kujakuja.com",
                    encrypted_password: "password",
                    current_sign_in_at: "2020-01-01T00:00:00.000Z",
                    created_at: null,
                    updated_at: null,
                    settlement_id: "1",
                    settlement_name: "Test Location",
                    is_admin: true,
                    is_survey: false,
                    is_service_provider: false,
                },
            ),
        ],
    };
});

ServicePointStore.mockImplementation(() => {
    return {
        servicePointsSyndicated: [
            new ServicePoint(
                null,
                {
                    id: "1",
                    name: "Test Service Point",
                    lat: "0.00000000",
                    lng: "0.00000000",
                    created_at: null,
                    updated_at: null,
                    service_type_id: "1",
                    service_type_name: "Test Service Type",
                    settlement_id: "1",
                    settlement_name: "Test Location",
                },
            ),
        ],
    };
});

MyDataStore.mockImplementation(() => {
    return {
        responses: [
            new Response(
                null,
                {
                    id: "1",
                    idea: "Test idea response",
                    satisfied: false,
                    is_starred: true,
                    idea_language: "en",
                    service_type: "Test Service Type",
                    created_at: null,
                    location: "Test Location",
                    service_point: "Test Service Point",
                    tags: "Health",
                    uploaded_at: null,
                    user: "testuser@kujakuja.com",
                    user_location: "Test Location",
                },
            ),
        ],
        count: 1,
    };
});

// fix the date returned by moment.utc() in the constructor of the MyData component for testing purposes
// this prevents snapshot tests from failing because the date keeps changing
jest.spyOn(moment, "utc").mockImplementation(() => moment("2015-04-01"));

describe("MyData component", () => {
    const testProps = {
        history: {
            replace: jest.fn(),
        },
        surveyTypes: [{ id: "binary", name: "Self-Swipe" }],
        booleanOptions: [{ id: false, name: "No" }],
    };
    const wrapper = mount(<MyData {...testProps} />, { wrappingComponent: StoreProvider });
    wrapper.setState({
        responses: [{
            created_at: moment.utc("2015-03-04T00:00:00.000Z"),
            id: "1",
            idea: "test response forhttps://gitlab.com data aggregation pub/sub no. 3",
            is_starred: false,
            location: "Test Location",
            satisfied: true,
            service_point: "Test Point",
            service_type: "Water",
            user: "email@test.com",
            tags: "TestTag",
        }],
    });

    it("renders correctly", () => {
        expect(wrapper.debug()).toMatchSnapshot();
    });

    it("should redirect to responses page on clicking view button", () => {
        wrapper.findWhere((n) => {
            return n.type() === "button" && n.text() === "View";
        }).first().simulate("click");
        expect(testProps.history.replace).toHaveBeenCalledWith("/responses/1");
    });

    it.skip("should refresh page when function is fired", () => {
        const refresh = jest.spyOn(wrapper.instance(), "toggleRefresh");

        refresh();
        expect(wrapper.state().refreshData).toBeTruthy();
    });

    it("should change selectedCountries state when Countries is passed in selectLocation function", () => {
        const selectLocation = jest.spyOn(wrapper.instance(), "selectLocation");

        selectLocation("1", "Countries");
        expect(wrapper.state().selectedCountries).toBeTruthy();
    });

    it("should change selectedLocations state when Locations is passed in selectLocation function", () => {
        const selectLocation = jest.spyOn(wrapper.instance(), "selectLocation");

        selectLocation("1", "Locations");
        expect(wrapper.state().selectedLocations).toBeTruthy();
    });

    it("should change selectedServicePoints state when ServicePoints is passed in selectLocation function", () => {
        const selectLocation = jest.spyOn(wrapper.instance(), "selectLocation");

        selectLocation("1", "ServicePoints");
        expect(wrapper.state().selectedServicePoints).toBeTruthy();
    });

    it("should set selectedUsers state when selectUser function is called with id only", () => {
        const selectUser = jest.spyOn(wrapper.instance(), "selectUser");

        selectUser("1");
        expect(wrapper.state().selectedUsers).toBeTruthy();
    });

    it("should set selectedUsers state when selectUser function is called with id and clear params", () => {
        const selectUser = jest.spyOn(wrapper.instance(), "selectUser");

        selectUser("1", true);
        expect(wrapper.state().selectedUsers).toBeTruthy();
    });

    it("should set selectedSurveyTypes state when selectSurveyType function is called with id only", () => {
        const selectSurveyType = jest.spyOn(wrapper.instance(), "selectSurveyType");

        selectSurveyType("1");
        expect(wrapper.state().selectedSurveyTypes).toBeTruthy();
    });

    it("should set selectedSurveyTypes state when selectSurveyType function is called id and clear params", () => {
        const selectSurveyType = jest.spyOn(wrapper.instance(), "selectSurveyType");

        selectSurveyType("1", true);
        expect(wrapper.state().selectedSurveyTypes).toBeTruthy();
    });

    it("should set selectedSatisfied state when selectSatisfied function is called with id only", () => {
        const selectSatisfied = jest.spyOn(wrapper.instance(), "selectSatisfied");

        selectSatisfied("1");
        expect(wrapper.state().selectedSatisfied).toBeTruthy();
    });

    it("should set selectedSatisfied state when selectSatisfied function is called with id and clear params", () => {
        const selectSatisfied = jest.spyOn(wrapper.instance(), "selectSatisfied");

        selectSatisfied("1", true);
        expect(wrapper.state().selectedSatisfied).toBeTruthy();
    });

    it("should set selectedFreshIdea state when selectFreshIdea function is called with id only", () => {
        const selectFreshIdea = jest.spyOn(wrapper.instance(), "selectFreshIdea");

        selectFreshIdea("1");
        expect(wrapper.state().selectedFreshIdea).toBeTruthy();
    });

    it("should set selectedFreshIdea state when selectFreshIdea function is called id and clear params", () => {
        const selectFreshIdea = jest.spyOn(wrapper.instance(), "selectFreshIdea");

        selectFreshIdea("1", true);
        expect(wrapper.state().selectedFreshIdea).toBeTruthy();
    });

    it("should set dateEnd and dateStart states when setDateStartEnd is called", () => {
        const setDateStartEnd = jest.spyOn(wrapper.instance(), "setDateStartEnd");
        const dateEnd = moment.utc("2018-01-01");
        const dateStart = moment.utc("2018-12-12");

        setDateStartEnd(dateStart, dateEnd);
        expect(wrapper.state().dateStart).toBeTruthy();
        expect(wrapper.state().dateEnd).toBeTruthy();
    });

    it("should set refreshData state when toggleServiceType function is called", () => {
        const toggleServiceType = jest.spyOn(wrapper.instance(), "toggleServiceType");

        toggleServiceType("1");
        expect(wrapper.state().refreshData).toBeTruthy();
    });

    it("should reset filters when reset all filters is clicked", () => {
        wrapper.setState({ selectedCountries: ["1", "2"], selectedUsers: ["4", "5"] });
        wrapper.find("div.globalfilter-reset-filters-container").find("button").first().simulate("click");
        expect(wrapper.state().selectedCountries.length).toBe(0);
        expect(wrapper.state().selectedUsers.length).toBe(0);
    });
});
