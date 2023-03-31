import React from "react";
import { mount, shallow } from "enzyme";
import moment from "moment";
import DataReviewList from "../../../components/data_review/list";
import { StoreProvider } from "../../../StoreContext";
import LocationStore from "../../../stores/Location/LocationStore";
import Location from "../../../stores/Location/Location";
import UserStore from "../../../stores/User/UserStore";
import User from "../../../stores/User/User";
import ServicePoint from "../../../stores/ServicePoint/ServicePoint";
import ServicePointStore from "../../../stores/ServicePoint/ServicePointStore";
import CountryStore from "../../../stores/Country/CountryStore";
import Country from "../../../stores/Country/Country";
import MyDataStore from "../../../stores/MyData/MyDataStore";
import Response from "../../../stores/MyData/Response";

jest.mock("../../../stores/Location/LocationStore");
jest.mock("../../../stores/User/UserStore");
jest.mock("../../../stores/ServicePoint/ServicePointStore");
jest.mock("../../../stores/Country/CountryStore");
jest.mock("../../../stores/MyData/MyDataStore");

MyDataStore.mockImplementation(() => {
    return {
        responsesNonSyndicated: [
            new Response(
                null,
                {
                    id: "1",
                    created_at: moment.utc(),
                    uploaded_at: moment.utc(),
                    idea: "test response for data aggregation pub/sub no. 3",
                    is_starred: false,
                    location: "Test Location",
                    satisfied: true,
                    service_point: "Test Point",
                    service_type: "Water",
                    user: "email@test.com",
                    user_location: "Test Location",
                    tags: "TestTag",
                    idea_language: "en",
                },
            ),
        ],
        countNonSyndicated: 1,
    };
});

LocationStore.mockImplementation(() => {
    return {
        locations: [
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
        users: [
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
        servicePoints: [
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

jest.spyOn(moment, "utc").mockImplementation(() => {
    return moment("2019-01-26");
});

describe("DataReviewList component", () => {
    const testProps = {
        history: {
            replace: jest.fn(),
        },
        surveyTypes: [{ id: "binary", name: "Self-Swipe" }],
        booleanOptions: [{ id: false, name: "No" }],
    };
    const wrapper = mount(<DataReviewList {...testProps} />, { wrappingComponent: StoreProvider });

    it("renders correctly", () => {
        expect(wrapper.debug()).toMatchSnapshot();
    });

    it.skip("should refresh page when function is fired", () => {
        const refresh = jest.spyOn(wrapper.instance(), "toggleRefresh");

        refresh();
        expect(wrapper.state().refreshData).toBeTruthy();
    });

    it("should toggle isUpdateDropdownOpen when toggleUpdateDropdown is called", () => {
        const { isUpdateDropdownOpen } = wrapper.state();
        const toggleUpdateDropdown = jest.spyOn(wrapper.instance(), "toggleUpdateDropdown");

        toggleUpdateDropdown();
        expect(wrapper.state().isUpdateDropdownOpen).toEqual(!isUpdateDropdownOpen);
    });

    it("should set state of param provided when setData is called", () => {
        const setData = jest.spyOn(wrapper.instance(), "setData");

        setData("limit", 10);
        expect(wrapper.state().limit).toBe(10);
    });

    it("should change selectedCountries state when 'Countries' is passed to selectLocation function", () => {
        const selectLocation = jest.spyOn(wrapper.instance(), "selectLocation");
        selectLocation("1", "Countries", true);
        expect(wrapper.state().selectedCountries).toBeTruthy();
    });

    it("should change selectedLocations state when 'Locations' is passed to selectLocation function", () => {
        const selectLocation = jest.spyOn(wrapper.instance(), "selectLocation");
        selectLocation("1", "Locations");
        expect(wrapper.state().selectedLocations).toBeTruthy();
    });

    it("should change selectedServicePoints state when 'ServicePoints' is passed to selectLocation function", () => {
        const selectLocation = jest.spyOn(wrapper.instance(), "selectLocation");
        selectLocation("1", "ServicePoints");
        expect(wrapper.state().selectedServicePoints).toBeTruthy();
    });

    it("should set selectedResponseIds state to all when selectAll checkbox is clicked", () => {
        const testWrapper = mount(<DataReviewList {...testProps} />, { wrappingComponent: StoreProvider });
        const handleRowSelectAll = jest.spyOn(testWrapper.instance(), "handleRowSelectAll");
        handleRowSelectAll(true);
        expect(testWrapper.state().selectedResponseIds.length).toBe(1);
    });

    it("should set selectedResponseIds state to empty array when selectAll checkbox is clicked again", async () => {
        const handleRowSelectAll = jest.spyOn(wrapper.instance(), "handleRowSelectAll");
        handleRowSelectAll();
        expect(wrapper.state().selectedResponseIds.length).toBe(0);
    });

    it("should set selectedForUpdate.name state to name of service point selected from dropdown", async () => {
        const handleServicePointSelect = jest.spyOn(wrapper.instance(), "handleServicePointSelect");
        handleServicePointSelect(1);
        expect(wrapper.state().selectedForUpdate.name).toBe("Test Service Point");
    });

    it("should remove de-selected row id from selectedResponseIds state", () => {
        wrapper.setState({ selectedResponseIds: ["1"] });
        const handleRowSelect = jest.spyOn(wrapper.instance(), "handleRowSelect");
        const row = {
            id: "1",
        };
        handleRowSelect(row);
        expect(wrapper.state().selectedResponseIds.includes(row.id)).toBe(false);
    });

    it("should add selected row id to selectedResponseIds state", () => {
        const testWrapper = mount(<DataReviewList {...testProps} />, { wrappingComponent: StoreProvider });
        const handleRowSelect = jest.spyOn(testWrapper.instance(), "handleRowSelect");
        const row = {
            id: "1",
        };
        handleRowSelect(row);
        expect(testWrapper.state().selectedResponseIds.includes(row.id)).toBe(true);
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
