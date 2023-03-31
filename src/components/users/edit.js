import React from "react";
import PropTypes from "prop-types";
import { Container, Row, Col } from "reactstrap";
import { AvForm, AvField } from "availity-reactstrap-validation";

import bcryptjs from "bcryptjs";

import {
    decorate, computed, observable, runInAction,
} from "mobx";
import { observer } from "mobx-react";
import { StoreContext } from "../../StoreContext";
import User from "../../stores/User/User";

import Banner from "../Banner";
import BtnRow from "../BtnRow";
import ConfirmationModal from "../ConfirmationModal";

import "../Dashboard.css";
import "../../index.css";
import "../Edit.css";

class UsersEdit extends React.PureComponent {
    simpleState = {
        user: null,
        isDeleteConfirmationModalOpen: false,
    };

    async componentDidMount() {
        const { match, history } = this.props;
        const { userStore } = this.context;

        if (match.params.id === "add") {
            runInAction(() => {
                this.simpleState.user = new User(userStore);
            });
        }
        else {
            const user = await userStore.updateUserFromServer(match.params.id);

            if (!user) {
                // invalid user ID, go back to list page
                history.push("/users");
                return;
            }

            runInAction(() => {
                this.simpleState.user = user;
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
        await this.simpleState.user.delete();
        history.push("/users");
    };

    handleFormSubmit = async (event, values) => {
        const { history } = this.props;
        const { locationStore: { locations } } = this.context;
        const user = values;

        // TODO: consider making this the responsibility of user.save() instead
        if (user.settlement_id) {
            const selectedLocation = locations.find((location) => {
                return location.id === user.settlement_id;
            });
            user.settlement_name = selectedLocation.name;
        }

        if (user.password !== this.simpleState.user.encryptedPassword) {
            const saltRounds = 11;
            user.encrypted_password = await bcryptjs.hash(user.password, saltRounds);
        }
        delete user.password;
        delete user.password_confirmation;

        runInAction(() => {
            this.simpleState.user.updateFromJson(user);
        });

        await this.simpleState.user.save();

        history.push("/users");
    };

    cancelForm = (e) => {
        const { history } = this.props;
        e.preventDefault();
        history.push("/users");
    };

    render() {
        const { locationStore: { locationsSortedByName } } = this.context;

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

                <Banner pageTitle="team member" elementAction={this.elementAction} buttonFunction={this.toggleDeleteConfirmationModal} />

                <ConfirmationModal
                    buttonFunction={this.delete}
                    toggle={this.toggleDeleteConfirmationModal}
                    isOpen={this.simpleState.isDeleteConfirmationModalOpen}
                />

                <Container>
                    <div className="white-page-bg">
                        <Row>
                            <Col lg={{ size: 8, offset: 2 }}>
                                <div>
                                    <AvForm onValidSubmit={this.handleFormSubmit}>
                                        <Row>
                                            <Col>
                                                <AvField
                                                    type="select"
                                                    name="settlement_id"
                                                    label="Location"
                                                    required
                                                    value={
                                                        this.simpleState.user && this.simpleState.user.settlementId
                                                    }
                                                >
                                                    <option value="">Please select</option>
                                                    {locationsSortedByName.map((location) => {
                                                        return (
                                                            <option key={location.id} value={location.id}>
                                                                {location.name}
                                                            </option>
                                                        );
                                                    })}
                                                </AvField>
                                                <AvField
                                                    type="checkbox"
                                                    name="is_admin"
                                                    label="Admin Role"
                                                    checked={this.simpleState.user && this.simpleState.user.isAdmin}
                                                />
                                                <AvField
                                                    type="checkbox"
                                                    name="is_survey"
                                                    label="Survey Role"
                                                    checked={this.simpleState.user && this.simpleState.user.isSurvey}
                                                />
                                                <AvField
                                                    type="checkbox"
                                                    name="is_service_provider"
                                                    label="Service Provider Role"
                                                    checked={
                                                        this.simpleState.user && this.simpleState.user.isServiceProvider
                                                    }
                                                />
                                                <AvField
                                                    type="email"
                                                    name="email"
                                                    label="Email"
                                                    required
                                                    validate={{ email: true }}
                                                    value={this.simpleState.user && this.simpleState.user.email}
                                                />
                                                <AvField
                                                    type="password"
                                                    name="password"
                                                    label="Password"
                                                    required
                                                    value={
                                                        this.simpleState.user && this.simpleState.user.encryptedPassword
                                                    }
                                                />
                                                <AvField
                                                    type="password"
                                                    name="password_confirmation"
                                                    label="Password Confirmation"
                                                    required
                                                    validate={{ match: { value: "password" } }}
                                                    value={
                                                        this.simpleState.user && this.simpleState.user.encryptedPassword
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
decorate(UsersEdit, {
    simpleState: observable,
    elementAction: computed,
});

UsersEdit.contextType = StoreContext;

UsersEdit.propTypes = {
    history: PropTypes.objectOf(PropTypes.any).isRequired,
    match: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default observer(UsersEdit);
