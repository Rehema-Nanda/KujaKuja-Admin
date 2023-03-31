import React from "react";
import { shallow } from "enzyme";
import SuccessModal from "../../../components/data_review/SuccessModal";

describe("success modal", () => {
    it("renders correctly", () => {
        const tesProps = {
            toggle: jest.fn(),
            isOpen: true,
            fixedDataName: "Service Point",
            numberOfFixedResponses: 3,
        };
        const wrapper = shallow(<SuccessModal {...tesProps} />);

        expect(wrapper.debug()).toMatchSnapshot();
    });
});
