import React from "react";
import { shallow } from "enzyme";
import GlobalFilterSearch from "../../../components/globalfilter/GlobalFilterSearch";

describe("<GlobalFilterSearch/>", () => {
    let wrapper;
    const testProps = {
        setData: jest.fn(),
        toggleRefresh: jest.fn(),
    };

    beforeEach(() => {
        wrapper = shallow(<GlobalFilterSearch {...testProps} />);
    });

    it("renders correctly", () => {
        expect(wrapper.debug()).toMatchSnapshot();
    });

    it("should call handleSearchDebounced function when input changes", () => {
        const testFunc = jest.spyOn(wrapper.instance(), "handleSearchDebounced");
        const event = {
            target: {
                value: "someValue",
            },
        };
        const datePicker = wrapper.find("Input");
        datePicker.simulate("change", event);
        expect(testFunc).toHaveBeenCalled();
    });
});
