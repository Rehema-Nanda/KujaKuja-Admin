import React from "react";
import { shallow } from "enzyme";
import GlobalFilterDropdown from "../../../components/globalfilter/GlobalFilterDropdown";

describe("<GlobalFilterDropdown />", () => {
    const testProps = {
        selectedItems: ["1"],
        id: "ServicePointsDropDown",
        items: [{ id: "2", name: "test" }],
        itemLabelProperty: "name",
    };
    let wrapper;
    beforeEach(() => {
        wrapper = shallow(<GlobalFilterDropdown {...testProps} />);
    });

    it("renders correctly", () => {
        expect(wrapper.debug()).toMatchSnapshot();
    });

    it("sets selecteditemname state when selectedItem prop changes", () => {
        wrapper.setProps({ selectedItems: ["2"] });
        expect(wrapper.state().selectedItemName).toEqual("test");
    });

    it("toggles the state of popoverOpen when the div is clicked", () => {
        const div = wrapper.find("div.map-controls-button");
        const state = wrapper.state().popoverOpen;
        div.simulate("click");
        expect(wrapper.state().popoverOpen).toEqual(!state);
    });
});
