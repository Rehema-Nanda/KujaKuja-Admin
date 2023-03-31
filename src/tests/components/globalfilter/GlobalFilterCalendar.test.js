import React from "react";
import { shallow } from "enzyme";
import moment from "moment";
import GlobalFilterCalendar from "../../../components/globalfilter/GlobalFilterCalendar";

describe("<GlobalFilterCalendar />", () => {
    const testProps = {
        dateEnd: moment.utc("2018-12-12"),
        setDateStartEnd: jest.fn(),
        dateStart: moment.utc("2018-01-01")
    };
    const wrapper = shallow(<GlobalFilterCalendar {...testProps} />);
    it("renders correctly", () => {
        expect(wrapper.debug()).toMatchSnapshot();
    });

    it("calls handleDateChangeStart function when date in datepicker is selected", () => {
        const handleDateChangeStart = jest.spyOn(wrapper.instance(), "handleDateChangeStart");
        const handleDateChangeEnd = jest.spyOn(wrapper.instance(), "handleDateChangeEnd");
        wrapper.instance().forceUpdate();
        const startDatePicker = wrapper.find("DatePicker").first();
        const endDatePicker = wrapper.find("DatePicker").at(1);
        startDatePicker.simulate("select");
        endDatePicker.simulate("select");
        expect(handleDateChangeStart).toHaveBeenCalled();
        expect(handleDateChangeEnd).toHaveBeenCalled();
    });

    it("calls selectNewDateRange when button is clicked", () => {
        const selectNewDateRangeFunc = jest.spyOn(wrapper.instance(), "selectNewDateRange");
        wrapper.instance().forceUpdate();
        const button = wrapper.find("button").first();
        const secondButton = wrapper.find("button").at(1);
        button.simulate("click");
        secondButton.simulate("click");
        expect(selectNewDateRangeFunc).toHaveBeenCalled();
    });

    it("calls datePickerInputFocusHandler when the focus changes", () => {
        const datePickerInputFocusHandlerFunc = jest.spyOn(wrapper.instance(), "datePickerInputFocusHandler");
        wrapper.instance().forceUpdate();
        const startDatePicker = wrapper.find("DatePicker").first();
        startDatePicker.simulate("focus");
        expect(datePickerInputFocusHandlerFunc).toHaveBeenCalled();
    });
});
