import React from "react";
import { shallow } from "enzyme";
import FileUploader from "../../../components/config/FileUploader";

describe("<FileUploader />", () => {
    const testProps = {
        updateFile: jest.fn(),
        file: "",
        url: "",
        refresh: "test",
    };
    const wrapper = shallow(<FileUploader {...testProps} />);

    it("renders corectly", () => {
        expect(wrapper.debug()).toMatchSnapshot();
    });

    it("should call onChangeHandler function when the input changes", () => {
        const testFunc = jest.spyOn(wrapper.instance(), "onChangeHandler");
        const blob = new Blob();
        const event = {
            target: {
                files: [blob],
            },
        };
        wrapper.instance().forceUpdate(); // reason here https://github.com/airbnb/enzyme/issues/944
        const input = wrapper.find("input");
        input.simulate("change", event);
        expect(testFunc).toHaveBeenCalled();
    });

    it("changes state when the component props changes", () => {
        wrapper.setProps({ refresh: "something" });
        expect(wrapper.state().refresh).toEqual("something");
    });
});
