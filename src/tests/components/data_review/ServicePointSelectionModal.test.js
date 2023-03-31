import React from "react";
import { mount } from "enzyme";

import ServicePointSelectionModal from "../../../components/data_review/ServicePointSelectionModal";

describe("ServicePointSelectionModal component", () => {
    const testProps = {
        isOpen: true,
        toggle: jest.fn(),
        selectedForUpdate: {
            columnName: "",
            name: "",
            value: {},
        },
        servicePointsToDisplay: [
            { id: "1", name: "Test SP", settlementName: "test location" },
            { id: "2", name: "Test Service Point in Nairobi", settlementName: "test location 2" },
        ],
        responsesToUpdate: [{ id: "1", name: "Test SP" }],
        handleServicePointSelect: jest.fn(),
    };

    const wrapper = mount(<ServicePointSelectionModal {...testProps} />);

    it("should render correctly", () => {
        expect(wrapper.debug()).toMatchSnapshot();
    });

    it("should call handler function on service point select", () => {
        const toggleBtn = wrapper.find("button").at(1);
        expect(toggleBtn.text()).toBe("Test SP - test location");

        toggleBtn.simulate("click");
        expect(testProps.handleServicePointSelect).toHaveBeenCalled();
    });
});
