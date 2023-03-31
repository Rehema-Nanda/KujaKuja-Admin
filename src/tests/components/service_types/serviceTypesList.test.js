import React from "react";
import { mount } from "enzyme";
import ServiceTypesList from "../../../components/service_types/list";
import { StoreProvider } from "../../../StoreContext";
import ServiceTypeStore from "../../../stores/ServiceType/ServiceTypeStore";
import ServiceType from "../../../stores/ServiceType/ServiceType";

jest.mock("../../../stores/ServiceType/ServiceTypeStore");

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
            new ServiceType(
                null,
                {
                    id: "2",
                    name: "Test Service Type 2",
                    created_at: null,
                    updated_at: null,
                },
            ),
        ],
        count: 2,
    };
});

describe("ServiceTypesList component", () => {
    const testProps = {
        history: {
            push: jest.fn(),
        },
    };
    const wrapper = mount(<ServiceTypesList {...testProps} />, {
        wrappingComponent: StoreProvider,
    });

    it("should render correctly", () => {
        expect(wrapper.debug()).toMatchSnapshot();
    });

    it("should display service types table", () => {
        expect(wrapper.find("table")).toHaveLength(1);
        expect(wrapper.find("th").at(1).text()).toBe("Results: 2");
    });

    it("should push history when edit button is clicked", () => {
        wrapper.find("button").first().simulate("click");
        expect(testProps.history.push).toHaveBeenCalledWith("/service_types/1");
    });

    it("should push history when add button is clicked", () => {
        // note that we are not actually simulating a click, unlike above
        // this is because the button is only visible to admins
        const addElement = jest.spyOn(wrapper.instance(), "addElement");

        addElement();
        expect(testProps.history.push).toHaveBeenCalledWith("/service_types/add");
    });

    it("should display a zero count on the service types table", () => {
        ServiceTypeStore.mockImplementationOnce(() => {
            return {
                serviceTypes: [],
                count: 0,
            };
        });

        const wrapper2 = mount(<ServiceTypesList {...testProps} />, {
            wrappingComponent: StoreProvider,
        });
        expect(wrapper2.find("th").at(1).text()).toBe("Results: 0");
    });
});
