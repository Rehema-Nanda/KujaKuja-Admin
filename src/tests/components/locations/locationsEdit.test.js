import React from "react";
import { mount } from "enzyme";
import LocationsEdit from "../../../components/locations/edit";
import { StoreProvider } from "../../../StoreContext";
import CountryStore from "../../../stores/Country/CountryStore";
import Country from "../../../stores/Country/Country";
import LocationStore from "../../../stores/Location/LocationStore";
import Location from "../../../stores/Location/Location";

jest.mock("../../../stores/Country/CountryStore");
jest.mock("../../../stores/Location/LocationStore");

const countries = [
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
];

CountryStore.mockImplementation(() => {
    return {
        countries: countries,
        countriesSortedByName: countries,
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

const mockLocationDelete = jest.fn();
locations[0].delete = mockLocationDelete;

const mockUpdateLocationFromServer = jest.fn(() => {
    return locations[0];
});
LocationStore.mockImplementation(() => {
    return {
        locations: locations,
        updateLocationFromServer: mockUpdateLocationFromServer,
    };
});

describe("LocationsEdit component", () => {
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
    const wrapper = mount(<LocationsEdit {...testProps} />, {
        wrappingComponent: StoreProvider,
    });

    it("should render correctly", () => {
        expect(mockUpdateLocationFromServer).toHaveBeenCalled();
        wrapper.update();
        expect(wrapper.debug()).toMatchSnapshot();
    });

    it("should push history when cancelForm function is called", () => {
        const e = { preventDefault: jest.fn() };
        const cancelForm = jest.spyOn(wrapper.instance(), "cancelForm");
        cancelForm(e);
        expect(testProps.history.push).toHaveBeenCalledWith("/locations");
    });

    it("should change modal state when toggleDeleteConfirmationModal function is called", () => {
        const modalState = wrapper.instance().simpleState.isDeleteConfirmationModalOpen;
        const toggleDeleteConfirmationModal = jest.spyOn(wrapper.instance(), "toggleDeleteConfirmationModal");
        toggleDeleteConfirmationModal();
        expect(wrapper.instance().simpleState.isDeleteConfirmationModalOpen).toEqual(!modalState);
    });

    it("should call delete function on Location object and push history when delete function is called", async () => {
        const deleteFn = jest.spyOn(wrapper.instance(), "delete");
        await deleteFn();
        expect(mockLocationDelete).toHaveBeenCalled();
        expect(testProps.history.push).toHaveBeenCalledWith("/locations");
    });
});
