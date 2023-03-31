import React from "react";
import { shallow } from "enzyme";
import moment from "moment";
import UpdateConfirmationModal from "../../../components/data_review/UpdateConfirmationModal";

describe("<UpdateConfirmationModal />", () => {
    const testProps = {
        isOpen: true,
        toggle: jest.fn(),
        responses: [{
            created_at: moment.utc("2015-03-04T00:00:00.000Z"),
            id: "1",
            idea: "test response for data aggregation pub/sub no. 3",
            isStarred: false,
            location: "Test Location",
            satisfied: true,
            servicePoint: "Test Point",
            serviceType: "Water",
            user: "email@test.com",
            ideaLanguage: "en"
        }],
        selectedForUpdate: {
            columnName: "createdAt",
            name: "",
            value: {},
        },
        updateResponses: jest.fn(),
    };

    const wrapper = shallow(<UpdateConfirmationModal {...testProps} />);

    it("renders correctly", () => {
        expect(wrapper.debug()).toMatchSnapshot();
    });

    it("should call updateResponses when submitting modal", async () => {
        await wrapper.find("Button").first().simulate("click");
        expect(testProps.updateResponses).toHaveBeenCalled();
    });
});
