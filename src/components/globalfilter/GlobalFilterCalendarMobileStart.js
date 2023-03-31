
import React from "react";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import GlobalFilterCalendarContainer from "./GlobalFilterCalendarContainer";
import CalendarConfig from "./CalendarConfig";

export default class GlobalFilterCalendarMobileStart extends GlobalFilterCalendarContainer {
    constructor(props) {
        super(props);
        this.handleDateChangeStart = this.handleDateChangeStart.bind(this);
        this.calendarContainer = this.calendarContainer.bind(this);
        this.state = {
            selectedDateRangeType: this.getDateRangeType(),
            isMobileView: true,
        };
    }

    handleDateChangeStart(startDate) {
        const { dateEnd, displayMobileFilter } = this.props;

        this.handleDateRangeSelect(startDate, dateEnd, CalendarConfig.IS_START_DATE);
        displayMobileFilter();
    }

    render() {
        const { dateStart, dateEnd, withPortal } = this.props;

        return (

            <div className="date-pickers-holder fadein">
                <DatePicker
                    inline
                    className="date-picker-startdate"
                    withPortal={withPortal}
                    selected={dateStart}
                    selectsStart
                    ref={CalendarConfig.START_DATE_PICKER_REF}
                    startDate={dateStart}
                    endDate={dateEnd}
                    calendarContainer={this.calendarContainer}
                    maxDate={moment.utc().startOf("day")}
                    onChange={this.handleDateChangeStart}
                />
            </div>

        );
    }
}
