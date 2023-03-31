import React from "react";
import { mount } from "enzyme";
import CountriesList from "../../../components/countries/list";
import { StoreProvider } from "../../../StoreContext";
import CountryStore from "../../../stores/Country/CountryStore";
import Country from "../../../stores/Country/Country";

jest.mock("../../../stores/Country/CountryStore");

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
            new Country(
                null,
                {
                    id: "2",
                    enabled: false,
                    name: "Albania",
                    iso_two_letter_code: "AL",
                    geojson: null,
                    lat: "0.00000000",
                    lng: "0.00000000",
                    created_at: null,
                    updated_at: null,
                },
            ),
        ],
        count: 2,
    };
});

describe("CountriesList component", () => {
    const testProps = {
        history: {
            push: jest.fn(),
        },
    };
    const wrapper = mount(<CountriesList {...testProps} />, {
        wrappingComponent: StoreProvider,
    });

    it("should render correctly", () => {
        expect(wrapper.debug()).toMatchSnapshot();
    });

    it("should display countries table", () => {
        expect(wrapper.find("table")).toHaveLength(1);
        expect(wrapper.find("th").at(3).text()).toBe("Results: 2");
    });

    it("should push history when edit button is clicked", () => {
        wrapper.find("button").first().simulate("click");
        expect(testProps.history.push).toHaveBeenCalledWith("/countries/1");
    });

    it("should push history when add button is clicked", () => {
        // note that we are not actually simulating a click, unlike above
        // this is because the button is only visible to admins
        const addElement = jest.spyOn(wrapper.instance(), "addElement");

        addElement();
        expect(testProps.history.push).toHaveBeenCalledWith("/countries/add");
    });

    it("should display a zero count on the countries table", () => {
        CountryStore.mockImplementationOnce(() => {
            return {
                countries: [],
                count: 0,
            };
        });

        const wrapper2 = mount(<CountriesList {...testProps} />, {
            wrappingComponent: StoreProvider,
        });
        expect(wrapper2.find("th").at(3).text()).toBe("Results: 0");
    });
});
