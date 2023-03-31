import React from "react";
import PropTypes from "prop-types";
import { Container, Row, Col } from "reactstrap";
import { AvForm, AvField } from "availity-reactstrap-validation";

import {
    decorate, computed, observable, runInAction,
} from "mobx";
import { observer } from "mobx-react";
import { StoreContext } from "../../StoreContext";
import FeaturedIdea from "../../stores/FeaturedIdea/FeaturedIdea";

import Banner from "../Banner";
import BtnRow from "../BtnRow";
import ConfirmationModal from "../ConfirmationModal";

import "../Dashboard.css";
import "../../index.css";
import "../Edit.css";

class FeaturedIdeasEdit extends React.PureComponent {
    simpleState = {
        featuredIdea: null,
        isDeleteConfirmationModalOpen: false,
    }

    async componentDidMount() {
        const { match, history } = this.props;
        const { featuredIdeaStore } = this.context;

        if (match.params.id === "add") {
            runInAction(() => {
                this.simpleState.featuredIdea = new FeaturedIdea(featuredIdeaStore);
            });
        }
        else {
            const featuredIdea = await featuredIdeaStore.updateFeaturedIdeaFromServer(match.params.id);

            if (!featuredIdea) {
                // invalid featured idea ID, go back to list page
                history.push("/featured_ideas");
                return;
            }

            runInAction(() => {
                this.simpleState.featuredIdea = featuredIdea;
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
        await this.simpleState.featuredIdea.delete();
        history.push("/featured_ideas");
    }

    handleFormSubmit = async (event, values) => {
        const { history } = this.props;
        const { locationStore: { locations } } = this.context;
        const featuredIdea = values;

        // TODO: consider making this the responsibility of featuredIdea.save() instead
        if (featuredIdea.settlement_id) {
            const selectedLocation = locations.find((location) => {
                return location.id === featuredIdea.settlement_id;
            });
            featuredIdea.settlement_name = selectedLocation.name;
        }

        runInAction(() => {
            this.simpleState.featuredIdea.updateFromJson(featuredIdea);
        });

        await this.simpleState.featuredIdea.save();

        history.push("/featured_ideas");
    };

    cancelForm = (e) => {
        const { history } = this.props;
        e.preventDefault();
        history.push("/featured_ideas");
    };

    render() {
        const { locationStore: { locations } } = this.context;

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

                <Banner pageTitle="featured idea" elementAction={this.elementAction} buttonFunction={this.toggleDeleteConfirmationModal} />

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
                                                        this.simpleState.featuredIdea
                                                        && this.simpleState.featuredIdea.settlementId
                                                    }
                                                >
                                                    <option value="">Please select</option>
                                                    {locations.map((location) => {
                                                        return (
                                                            <option key={location.id} value={location.id}>
                                                                {location.name}
                                                            </option>
                                                        );
                                                    })}
                                                </AvField>
                                                <AvField
                                                    type="textarea"
                                                    name="idea"
                                                    label="Idea"
                                                    rows="5"
                                                    required
                                                    value={
                                                        this.simpleState.featuredIdea
                                                        && this.simpleState.featuredIdea.idea
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
decorate(FeaturedIdeasEdit, {
    simpleState: observable,
    elementAction: computed,
});

FeaturedIdeasEdit.contextType = StoreContext;

FeaturedIdeasEdit.propTypes = {
    match: PropTypes.objectOf(PropTypes.any).isRequired,
    history: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default observer(FeaturedIdeasEdit);
