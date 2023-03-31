import React from "react";
import PropTypes from "prop-types";
import { Container, Row, Col } from "reactstrap";
import { AvForm, AvField } from "availity-reactstrap-validation";

import {
    decorate, computed, observable, runInAction,
} from "mobx";
import { observer } from "mobx-react";
import { StoreContext } from "../../StoreContext";
import ServiceType from "../../stores/ServiceType/ServiceType";

import Banner from "../Banner";
import BtnRow from "../BtnRow";
import ConfirmationModal from "../ConfirmationModal";

import "../Dashboard.css";
import "../../index.css";
import "../Edit.css";

class ServiceTypesEdit extends React.PureComponent {
    simpleState = {
        serviceType: null,
        isDeleteConfirmationModalOpen: false,
    }

    async componentDidMount() {
        const { match, history } = this.props;
        const { serviceTypeStore } = this.context;

        if (match.params.id === "add") {
            runInAction(() => { 
                this.simpleState.serviceType = new ServiceType(serviceTypeStore);
            });
        }
        else {
            const serviceType = await serviceTypeStore.updateServiceTypeFromServer(match.params.id);

            if (!serviceType) {
                // invalid service type ID, go back to list page
                history.push("/service_types");
                return;
            }

            runInAction(() => {
                this.simpleState.serviceType = serviceType;
            });
        }
    }

    get elementAction() {
        const { match } = this.props;
        if (match.params.id === "add") {
            return "add";
        }
        return "update";
    }

    toggleDeleteConfirmationModal = () => {
        runInAction(() => {
            this.simpleState.isDeleteConfirmationModalOpen = !this.simpleState.isDeleteConfirmationModalOpen;
        });
    };

    delete = async () => {
        const { history } = this.props;
        await this.simpleState.serviceType.delete();
        history.push("/service_types");
    };

    handleFormSubmit = async (event, values) => {
        const { history } = this.props;
        const serviceType = values;

        runInAction(() => {
            this.simpleState.serviceType.updateFromJson(serviceType);
        });

        await this.simpleState.serviceType.save();

        history.push("/service_types");
    };

    cancelForm = (e) => {
        const { history } = this.props;
        e.preventDefault();
        history.push("/service_types");
    };

    render() {
        let buttonLabel;
        if (this.elementAction === "add") {
            buttonLabel = "Create";
        }
        else {
            buttonLabel = "Update";
        }

        return (
            <div className="page">

                <div className="title-background-parent">
                    <div className="title-background-shape" />
                </div>

                <Banner pageTitle="service type" elementAction={this.elementAction} buttonFunction={this.toggleDeleteConfirmationModal} />

                <ConfirmationModal
                    buttonFunction={this.delete}
                    toggle={this.toggleDeleteConfirmationModal}
                    isOpen={this.simpleState.isDeleteConfirmationModalOpen}
                />

                <Container>
                    <div className="white-page-bg">
                        <Row>
                            <Col lg={{ size: 10, offset: 1 }}>
                                <div>
                                    <AvForm onValidSubmit={this.handleFormSubmit}>
                                        <Row>
                                            <Col>
                                                <AvField
                                                    name="name"
                                                    label="Name"
                                                    required
                                                    value={
                                                        this.simpleState.serviceType
                                                        && this.simpleState.serviceType.name
                                                    }
                                                />
                                            </Col>
                                        </Row>

                                        <BtnRow buttonLabel={buttonLabel} cancelForm={this.cancelForm} />
                                    </AvForm>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </Container>

            </div>
        );
    }
}

decorate(ServiceTypesEdit, {
    simpleState: observable,
    elementAction: computed,
});

ServiceTypesEdit.contextType = StoreContext;

ServiceTypesEdit.propTypes = {
    match: PropTypes.objectOf(PropTypes.any).isRequired,
    history: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default observer(ServiceTypesEdit);
