import React from "react";
import { mount, shallow } from "enzyme";
import { StoreProvider } from "../../StoreContext";
import Banner from "../../components/Banner";

describe("Banner component", () => {
    const testProps = {
        elementAction: "list",
        pageTitle: "Countries",
        buttonFunction: jest.fn(),
    };
    const wrapper = mount(<Banner {...testProps} />, { wrappingComponent: StoreProvider }); // eslint-disable-line react/jsx-props-no-spreading

    it("renders correctly", () => {
        expect(wrapper.debug()).toMatchSnapshot();
    });

    // TODO: get these tests to work again
    it.skip("should display delete text on button", () => {
        const newProps = {
            ...testProps,
            elementAction: "update",
        };
        const tree = shallow(<Banner {...newProps} />); // eslint-disable-line react/jsx-props-no-spreading
        expect(tree.find("Button").text()).toBe("Delete Country");
    });

    it.skip("should execute function on button click", () => {
        wrapper.find("Button").simulate("click");
        expect(testProps.buttonFunction).toHaveBeenCalled();
    });
});
