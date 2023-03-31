import CalendarConfig from "../../../components/globalfilter/CalendarConfig";

describe("#CalendarConfig", () => {
    it("should return correct mappings", () => {
        expect(CalendarConfig.DAILY).toEqual("daily");
        expect(CalendarConfig.WEEKLY).toEqual("weekly");
        expect(CalendarConfig.MONTHLY).toEqual("monthly");
        expect(CalendarConfig.IS_START_DATE).toEqual("is_start_date");
        expect(CalendarConfig.IS_END_DATE).toEqual("is_end_date");
        expect(CalendarConfig.CALENDAR_DATE_ISO).toEqual("calendar_date_iso");
        expect(CalendarConfig.CALENDAR_DATE).toEqual("calendar_date");
        expect(CalendarConfig.WEEK_MONTH_TO_DATE).toEqual("week_month_to_date");
        expect(CalendarConfig.START_DATE_PICKER_REF).toEqual("picker1");
        expect(CalendarConfig.END_DATE_PICKER_REF).toEqual("picker2");
        expect(CalendarConfig.HEADING_SELECT_DATE_DAY).toEqual("Please select a day");
        expect(CalendarConfig.HEADING_SELECT_DATE_WEEK).toEqual("Please select a week");
        expect(CalendarConfig.HEADING_SELECT_DATE_MONTH).toEqual("Please select a month");
        expect(CalendarConfig.HEADING_CUSTOM_START_DATE).toEqual("Please select a custom START date");
        expect(CalendarConfig.HEADING_CUSTOM_END_DATE).toEqual("Please select a custom END date");
    });
});
