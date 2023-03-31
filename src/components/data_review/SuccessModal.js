import React from "react";
import { Modal, ModalBody, ModalHeader } from "reactstrap";

const checkIcon = require("../../img/icons/check_mark.svg");

const SuccessModal = ({
    isOpen, fixedDataName, numberOfFixedResponses, toggle,
}) => {
    return (
        <Modal
            isOpen={isOpen}
            size="lg"
            className="daily-review-page"
            style={{ maxWidth: "68.5rem" }}
        >
            <ModalHeader toggle={toggle}>Success!</ModalHeader>
            <ModalBody>
                <div>
                    <img alt="" src={checkIcon} className="success-modal-check-mark" />
                    <p className="success-modal-check-text">
                        {fixedDataName}
                        {" "}
                        has been fixed on
                        {" "}
                        {numberOfFixedResponses}
                        {" "}
                        response(s)
                    </p>
                </div>
            </ModalBody>
        </Modal>
    );
};

export default SuccessModal;
