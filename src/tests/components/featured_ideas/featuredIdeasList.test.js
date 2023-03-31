import React from "react";
import { mount } from "enzyme";
import FeaturedIdeasList from "../../../components/featured_ideas/list";
import { StoreProvider } from "../../../StoreContext";
import CountryStore from "../../../stores/Country/CountryStore";
import Country from "../../../stores/Country/Country";
import LocationStore from "../../../stores/Location/LocationStore";
import Location from "../../../stores/Location/Location";
import FeaturedIdeaStore from "../../../stores/FeaturedIdea/FeaturedIdeaStore";
import FeaturedIdea from "../../../stores/FeaturedIdea/FeaturedIdea";

jest.mock("../../../stores/Country/CountryStore");
jest.mock("../../../stores/Location/LocationStore");
jest.mock("../../../stores/FeaturedIdea/FeaturedIdeaStore");

CountryStore.mockImplementation(() => {
    return {
        countries: [
            new Country(
                null,
                {
                    id: "1",
                    enabled: false,
                    name: "Afghanistan",
                    iso_two_letter_code: "AF",
                    geojson: null,
                    lat: "0.00000000",
                    lng: "0.00000000",
                    created_at: null,
                    updated_at: null,
                },
            ),
        ],
    };
});

LocationStore.mockImplementation(() => {
    return {
        locations: [
            new Location(
                null,
                {
                    id: "1",
                    name: "Test Location",
                    geojson: null,
                    lat: "0.00000000",
                    lng: "0.00000000",
                    created_at: null,
                    updated_at: null,
                    country_id: "1",
                    country_name: "Afghanistan",
                },
            ),
        ],
    };
});

FeaturedIdeaStore.mockImplementation(() => {
    return {
        featuredIdeas: [
            new FeaturedIdea(
                null,
                {
                    id: "1",
                    idea: "Test Featured Idea",
                    created_at: null,
                    updated_at: null,
                    settlement_id: "1",
                    settlement_name: "Test Location",
                },
            ),
            new FeaturedIdea(
                null,
                {
                    id: "2",
                    idea: "Test Featured Idea 2",
                    created_at: null,
                    updated_at: null,
                    settlement_id: "1",
                    settlement_name: "Test Location",
                },
            ),
        ],
        count: 2,
    };
});

describe("FeaturedIdeasList component", () => {
    const testProps = {
        history: {
            push: jest.fn(),
        },
    };
    const wrapper = mount(<FeaturedIdeasList {...testProps} />, {
        wrappingComponent: StoreProvider,
    });

    it("should render correctly", () => {
        expect(wrapper.debug()).toMatchSnapshot();
    });

    it("should display featured ideas table", () => {
        expect(wrapper.find("table")).toHaveLength(1);
        expect(wrapper.find("th").at(3).text()).toBe("Results: 2");
    });

    it("should push history when edit button is clicked", () => {
        wrapper.find("button").first().simulate("click");
        expect(testProps.history.push).toHaveBeenCalledWith("/featured_ideas/1");
    });

    it("should push history when add button is clicked", () => {
        // note that we are not actually simulating a click, unlike above
        // this is because the button is only visible to admins
        const addElement = jest.spyOn(wrapper.instance(), "addElement");

        addElement();
        expect(testProps.history.push).toHaveBeenCalledWith("/featured_ideas/add");
    });

    it("should display a zero count on the featured ideas table", () => {
        FeaturedIdeaStore.mockImplementationOnce(() => {
            return {
                featuredIdeas: [],
                count: 0,
            };
        });

        const wrapper2 = mount(<FeaturedIdeasList {...testProps} />, {
            wrappingComponent: StoreProvider,
        });
        expect(wrapper2.find("th").at(3).text()).toBe("Results: 0");
    });
});
