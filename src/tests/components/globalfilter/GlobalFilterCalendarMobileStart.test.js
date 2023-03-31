import React from "react";
import moment from "moment";
import { shallow } from "enzyme";
import GlobalFilterCalendarMobileStart from "../../../components/globalfilter/GlobalFilterCalendarMobileStart";

describe("<GlobalFilterCalendarMobileStart />", () => {
    const testProps = {
        dateEnd: moment.utc("2018-01-01"),
        setDateStartEnd: jest.fn(),
        displayMobileFilter: jest.fn()
    };
    const wrapper = shallow(<GlobalFilterCalendarMobileStart {...testProps} />);

    it("renders without crashing", () => {
        expect(wrapper.debug()).toMatchSnapshot();
    });

    it("should call handleDateChangeStart function when the date changes", () => {
        const testFunc = jest.spyOn(wrapper.instance(), "handleDateChangeStart");
        wrapper.instance().forceUpdate();
        const datePicker = wrapper.find("DatePicker");
        datePicker.simulate("change");
        expect(testFunc).toHaveBeenCalled();
    });
});
