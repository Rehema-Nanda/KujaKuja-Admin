import React from "react";
import { mount } from "enzyme";
import FeaturedIdeasEdit from "../../../components/featured_ideas/edit";
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

const locations = [
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
    new Location(
        null,
        {
            id: "1000000000",
            name: "Test Billion Id Location",
            geojson: null,
            lat: "0.00000000",
            lng: "0.00000000",
            created_at: null,
            updated_at: null,
            country_id: "1",
            country_name: "Afghanistan",
        },
    ),
];
LocationStore.mockImplementation(() => {
    return {
        locations: locations,
        locationsSortedByName: locations,
    };
});

const featuredIdeas = [
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
];

const mockFeaturedIdeaDelete = jest.fn();
featuredIdeas[0].delete = mockFeaturedIdeaDelete;

const mockUpdateFeaturedIdeaFromServer = jest.fn(() => {
    return featuredIdeas[0];
});

FeaturedIdeaStore.mockImplementation(() => {
    return {
        featuredIdeas: featuredIdeas,
        updateFeaturedIdeaFromServer: mockUpdateFeaturedIdeaFromServer,
    };
});

describe("FeaturedIdeasEdit component", () => {
    const testProps = {
        history: {
            push: jest.fn(),
        },
        match: {
            params: {
                id: 1,
            },
        },
    };
    const wrapper = mount(<FeaturedIdeasEdit {...testProps} />, {
        wrappingComponent: StoreProvider,
    });

    it("should render correctly", () => {
        expect(mockUpdateFeaturedIdeaFromServer).toHaveBeenCalled();
        wrapper.update();
        expect(wrapper.debug()).toMatchSnapshot();
    });

    it("should push history when cancelForm function is called", () => {
        const e = { preventDefault: jest.fn() };
        const cancelForm = jest.spyOn(wrapper.instance(), "cancelForm");
        cancelForm(e);
        expect(testProps.history.push).toHaveBeenCalledWith("/featured_ideas");
    });

    it("should change modal state when toggleDeleteConfirmationModal function is called", () => {
        const modalState = wrapper.instance().simpleState.isDeleteConfirmationModalOpen;
        const toggleDeleteConfirmationModal = jest.spyOn(wrapper.instance(), "toggleDeleteConfirmationModal");
        toggleDeleteConfirmationModal();
        expect(wrapper.instance().simpleState.isDeleteConfirmationModalOpen).toEqual(!modalState);
    });

    it("should call delete function on Location object and push history when delete function is called", async () => {
        const deleteFn = jest.spyOn(wrapper.instance(), "delete");
        await deleteFn();
        expect(mockFeaturedIdeaDelete).toHaveBeenCalled();
        expect(testProps.history.push).toHaveBeenCalledWith("/featured_ideas");
    });

    xit("should only show locations with ID less than 1 billion", () => {
        // data that is syndicated from other environments is currently kept separate by assigning each source
        // environment an ID offset that is some multiple of 1Bn - see syndication task handlers in API for more
        // this prevents users from attaching featured ideas to syndicated locations
        const optionLength = wrapper.find("option").length;
        expect(optionLength).toBe(2);
        expect(wrapper.find("option").first().text()).toBe("Please select");
        expect(wrapper.find("option").last().text()).toBe("Test Location");
    });
});
