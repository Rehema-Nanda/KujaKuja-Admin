import React from "react";
import moment from "moment";
import { shallow } from "enzyme";
import GlobalFilterCalendarMobileEnd from "../../../components/globalfilter/GlobalFilterCalendarMobileEnd";

describe("<GlobalFilterCalendarMobileStart />", () => {
    const testProps = {
        dateEnd: moment.utc("2018-01-01"),
        setDateStartEnd: jest.fn(),
        displayMobileFilter: jest.fn(),
    };
    const wrapper = shallow(<GlobalFilterCalendarMobileEnd {...testProps} />);

    it("renders without crashing", () => {
        expect(wrapper.debug()).toMatchSnapshot();
    });

    it("should call handleDateChangeEnd function when the date changes", () => {
        const testFunc = jest.spyOn(wrapper.instance(), "handleDateChangeEnd");
        wrapper.instance().forceUpdate();
        const datePicker = wrapper.find("DatePicker");
        datePicker.simulate("change");
        expect(testFunc).toHaveBeenCalled();
    });
});
