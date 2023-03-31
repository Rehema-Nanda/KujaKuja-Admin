import React from "react";
import { mount } from "enzyme";
import TagFilterEdit from "../../../components/tag_filters/edit";
import { StoreProvider } from "../../../StoreContext";
import TagFilterStore from "../../../stores/TagFilter/TagFilterStore";
import TagFilter from "../../../stores/TagFilter/TagFilter";

jest.mock("../../../stores/TagFilter/TagFilterStore");

const tagFilters = [
    new TagFilter(
        null,
        {
            id: "1",
            tag_text: "tagtest",
            search_text: "test|sample",
            start_date: "2020-01-01T00:00:00",
            end_date: "2020-02-01T00:00:00",
            created_at: "2020-01-05T12:13:14",
            locations: "Test Location",
        },
    ),
];

const mockTagFilterDelete = jest.fn();
tagFilters[0].delete = mockTagFilterDelete;

const mockUpdateTagFilterFromServer = jest.fn(() => {
    return tagFilters[0];
});

TagFilterStore.mockImplementation(() => {
    return {
        tagFilters: tagFilters,
        updateTagFromServer: mockUpdateTagFilterFromServer,
    };
});

describe("TagFilterEdit component", () => {
    const props = {
        history: {
            push: jest.fn(),
        },
        match: {
            params: {
                id: 1,
            },
        },
    };

    const wrapper = mount(<TagFilterEdit {...props} />, {
        wrappingComponent: StoreProvider,
    });

    it("should render correctly", () => {
        expect(mockUpdateTagFilterFromServer).toHaveBeenCalled();
        wrapper.update();
        expect(wrapper.debug()).toMatchSnapshot();
    });

    it("should change modal state when toggleDeleteConfirmationModal function is called", () => {
        const modalState = wrapper.instance().simpleState.isDeleteConfirmationModalOpen;
        const toggleDeleteConfirmationModal = jest.spyOn(wrapper.instance(), "toggleDeleteConfirmationModal");
        toggleDeleteConfirmationModal();
        expect(wrapper.instance().simpleState.isDeleteConfirmationModalOpen).toEqual(!modalState);
    });

    it("should redirect to list page upon element delete", async () => {
        const deleteFn = jest.spyOn(wrapper.instance(), "delete");
        await deleteFn();
        expect(mockTagFilterDelete).toHaveBeenCalled();
        expect(props.history.push).toHaveBeenCalledWith("/tag_filters");
    });
});
