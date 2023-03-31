import React from "react";
import { mount } from "enzyme";
import Dashboard from "../../components/Dashboard";
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
import DashboardStore from "../../stores/DashBoard/DashBoardStore";
import ResponseCount from "../../stores/DashBoard/ResponseCount";

jest.mock("../../stores/Country/CountryStore");
jest.mock("../../stores/Location/LocationStore");
jest.mock("../../stores/User/UserStore");
jest.mock("../../stores/ServiceType/ServiceTypeStore");
jest.mock("../../stores/ServicePoint/ServicePointStore");
jest.mock("../../stores/DashBoard/DashBoardStore");

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
        userInfo: [
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

DashboardStore.mockImplementation(() => {
    return {
        isLoading: false,
        responseCount: [
            new ResponseCount(
                null,
                {
                    satisfied: false,
                    cnt: "5",
                },
            ),
            new ResponseCount(
                null,
                {
                    satisfied: true,
                    cnt: "100",
                },
            ),
        ],
    };
});

describe("<Dashboard />", () => {
    const wrapper = mount(<Dashboard />, { wrappingComponent: StoreProvider });

    it("renders correctly", () => {
        // set last sign to prevent snapshot fail
        wrapper.setState({
            userProfile: { last_sign_in_at: "2019-08-15" },
        });

        expect(wrapper.debug()).toMatchSnapshot();
    });
});
