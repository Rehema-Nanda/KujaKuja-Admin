import React from "react";
import { mount } from "enzyme";
import bcryptjs from "bcryptjs";
import UsersEdit from "../../../components/users/edit";
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

const locations = [
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
];

LocationStore.mockImplementation(() => {
    return {
        locations: locations,
        locationsSortedByName: locations,
    };
});

const users = [
    new User(
        null,
        {
            id: "1",
            email: "testuser@kujakuja.com",
            encrypted_password: "encrypted password",
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
];

const mockUserDelete = jest.fn();
users[0].delete = mockUserDelete;

const mockUpdateUserFromServer = jest.fn(() => {
    return users[0];
});
UserStore.mockImplementation(() => {
    return {
        users: users,
        updateUserFromServer: mockUpdateUserFromServer,
        apiService: {
            isAuthenticated: jest.fn(),
            getProfile: jest.fn(),
        },
    };
});

describe("UsersEdit component", () => {
    const testProps = {
        history: {
            push: jest.fn(),
        },
        match: {
            params: {
                id: 1,
            },
        },
    };
    const wrapper = mount(<UsersEdit {...testProps} />, {
        wrappingComponent: StoreProvider,
    });

    it("should render correctly", () => {
        expect(mockUpdateUserFromServer).toHaveBeenCalled();
        wrapper.update();
        expect(wrapper.debug()).toMatchSnapshot();
    });

    it("should push history when cancelForm function is called", () => {
        const e = { preventDefault: jest.fn() };
        const cancelForm = jest.spyOn(wrapper.instance(), "cancelForm");
        cancelForm(e);
        expect(testProps.history.push).toHaveBeenCalledWith("/users");
    });

    it("should change modal state when toggleDeleteConfirmationModal function is called", () => {
        const modalState = wrapper.instance().simpleState.isDeleteConfirmationModalOpen;
        const toggleDeleteConfirmationModal = jest.spyOn(wrapper.instance(), "toggleDeleteConfirmationModal");
        toggleDeleteConfirmationModal();
        expect(wrapper.instance().simpleState.isDeleteConfirmationModalOpen).toEqual(!modalState);
    });

    it("should call delete function on User object and push history when delete function is called", async () => {
        const deleteFn = jest.spyOn(wrapper.instance(), "delete");
        await deleteFn();
        expect(mockUserDelete).toHaveBeenCalled();
        expect(testProps.history.push).toHaveBeenCalledWith("/users");
    });

    it("should call bycrypt hash function on submit if passwords do not match", () => {
        const handleFormSubmit = jest.spyOn(wrapper.instance(), "handleFormSubmit");
        handleFormSubmit(null, { password: "new password" });
        expect(bcryptjs.hash).toHaveBeenCalled();
    });
});
