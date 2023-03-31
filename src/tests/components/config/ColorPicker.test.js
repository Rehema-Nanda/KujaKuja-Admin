import React from "react";
import { shallow } from "enzyme";
import ColorPicker from "../../../components/config/ColorPicker";

describe("<ColorPicker />", () => {
    const testProps = {
        handleColorChange: jest.fn(),
        color: "blue",
    };
    const wrapper = shallow(<ColorPicker {...testProps} />);

    it("should render correctly", () => {
        expect(wrapper.debug()).toMatchSnapshot();
    });

    it("should call handleClick function when the div is clicked", () => {
        const testFunc = jest.spyOn(wrapper.instance(), "handleClick");
        wrapper.instance().forceUpdate(); // reason here https://github.com/airbnb/enzyme/issues/944
        const div = wrapper.find("div").first();
        div.simulate("click");
        expect(testFunc).toHaveBeenCalled();
    });

    it("should call handleChange function when the color changes", () => {
        const testFunc = jest.spyOn(wrapper.instance(), "handleChange");
        wrapper.setState({ displayColorPicker: true });
        const color = {
            hex: "",
        };
        expect(wrapper.state().displayColorPicker).toEqual(true);
        const sketchPicker = wrapper.find("#sketch");
        sketchPicker.simulate("change", color);
        wrapper.instance().forceUpdate(); // reason here https://github.com/airbnb/enzyme/issues/944
        expect(testFunc).toHaveBeenCalled();
    });
    it("updates the state color after the prop changes", () => {
        wrapper.setProps({ refresh: "something" });
        expect(wrapper.state().color).toEqual("blue");
    });

    it("should set the displayColorPicker state to false when handleClose is called ", () => {
        const div = wrapper.find("div").at(3);
        div.simulate("click");
        expect(wrapper.state().displayColorPicker).toEqual(false);
    });
});
