import React, { Component } from "react";
import {
    Badge, Container, Modal, ModalBody, ModalHeader, ModalFooter, Button,
} from "reactstrap";
import moment from "moment";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes from "prop-types";

const satisfiedFacePath = require("../../img/face_satisfied.svg");
const unsatisfiedFacePath = require("../../img/face_unsatisfied.svg");

class UpdateConfirmationModal extends Component {
    getModalHeader = (columnName) => {
        const { goBack } = this.props;
        let header;

        if (columnName === "createdAt") {
            header = "Confirm Date Fix";
        }

        if (columnName === "servicePoint") {
            header = (
                <div className="confirmation-header">
                    <FontAwesomeIcon icon="chevron-left" onClick={() => goBack("servicePoint")} className="icon" />
                    {" "}
                    Confirm Service Point Fix
                </div>
            );
        }
        if (columnName === "ideaLanguage") {
            header = (
                <div className="confirmation-header">
                    <FontAwesomeIcon icon="chevron-left" onClick={() => goBack("ideaLanguage")} className="icon" />
                    {" "}
                    Confirm Idea Language Fix
                </div>
            );
        }

        return header;
    }

    render() {
        const {
            isOpen, toggle, responses, selectedForUpdate, updateResponses, isLoading,
        } = this.props;

        const columns = [
            {
                dataField: "satisfied",
                text: "",
                formatExtraData: [satisfiedFacePath, unsatisfiedFacePath],
                formatter: (cellContent, row, rowIdx, formatExtraData) => {
                    const [satisfiedFacePath, unsatisfiedFacePath] = formatExtraData;
                    return (
                        row.satisfied
                            ? <img width="24" src={satisfiedFacePath} alt="satisfied" />
                            : <img width="24" src={unsatisfiedFacePath} alt="unsatisfied" />
                    );
                },
                headerClasses: "col-satisfied",
                classes: "col-satisfied",
            },
            {
                dataField: "isStarred",
                text: "Fresh Idea",
                formatter: (cellContent, row) => {
                    return (
                        row.is_starred ? <Badge color="primary">Yes</Badge> : <Badge color="secondary">No</Badge>
                    );
                },
                headerClasses: "col-is-starred",
                classes: "col-is-starred",
            },
            {
                dataField: "serviceType",
                text: "Service Type",
                headerClasses: "col-service-type",
                classes: "col-service-type",
            },
            {
                dataField: "location",
                text: "Location",
                headerClasses: "col-location",
                classes: "col-location",
            },
            {
                dataField: "servicePoint",
                text: "Current Service Point",
                headerClasses: "col-service-point",
                classes: "col-service-point",
            },
            {
                dataField: "user",
                text: "User",
                formatter: (cellContent) => {
                    const parts = cellContent.split("@", 2);
                    if (parts.length === 1) {
                        return (parts);
                    }
                    return (
                        <span>
                            {parts[0]}
                            <br />
                            @
                            {parts[1]}
                        </span>
                    );
                },
                headerClasses: "col-user",
                classes: "col-user",
                title: true,
            },
            {
                dataField: "createdAt",
                text: "Current Created At",
                formatter: (cellContent) => {
                    const dt = moment(cellContent);
                    return (
                        <div>
                            <span>{dt.format("MMM D")}</span>
                            <br />
                            <span className="reset-styles">{dt.format("HH:mm")}</span>
                        </div>
                    );
                },
                headerClasses: "col-created-at",
                classes: "col-created-at",
            },
            {
                dataField: "uploadedAt",
                text: "Uploaded At",
                formatter: (cellContent) => {
                    const dt = moment(cellContent);
                    return (
                        <span>
                            {dt.format("MMM D")}
                            <br />
                            {dt.format("HH:mm")}
                        </span>
                    );
                },
                headerClasses: "col-created-at",
                classes: "col-created-at",
            },
            {
                dataField: "idea",
                text: "Idea",
                headerClasses: "col-idea",
                classes: "col-idea",
            },
            {
                dataField: "ideaLanguage",
                text: "Idea Language",
                headerClasses: "col-idea-lang",
                classes: "col-idea-lang",
            },
        ];
        if (selectedForUpdate.columnName) {
            const updatedColumn = columns.find((column) => {
                return column.dataField === selectedForUpdate.columnName;
            });
            updatedColumn.classes = `${updatedColumn.classes} old-service-point-text`;

            const newUpdateColumn = {
                dataField: "df1",
                isDummyField: true,
                text: `New ${selectedForUpdate.columnName.split("_").join(" ")}`,
                formatter: () => {
                    if (selectedForUpdate.columnName === "createdAt") {
                        const newCreatedAtDate = selectedForUpdate.name;
                        return (
                            <span>{newCreatedAtDate.format("MMM D")}</span>
                        );
                    }

                    return (
                        <span>{selectedForUpdate.name}</span>
                    );
                },
                headerClasses: `col-${selectedForUpdate.columnName.split("_").join("-")} capitalize`,
                classes: `col-${selectedForUpdate.columnName.split("_").join("-")} new-service-point-text`,
            };
            if (selectedForUpdate.columnName === "createdAt") {
                columns.splice(7, 0, newUpdateColumn);
            }
            if (selectedForUpdate.columnName === "servicePoint") {
                columns.splice(5, 0, newUpdateColumn);
            }
            if (selectedForUpdate.columnName === "ideaLanguage") {
                columns.splice(10, 0, newUpdateColumn);
            }
        }

        return (
            <Modal
                isOpen={isOpen}
                toggle={toggle}
                size="lg"
                className="daily-review-page"
                style={{ maxWidth: "68.5rem" }}
            >
                <ModalHeader toggle={toggle}>{this.getModalHeader(selectedForUpdate.columnName)}</ModalHeader>
                <ModalBody className="confirmation-modal">
                    <ToolkitProvider
                        keyField="id"
                        data={responses}
                        columns={columns}
                        bootstrap4
                    >
                        {
                            (props) => {
                                return (
                                    <div className="page">
                                        <Container fluid className="desktop-non-fluid">
                                            {responses
                                            && (
                                                <BootstrapTable
                                                    {...props.baseProps}
                                                    hover
                                                    striped
                                                    remote
                                                    bordered={false}
                                                />
                                            )}
                                        </Container>
                                    </div>
                                );
                            }
                        }
                    </ToolkitProvider>
                </ModalBody>
                <ModalFooter className="confirmation-modal-footer">
                    <Button color="primary" className="primary" block onClick={updateResponses}>
                        {isLoading ? <div className="loader" /> : `Fix ${responses.length} response(s)`}
                    </Button>
                </ModalFooter>
            </Modal>
        );
    }
}
UpdateConfirmationModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    toggle: PropTypes.func.isRequired,
    responses: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)),
    selectedForUpdate: PropTypes.objectOf(PropTypes.any),
    updateResponses: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
    isLoading: PropTypes.bool,
};
UpdateConfirmationModal.defaultProps = {
    responses: [],
    selectedForUpdate: {},
    isLoading: false,
};
export default UpdateConfirmationModal;
