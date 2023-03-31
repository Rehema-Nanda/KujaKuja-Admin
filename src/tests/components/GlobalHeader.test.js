import React from "react";
import { mount } from "enzyme";
import { MemoryRouter } from "react-router-dom";
import GlobalHeader from "../../components/GlobalHeader";
import { StoreProvider } from "../../StoreContext";

describe("<GlobalHeader />", () => {
    function WrapwithProviders({ children }) {
        return (
            <StoreProvider>
                <MemoryRouter>
                    {children}
                </MemoryRouter>
            </StoreProvider>
        );
    }
    const wrapper = mount(<GlobalHeader />, { wrappingComponent: WrapwithProviders });

    it("renders correctly", () => {
        expect(wrapper.debug()).toMatchSnapshot();
    });

    it.skip("should toggle isOpen state when navbar toggler is clicked", () => {
        wrapper.instance().isUserLoggedInNoRedirect = jest.fn(() => {
            return true;
        });
        wrapper.instance().forceUpdate();

        global.innerWidth = 500; // mock window innerwidth

        const { isOpen } = wrapper.state();
        wrapper.find("NavbarToggler").simulate("click");
        expect(wrapper.state().isOpen).toEqual(!isOpen);
    });

    it("should toggle modal state when logout toggle function is called", () => {
        const { isLogoutConfirmationModalOpen } = wrapper.state();
        const toggleLogoutConfirmationModal = jest.spyOn(wrapper.instance(), "toggleLogoutConfirmationModal");
        toggleLogoutConfirmationModal();
        expect(wrapper.state().isLogoutConfirmationModalOpen).toEqual(!isLogoutConfirmationModalOpen);
    });
});
