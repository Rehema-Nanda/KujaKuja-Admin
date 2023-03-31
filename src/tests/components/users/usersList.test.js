import React from "react";
import { mount } from "enzyme";
import UsersList from "../../../components/users/list";
import { StoreProvider } from "../../../StoreContext";
import CountryStore from "../../../stores/Country/CountryStore";
import Country from "../../../stores/Country/Country";
import LocationStore from "../../../stores/Location/LocationStore";
import Location from "../../../stores/Location/Location";
import UserStore from "../../../stores/User/UserStore";
import User from "../../../stores/User/User";

jest.mock("bcryptjs");
jest.mock("../../../stores/Country/CountryStore");
jest.mock("../../../stores/Location/LocationStore");
jest.mock("../../../stores/User/UserStore");

CountryStore.mockImplementation(() => {
    return {
        countries: [
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
            new User(
                null,
                {
                    id: "2",
                    email: "testuser2@kujakuja.com",
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
        count: 2,
    };
});

describe("UsersList component", () => {
    const testProps = {
        history: {
            push: jest.fn(),
        },
    };
    const wrapper = mount(<UsersList {...testProps} />, {
        wrappingComponent: StoreProvider,
    });

    it("should render correctly", () => {
        expect(wrapper.debug()).toMatchSnapshot();
    });

    it("should display users table", () => {
        expect(wrapper.find("table")).toHaveLength(1);
        expect(wrapper.find("th").at(3).text()).toBe("Results: 2");
    });

    it("should push history when edit button is clicked", () => {
        wrapper.find("button").at(1).simulate("click");
        expect(testProps.history.push).toHaveBeenCalledWith("/users/1");
    });

    it("should push history when add button is clicked", () => {
        wrapper.find("button").first().simulate("click");
        expect(testProps.history.push).toHaveBeenCalledWith("/users/add");
    });

    it("should display a zero count on the users table", () => {
        UserStore.mockImplementationOnce(() => {
            return {
                users: [],
                count: 0,
            };
        });

        const wrapper2 = mount(<UsersList {...testProps} />, {
            wrappingComponent: StoreProvider,
        });
        expect(wrapper2.find("th").at(3).text()).toBe("Results: 0");
    });
});
