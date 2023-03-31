import React from "react";
import { mount } from "enzyme";

import LocalDateFilter from "../../../components/data_review/LocalDateFilter";
import DateOptions from "../../../components/data_review/DateOptions";

describe("LocalDateFilter component", () => {
    const props = {
        handleLocalFilterDateOptionSelect: jest.fn(),
        selectedDateOption: DateOptions.CREATED_AT,
    };

    const wrapper = mount(<LocalDateFilter {...props} />);

    it("renders correctly", () => {
        expect(wrapper.debug()).toMatchSnapshot();
    });
});
