import React from "react";
import { MemoryRouter } from "react-router-dom";
import { mount } from "enzyme";
import App from "./App";
import { StoreProvider } from "./StoreContext";

function WrapwithProviders({ children }) {
    return (
        <StoreProvider>
            <MemoryRouter>
                {children}
            </MemoryRouter>
        </StoreProvider>
    );
}

const wrapper = mount(<App />, {
    wrappingComponent: WrapwithProviders,
});

it("renders without crashing", () => {
    expect(wrapper.debug()).toMatchSnapshot();
});
