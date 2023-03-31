import React from "react";
import { mount } from "enzyme";
import TagFilterList from "../../../components/tag_filters/list";
import { StoreProvider } from "../../../StoreContext";
import TagFilterStore from "../../../stores/TagFilter/TagFilterStore";
import TagFilter from "../../../stores/TagFilter/TagFilter";

jest.mock("../../../stores/TagFilter/TagFilterStore");

TagFilterStore.mockImplementation(() => {
    return {
        tagFilters: [
            new TagFilter(
                null,
                {
                    tag_text: "testTag",
                    search_text: "test|sample|jest",
                    start_date: "2020-01-01 00:00:00",
                    end_date: "2020-01-09 23:59:59",
                    created_at: "2020-01-05 12:13:14",
                },
            ),
        ],
    };
});

describe("TagFilterList component", () => {
    const props = {
        history: {
            push: jest.fn(),
        },
    };

    const wrapper = mount(<TagFilterList {...props} />, {
        wrappingComponent: StoreProvider,
    });

    it("renders correctly", () => {
        expect(wrapper.debug()).toMatchSnapshot();
    });

    xit("should display tag filter table", () => {
        expect(wrapper.find("table")).toHaveLength(1);
        expect(wrapper.find("th").at(3).text()).toBe("Results: 1");
    });

    it("should push history when add button is clicked", () => {
        const addElement = jest.spyOn(wrapper.instance(), "addElement");

        addElement();
        expect(props.history.push).toHaveBeenCalledWith("/tag_filters/add");
    });

    xit("should display a zero count on the tag filter table", () => {
        TagFilterStore.mockImplementationOnce(() => {
            return {
                tagFilters: [],
            };
        });

        const wrapper2 = mount(<TagFilterList />, {
            wrappingComponent: StoreProvider,
        });
        expect(wrapper2.find("th").at(3).text()).toBe("Results: 0");
    });
});
