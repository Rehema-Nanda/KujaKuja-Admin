import React from "react";
import { mount } from "enzyme";
import ServicePointsEdit from "../../../components/service_points/edit";
import { StoreProvider } from "../../../StoreContext";
import CountryStore from "../../../stores/Country/CountryStore";
import Country from "../../../stores/Country/Country";
import LocationStore from "../../../stores/Location/LocationStore";
import Location from "../../../stores/Location/Location";
import ServiceTypeStore from "../../../stores/ServiceType/ServiceTypeStore";
import ServiceType from "../../../stores/ServiceType/ServiceType";
import ServicePointStore from "../../../stores/ServicePoint/ServicePointStore";
import ServicePoint from "../../../stores/ServicePoint/ServicePoint";

jest.mock("../../../stores/Country/CountryStore");
jest.mock("../../../stores/Location/LocationStore");
jest.mock("../../../stores/ServiceType/ServiceTypeStore");
jest.mock("../../../stores/ServicePoint/ServicePointStore");

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

const serviceTypes = [
    new ServiceType(
        null,
        {
            id: "1",
            name: "Test Service Type",
            created_at: null,
            updated_at: null,
        },
    ),
];

ServiceTypeStore.mockImplementation(() => {
    return {
        serviceTypes: serviceTypes,
        serviceTypesSortedByName: serviceTypes,
    };
});

const servicePoints = [
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
];

const mockServicePointDelete = jest.fn();
servicePoints[0].delete = mockServicePointDelete;

const mockUpdateServicePointFromServer = jest.fn(() => {
    return servicePoints[0];
});
ServicePointStore.mockImplementation(() => {
    return {
        servicePoints: servicePoints,
        updateServicePointFromServer: mockUpdateServicePointFromServer,
    };
});

describe("ServicePointsEdit component", () => {
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
    const wrapper = mount(<ServicePointsEdit {...testProps} />, {
        wrappingComponent: StoreProvider,
    });

    it("should render correctly", () => {
        expect(mockUpdateServicePointFromServer).toHaveBeenCalled();
        wrapper.update();
        expect(wrapper.debug()).toMatchSnapshot();
    });

    it("should push history when cancelForm function is called", () => {
        const e = { preventDefault: jest.fn() };
        const cancelForm = jest.spyOn(wrapper.instance(), "cancelForm");
        cancelForm(e);
        expect(testProps.history.push).toHaveBeenCalledWith("/service_points");
    });

    it("should change modal state when toggleDeleteConfirmationModal function is called", () => {
        const modalState = wrapper.instance().simpleState.isDeleteConfirmationModalOpen;
        const toggleDeleteConfirmationModal = jest.spyOn(wrapper.instance(), "toggleDeleteConfirmationModal");
        toggleDeleteConfirmationModal();
        expect(wrapper.instance().simpleState.isDeleteConfirmationModalOpen).toEqual(!modalState);
    });

    it("should call delete function on ServicePoint object and push history when delete function is called", async () => {
        const deleteFn = jest.spyOn(wrapper.instance(), "delete");
        await deleteFn();
        expect(mockServicePointDelete).toHaveBeenCalled();
        expect(testProps.history.push).toHaveBeenCalledWith("/service_points");
    });
});
