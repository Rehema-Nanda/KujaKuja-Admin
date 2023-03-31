import React from "react";
import { mount } from "enzyme";

import LocalUserLocationFilter from "../../../components/data_review/LocalUserLocationFilter";

describe("LocalUserLocationFilter component", () => {
    const testProps = {
        locations: [
            { id: "1", name: "Test Location" },
            { id: "2", name: "Test Long Location" },
        ],
        handleUserLocationChange: jest.fn(),
        selectedUserLocations: [],
    };

    const wrapper = mount(<LocalUserLocationFilter {...testProps} />);

    it("renders correctly", () => {
        expect(wrapper.debug()).toMatchSnapshot();
    });

    it("should not truncate long strings", () => {
        const props = {
            ...testProps,
            selectedUserLocations: ["1"],
        };
        const tree = mount(<LocalUserLocationFilter {...props} />);
        const btn = tree.find(".user-location-button");
        expect(btn.text()).toBe("1 Test Location");
    });

    it("should truncate long strings", () => {
        const props = {
            ...testProps,
            selectedUserLocations: ["2"],
        };
        const tree = mount(<LocalUserLocationFilter {...props} />);
        const btn = tree.find(".user-location-button");
        expect(btn.text()).toBe("1 Test Long Loca...");
    });
});
