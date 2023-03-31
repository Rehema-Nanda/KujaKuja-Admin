import React from "react";
import { shallow } from "enzyme";
import GlobalFilterCheckbox from "../../../components/globalfilter/GlobalFilterCheckbox";

describe("<GlobalFilterCheckbox />", () => {
    const testProps = {
        selectedItems: ["1"],
        item: { id: "1" },
        selectItemHandler: jest.fn(),
        selectItemHandlerArgs: "Locations",
    };
    const wrapper = shallow(<GlobalFilterCheckbox {...testProps} />);

    it("renders correctly", () => {
        expect(wrapper.debug()).toMatchSnapshot();
    });

    it("changes checked state when the input for checkbox changes", () => {
        const input = wrapper.find("Input");
        const state = wrapper.state().checked;
        input.simulate("change");
        expect(wrapper.state().checked).toEqual(!state);
    });
});
