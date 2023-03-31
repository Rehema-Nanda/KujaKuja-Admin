import React from "react";
import { mount } from "enzyme";
import MyDataView from "../../components/MyDataView";
import { StoreProvider } from "../../StoreContext";

describe("<MyDataView />", () => {
    const testProps = {
        location: {
            pathname: "/responses/34",
        },
        history: {
            replace: jest.fn(),
        },
    };
    const wrapper = mount(<MyDataView {...testProps} />, { wrappingComponent: StoreProvider });

    it("renders correctly", () => {
        expect(wrapper.debug()).toMatchSnapshot();
    });

    it("should call history.replace function when Responses List button is clicked", () => {
        wrapper.find("Button").simulate("click");
        expect(testProps.history.replace).toBeCalledWith("/responses");
    });
});
