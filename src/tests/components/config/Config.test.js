import React from "react";
import { mount } from "enzyme";
import ConfigComponent from "../../../components/config/Config";
import { StoreProvider } from "../../../StoreContext";
import ConfigStore from "../../../stores/Config/ConfigStore";
import Config from "../../../stores/Config/Config";


jest.mock("../../../stores/Config/ConfigStore");

const config = [
    new Config(
        null,
        {
            favicon_url: null,
            highlight_colour: "#FFF01",
            logo_url: null,
            title_text: "test title",
            logo_file: null,
            favicon_file: null,
        },
    ),
];
ConfigStore.mockImplementation(() => {
    return {
        siteHeader: config,
    };
});

describe("#config", () => {
    const wrapper = mount(<ConfigComponent />, { wrappingComponent: StoreProvider });

    it("should render correctly", () => {
        expect(wrapper.debug()).toMatchSnapshot();
    });

    it("should toggle refreshHeaderLogo state when updateHeaderFile function is called", () => {
        wrapper.instance().simpleState.siteHeader = {};
        const updateHeaderFile = jest.spyOn(wrapper.instance(), "updateHeaderFile");
        const refreshHeaderLogoState = wrapper.state().refreshHeaderLogo;
        updateHeaderFile();
        expect(wrapper.state().refreshHeaderLogo).toBe(!refreshHeaderLogoState);
    });

    it("should toggle refreshFaviconImage state when updateFaviconFile function is called", () => {
        wrapper.instance().simpleState.siteHeader = {};
        const updateFaviconFile = jest.spyOn(wrapper.instance(), "updateFaviconFile");
        const refreshFaviconImage = wrapper.state().refreshFaviconImage;
        updateFaviconFile();
        expect(wrapper.state().refreshFaviconImage).toBe(!refreshFaviconImage);
    });

    it("should set highlight color when handleHeaderHighlightColorChange function is called", () => {
        wrapper.instance().simpleState.siteHeader = {};
        const color = {
            hex: "#abc",
        };
        const handleHeaderHighlightColorChange = jest.spyOn(wrapper.instance(), "handleHeaderHighlightColorChange");
        handleHeaderHighlightColorChange(color);
        expect(wrapper.instance().simpleState.siteHeader.highlightColour).toBe(color.hex);
    });

    it("should set title text when handleTitleTextChange function is called", () => {
        wrapper.instance().simpleState.siteHeader = {};
        const event = {
            target: {
                value: "testText",
            },
        };
        const handleTitleTextChange = jest.spyOn(wrapper.instance(), "handleTitleTextChange");
        handleTitleTextChange(event);
        expect(wrapper.instance().simpleState.siteHeader.titleText).toBe(event.target.value);
    });
});
