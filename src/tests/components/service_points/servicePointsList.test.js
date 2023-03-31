import React from "react";
import { mount } from "enzyme";
import ServicePointsList from "../../../components/service_points/list";
import { StoreProvider } from "../../../StoreContext";
import CountryStore from "../../../stores/Country/CountryStore";
import Country from "../../../stores/Country/Country";
import LocationStore from "../../../stores/Location/LocationStore";
import Location from "../../../stores/Location/Location";
import ServiceTypeStore from "../../../stores/ServiceType/ServiceTypeStore";
import ServiceType from "../../../stores/ServiceType/ServiceType";
import ServicePointStore from "../../../stores/ServicePoint/ServicePointStore";
import ServicePoint from "../../../stores/ServicePoint/ServicePoint";

jest.mock("../../../stores/Country/CountryStore");
jest.mock("../../../stores/Location/LocationStore");
jest.mock("../../../stores/ServiceType/ServiceTypeStore");
jest.mock("../../../stores/ServicePoint/ServicePointStore");

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

ServiceTypeStore.mockImplementation(() => {
    return {
        serviceTypes: [
            new ServiceType(
                null,
                {
                    id: "1",
                    name: "Test Service Type",
                    created_at: null,
                    updated_at: null,
                },
            ),
        ],
    };
});

ServicePointStore.mockImplementation(() => {
    return {
        servicePoints: [
            new ServicePoint(
                null,
                {
                    id: "1",
                    name: "Test Service Point",
                    lat: "0.00000000",
                    lng: "0.00000000",
                    created_at: null,
                    updated_at: null,
                    service_type_id: "1",
                    service_type_name: "Test Service Type",
                    settlement_id: "1",
                    settlement_name: "Test Location",
                },
            ),
            new ServicePoint(
                null,
                {
                    id: "2",
                    name: "Test Service Point 2",
                    lat: "0.00000000",
                    lng: "0.00000000",
                    created_at: null,
                    updated_at: null,
                    service_type_id: "1",
                    service_type_name: "Test Service Type",
                    settlement_id: "1",
                    settlement_name: "Test Location",
                },
            ),
        ],
        count: 2,
    };
});

describe("ServicePointsList component", () => {
    const testProps = {
        history: {
            push: jest.fn(),
        },
    };
    const wrapper = mount(<ServicePointsList {...testProps} />, {
        wrappingComponent: StoreProvider,
    });

    it("should render correctly", () => {
        expect(wrapper.debug()).toMatchSnapshot();
    });

    it("should display service points table", () => {
        expect(wrapper.find("table")).toHaveLength(1);
        expect(wrapper.find("th").at(3).text()).toBe("Results: 2");
    });

    it("should push history when edit button is clicked", () => {
        wrapper.find("button").first().simulate("click");
        expect(testProps.history.push).toHaveBeenCalledWith("/service_points/1");
    });

    it("should push history when add button is clicked", () => {
        // note that we are not actually simulating a click, unlike above
        // this is because the button is only visible to admins
        const addElement = jest.spyOn(wrapper.instance(), "addElement");

        addElement();
        expect(testProps.history.push).toHaveBeenCalledWith("/service_points/add");
    });

    it("should display a zero count on the service points table", () => {
        ServicePointStore.mockImplementationOnce(() => {
            return {
                servicePoints: [],
                count: 0,
            };
        });

        const wrapper2 = mount(<ServicePointsList {...testProps} />, {
            wrappingComponent: StoreProvider,
        });
        expect(wrapper2.find("th").at(3).text()).toBe("Results: 0");
    });
});
