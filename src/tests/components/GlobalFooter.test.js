import React from "react";
import { shallow } from "enzyme";
import GlobalFooter from "../../components/GlobalFooter";

window.open = jest.fn();

describe("<GlobalFooter />", () => {
    const wrapper = shallow(<GlobalFooter />);

    it("renders correctly", () => {
        expect(wrapper.debug()).toMatchSnapshot();
    });

    it("redirects to social media links when icons are clicked", () => {
        wrapper.find("div.social-instagram").simulate("click");
        wrapper.find("div.social-fb").simulate("click");
        wrapper.find("div.social-twitter").simulate("click");
        wrapper.find("div.social-medium").simulate("click");
        expect(window.open).toHaveBeenCalledTimes(4);
    });
});
