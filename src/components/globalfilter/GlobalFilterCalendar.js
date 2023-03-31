import React from "react";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import "./GlobalFilter.css";
import GlobalFilterCalendarContainer from "./GlobalFilterCalendarContainer";
import CalendarConfig from "./CalendarConfig";

export default class GlobalFilterCalendar extends GlobalFilterCalendarContainer {
    constructor(props) {
        super(props);

        this.handleDateChangeStart = this.handleDateChangeStart.bind(this);
        this.handleDateChangeEnd = this.handleDateChangeEnd.bind(this);
        this.datePickerInputFocusHandler = this.datePickerInputFocusHandler.bind(this);
        this.calendarContainer = this.calendarContainer.bind(this);
        this.state = {
            selectedDateRangeType: this.getDateRangeType(),
            isMobileView: false,
        };
    }

    handleDateChangeStart(startDate) {
        const { dateEnd } = this.props;

        this.handleDateRangeSelect(startDate, dateEnd, CalendarConfig.IS_START_DATE);
    }

    handleDateChangeEnd(endDate) {
        const { dateStart } = this.props;

        this.handleDateRangeSelect(dateStart, endDate, CalendarConfig.IS_END_DATE);
    }

    datePickerInputFocusHandler() {
        // immediately blur on focus to prevent the virtual keyboard from displaying on mobile devices
        // TODO: test for side effects, for example if the 'withPortal' option is true (see setBlur, cancelFocusInput, deferFocusInput & handleBlur functions at
        //       https://github.com/Hacker0x01/react-datepicker/blob/master/src/index.jsx)
        if (this.refs) {
            if (this.refs[CalendarConfig.START_DATE_PICKER_REF]) {
                this.refs[CalendarConfig.START_DATE_PICKER_REF].setBlur();
            }
            if (this.refs[CalendarConfig.END_DATE_PICKER_REF]) {
                this.refs[CalendarConfig.END_DATE_PICKER_REF].setBlur();
            }
        }
    }

    render() {
        const { dateEnd, dateStart, withPortal } = this.props;
        const { selectedDateRangeType } = this.state;

        return (

            <div className="date-pickers-holder">

                <button
                    type="button"
                    onClick={() => {
                        this.selectNewDateRange(-1);
                    }}
                    className="left-right-button left-button"
                >
                    <div className="left-right-arrow left-arrow" />
                </button>

                <DatePicker
                    className="date-picker-startdate"
                    withPortal={withPortal}
                    selected={dateStart}
                    selectsStart
                    ref={CalendarConfig.START_DATE_PICKER_REF}
                    monthsShown={2}
                    useWeekdaysShort={true}
                    onFocus={this.datePickerInputFocusHandler}
                    startDate={dateStart}
                    endDate={dateEnd}
                    maxDate={moment.utc().startOf("day")}
                    calendarContainer={this.calendarContainer}
                    popperPlacement="bottom-start"
                    popperModifiers={{
                        preventOverflow: {
                            enabled: true,
                            escapeWithReference: false,
                            boundariesElement: "viewport",
                        },
                    }}
                    onSelect={this.handleDateChangeStart}
                />

                <span className={`dash ${selectedDateRangeType === CalendarConfig.DAILY ? "hidden" : ""}`}> - </span>

                <DatePicker
                    className={`date-picker-enddate ${selectedDateRangeType === CalendarConfig.DAILY ? "hide-date" : ""}`}
                    withPortal={withPortal}
                    selected={dateEnd}
                    selectsEnd
                    ref={CalendarConfig.END_DATE_PICKER_REF}
                    monthsShown={2}
                    useWeekdaysShort={true}
                    onFocus={this.datePickerInputFocusHandler}
                    startDate={dateStart}
                    endDate={dateEnd}
                    maxDate={moment.utc().startOf("day")}
                    calendarContainer={this.calendarContainer}
                    popperPlacement="bottom-start"
                    popperModifiers={{
                        preventOverflow: {
                            enabled: true,
                            escapeWithReference: false,
                            boundariesElement: "viewport",
                        },
                    }}
                    onSelect={this.handleDateChangeEnd}
                />

                <button
                    type="button"
                    onClick={() => {
                        this.selectNewDateRange(1);
                    }}
                    className="left-right-button right-button"
                >
                    <div className="left-right-arrow right-arrow" />
                </button>

            </div>

        );
    }
}
