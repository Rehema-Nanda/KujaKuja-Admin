import React from "react";
import { mount } from "enzyme";
import Login from "../../components/Login";

describe("Login component", () => {
    const wrapper = mount(<Login />);

    it("renders correctly", () => {
        expect(wrapper.debug()).toMatchSnapshot();
    });

    it("should handle change on input fields", () => {
        wrapper.find("input").first().simulate(
            "change",
            {
                target: {
                    value: "testUser",
                    name: "username",
                },
            },
        );
        wrapper.find("input").last().simulate(
            "change",
            {
                target: {
                    value: "123",
                    name: "password",
                },
            },
        );

        expect(wrapper.state().username).toBe("testUser");
        expect(wrapper.state().password).toBe("123");
    });

    it.skip("should submit form", () => {
        wrapper.find("form").simulate("submit");
        expect(wrapper.state().loading).toBeTruthy();
    });
});
