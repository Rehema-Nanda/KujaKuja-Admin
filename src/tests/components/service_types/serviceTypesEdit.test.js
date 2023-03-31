import React from "react";
import { mount } from "enzyme";
import ServiceTypesEdit from "../../../components/service_types/edit";
import { StoreProvider } from "../../../StoreContext";
import ServiceTypeStore from "../../../stores/ServiceType/ServiceTypeStore";
import ServiceType from "../../../stores/ServiceType/ServiceType";

jest.mock("../../../stores/ServiceType/ServiceTypeStore");

const serviceTypes = [
    new ServiceType(
        null,
        {
            id: "1",
            name: "Test Service Type",
        },
    ),
];

const mockServiceTypeDelete = jest.fn();
serviceTypes[0].delete = mockServiceTypeDelete;

const mockUpdateServiceTypeFromServer = jest.fn(() => {
    return serviceTypes[0];
});
ServiceTypeStore.mockImplementation(() => {
    return {
        serviceTypes: serviceTypes,
        updateServiceTypeFromServer: mockUpdateServiceTypeFromServer,
    };
});

describe("ServiceTypesEdit component", () => {
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
    const wrapper = mount(<ServiceTypesEdit {...testProps} />, {
        wrappingComponent: StoreProvider,
    });

    it("should render correctly", () => {
        expect(mockUpdateServiceTypeFromServer).toHaveBeenCalled();
        wrapper.update();
        expect(wrapper.debug()).toMatchSnapshot();
    });

    it("should push history when cancelForm function is called", () => {
        const e = { preventDefault: jest.fn() };
        const cancelForm = jest.spyOn(wrapper.instance(), "cancelForm");
        cancelForm(e);
        expect(testProps.history.push).toHaveBeenCalledWith("/service_types");
    });

    it("should change modal state when toggleDeleteConfirmationModal function is called", () => {
        const modalState = wrapper.instance().simpleState.isDeleteConfirmationModalOpen;
        const toggleDeleteConfirmationModal = jest.spyOn(wrapper.instance(), "toggleDeleteConfirmationModal");
        toggleDeleteConfirmationModal();
        expect(wrapper.instance().simpleState.isDeleteConfirmationModalOpen).toEqual(!modalState);
    });

    it("should redirect to list page upon element delete", async () => {
        const deleteFn = jest.spyOn(wrapper.instance(), "delete");
        await deleteFn();
        expect(mockServiceTypeDelete).toHaveBeenCalled();
        expect(testProps.history.push).toHaveBeenCalledWith("/service_types");
    });
});
