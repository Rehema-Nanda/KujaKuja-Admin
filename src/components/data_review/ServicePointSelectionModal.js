import React from "react";
import {
    Button, Modal, ModalHeader, ModalBody, Row, Col, Input,
} from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes from "prop-types";

const ServicePointSelectionModal = ({
    isOpen, toggle, selectedForUpdate, handleServicePointSelect, responsesToUpdate,
    servicePointSearchTerm, servicePointsToDisplay, handleServicePointSearch,
}) => {
    let servicePointname;
    if (responsesToUpdate.length > 0) {
        servicePointname = responsesToUpdate[0].servicePoint;
    }

    return (
        <Modal isOpen={isOpen} toggle={toggle} size="lg">
            <ModalHeader toggle={toggle}>
                Please select a new Service Point
            </ModalHeader>
            <ModalBody>
                <Row>
                    <Col xs="6">
                        From:
                        <div className="sp-selection-modal-container-from">
                            <p>{servicePointname}</p>
                        </div>
                    </Col>
                    <Col xs="6">
                        <div>
                            To:
                            <div className="sp-search-container">
                                <div className="map-controls-search-icon"><FontAwesomeIcon icon="search" /></div>
                                <Input
                                    type="text"
                                    onChange={handleServicePointSearch}
                                    id="search"
                                    className="map-controls-search"
                                    placeholder="Search"
                                    defaultValue={servicePointSearchTerm}
                                />
                            </div>
                            <div className="sp-selection-modal-container-to">
                                <div className="sp-options">
                                    {servicePointsToDisplay.map((item) => {
                                        return (
                                            <Button
                                                onClick={() => handleServicePointSelect(item.id)}
                                                className="sp-selection-modal-button"
                                                key={item.id}
                                                value={item.id}
                                                active={item.name === selectedForUpdate.name}
                                            >
                                                <div style={{ marginRight: "5%" }}>
                                                    {`${item.name} - `}
                                                    <em>{item.settlementName}</em>
                                                </div>
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

ServicePointSelectionModal.propTypes = {
    servicePointsToDisplay: PropTypes.arrayOf(PropTypes.object),
    isOpen: PropTypes.bool,
    handleServicePointSelect: PropTypes.func.isRequired,
    responsesToUpdate: PropTypes.arrayOf(PropTypes.object),
    toggle: PropTypes.func.isRequired,
    selectedForUpdate: PropTypes.objectOf(PropTypes.any),
    servicePointSearchTerm: PropTypes.string,
    handleServicePointSearch: PropTypes.func.isRequired,
};

ServicePointSelectionModal.defaultProps = {
    servicePointsToDisplay: [],
    isOpen: false,
    responsesToUpdate: [],
    selectedForUpdate: {},
    servicePointSearchTerm: "",
};

export default ServicePointSelectionModal;
