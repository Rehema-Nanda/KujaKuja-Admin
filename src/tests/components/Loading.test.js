import React from "react";
import { shallow } from "enzyme";
import Loading from "../../components/Loading";

describe("<Loading />", () => {
    const wrapper = shallow(<Loading />);

    it("renders corrrectly", () => {
        expect(wrapper.debug()).toMatchSnapshot();
    });
});
