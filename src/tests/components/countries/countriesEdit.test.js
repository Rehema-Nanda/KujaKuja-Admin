import React from "react";
import { mount } from "enzyme";
import CountriesEdit from "../../../components/countries/edit";
import { StoreProvider } from "../../../StoreContext";
import CountryStore from "../../../stores/Country/CountryStore";
import Country from "../../../stores/Country/Country";

jest.mock("../../../stores/Country/CountryStore");

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

const mockCountryDelete = jest.fn();
countries[0].delete = mockCountryDelete;

const mockUpdateCountryFromServer = jest.fn(() => {
    return countries[0];
});
CountryStore.mockImplementation(() => {
    return {
        countries: countries,
        updateCountryFromServer: mockUpdateCountryFromServer,
    };
});

describe("CountriesEdit component", () => {
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
    const wrapper = mount(<CountriesEdit {...testProps} />, {
        wrappingComponent: StoreProvider,
    });

    it("should render correctly", () => {
        expect(mockUpdateCountryFromServer).toHaveBeenCalled();
        // console.log(wrapper.instance().simpleState.country);
        wrapper.update();
        expect(wrapper.debug()).toMatchSnapshot();
    });

    it("should push history when cancelForm function is called", () => {
        const e = { preventDefault: jest.fn() };
        const cancelForm = jest.spyOn(wrapper.instance(), "cancelForm");
        cancelForm(e);
        expect(testProps.history.push).toHaveBeenCalledWith("/countries");
    });

    it("should change modal state when toggleDeleteConfirmationModal function is called", () => {
        const modalState = wrapper.instance().simpleState.isDeleteConfirmationModalOpen;
        const toggleDeleteConfirmationModal = jest.spyOn(wrapper.instance(), "toggleDeleteConfirmationModal");
        toggleDeleteConfirmationModal();
        expect(wrapper.instance().simpleState.isDeleteConfirmationModalOpen).toEqual(!modalState);
    });

    it("should call delete function on Country object and push history when delete function is called", async () => {
        const deleteFn = jest.spyOn(wrapper.instance(), "delete");
        await deleteFn();
        expect(mockCountryDelete).toHaveBeenCalled();
        expect(testProps.history.push).toHaveBeenCalledWith("/countries");
    });
});
