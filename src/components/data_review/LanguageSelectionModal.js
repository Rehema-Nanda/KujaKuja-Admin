import React from "react";
import {
    Button, Modal, ModalHeader, ModalBody, Row, Col,
} from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes from "prop-types";

import LanguageOptions from "./LanguageOptions";

const LanguageSelectionModal = ({
    isOpen, toggle, selectedForUpdate, handleLanguageSelect, responsesToUpdate,
}) => {
    let language;
    if (responsesToUpdate.length > 0) {
        const langObject = LanguageOptions.find((lng) => lng.value === responsesToUpdate[0].ideaLanguage);
        language = langObject.name;
    }

    return (
        <Modal isOpen={isOpen} toggle={toggle} size="lg">
            <ModalHeader toggle={toggle}>
                Please select a new Language
            </ModalHeader>
            <ModalBody>
                <Row>
                    <Col xs="6">
                        From:
                        <div className="sp-selection-modal-container-from" style={{ height: "200px" }}>
                            <p>{language}</p>
                        </div>
                    </Col>
                    <Col xs="6">
                        <div>
                            To:
                            <div className="lng-selection-modal-container-to">
                                <div className="lng-options">
                                    {LanguageOptions.map((lng) => {
                                        return (
                                            <Button
                                                onClick={() => handleLanguageSelect(lng)}
                                                className="sp-selection-modal-button"
                                                key={lng.value}
                                                value={lng.value}
                                                active={lng.value === selectedForUpdate.ideaLanguage}
                                            >
                                                <span style={{ marginRight: "5%" }}>{lng.name}</span>
                                                <div className="sp-option-caret">
                                                    <FontAwesomeIcon icon="chevron-right" />
                                                </div>
                                            </Button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
            </ModalBody>
        </Modal>
    );
};

LanguageSelectionModal.propTypes = {
    isOpen: PropTypes.bool,
    handleLanguageSelect: PropTypes.func.isRequired,
    responsesToUpdate: PropTypes.arrayOf(PropTypes.object),
    toggle: PropTypes.func.isRequired,
    selectedForUpdate: PropTypes.objectOf(PropTypes.any),
};

LanguageSelectionModal.defaultProps = {
    isOpen: false,
    responsesToUpdate: [],
    selectedForUpdate: {},
};

export default LanguageSelectionModal;
