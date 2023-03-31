import React from "react";
import { shallow } from "enzyme";
import GlobalFilterServices from "../../../components/globalfilter/GlobalFilterServices";

describe("<GlobalFilterServices />", () => {
    const testProps = {
        serviceTypes: [{ name: "test", id: "1" }],
    };
    const wrapper = shallow(<GlobalFilterServices {...testProps} />);

    it("renders correctly", () => {
        expect(wrapper.debug()).toMatchSnapshot();
    });
});
