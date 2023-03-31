import React from "react";
import PropTypes from "prop-types";
import { Container, Row, Col } from "reactstrap";
import { AvForm, AvField } from "availity-reactstrap-validation";

import mapboxgl from "mapbox-gl";
import MapboxDraw from "@mapbox/mapbox-gl-draw";

import _ from "lodash";

import {
    decorate, computed, observable, runInAction, reaction, comparer,
} from "mobx";
import { observer } from "mobx-react";
import { StoreContext } from "../../StoreContext";
import ServicePoint from "../../stores/ServicePoint/ServicePoint";

import Banner from "../Banner";
import BtnRow from "../BtnRow";
import ConfirmationModal from "../ConfirmationModal";

import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import "mapbox-gl/dist/mapbox-gl.css";
import "../Dashboard.css";
import "../../index.css";
import "../Edit.css";

import AppConfig from "../../AppConfig";

mapboxgl.accessToken = AppConfig.MAPBOX_GL_ACCESS_TOKEN;

class ServicePointsEdit extends React.PureComponent {
    simpleState = {
        servicePoint: null,
        isDeleteConfirmationModalOpen: false,
        errorMessage: null,
    };

    constructor(props) {
        super(props);

        this.mapContainer = React.createRef();

        this.centerPointChangeReactionDisposer = reaction(() => {
            return this.centerPoint;
        }, (centerPoint) => {
            this.removeAllPointFeatures();
            this.drawControl.add(centerPoint);
        }, {
            equals: (previous, next) => {
                if (!next) {
                    return true;
                }
                return !this.centerPointNeedsToBeUpdated(next);
            },
        });
    }

    async componentDidMount() {
        const { match, history } = this.props;
        const { servicePointStore } = this.context;

        if (match.params.id === "add") {
            runInAction(() => {
                this.simpleState.servicePoint = new ServicePoint(servicePointStore);
            });
        }
        else {
            const servicePoint = await servicePointStore.updateServicePointFromServer(match.params.id);

            if (!servicePoint) {
                // invalid service point ID, go back to list page
                history.push("/service_points");
                return;
            }

            runInAction(() => {
                this.simpleState.servicePoint = servicePoint;
            });
        }

        this.initMap();
    }

    componentWillUnmount() {
        this.centerPointChangeReactionDisposer();
    }

    get elementAction() {
        const { match } = this.props;
        if (match.params.id === "add") {
            return "add";
        }
        return "update";
    }

    get centerPoint() {
        if (!this.simpleState.servicePoint
            || !(this.simpleState.servicePoint.lng && this.simpleState.servicePoint.lat)) {
            return null;
        }
        return {
            type: "Point",
            coordinates: [parseFloat(this.simpleState.servicePoint.lng), parseFloat(this.simpleState.servicePoint.lat)],
        };
    }

    toggleDeleteConfirmationModal = () => {
        runInAction(() => {
            this.simpleState.isDeleteConfirmationModalOpen = !this.simpleState.isDeleteConfirmationModalOpen;
        });
    };

    delete = async () => {
        const { history } = this.props;
        await this.simpleState.servicePoint.delete();
        history.push("/service_points");
    };

    handleFormSubmit = async (event, values) => {
        const { history } = this.props;
        const { locationStore: { locations } } = this.context;
        const { serviceTypeStore: { serviceTypes } } = this.context;
        const servicePoint = values;

        runInAction(() => {
            this.simpleState.errorMessage = "";
        });

        // TODO: consider making this the responsibility of servicePoint.save() instead
        if (servicePoint.settlement_id) {
            const selectedLocation = locations.find((location) => {
                return location.id === servicePoint.settlement_id;
            });
            servicePoint.settlement_name = selectedLocation.name;
        }

        if (servicePoint.service_type_id) {
            const selectedServiceType = serviceTypes.find((serviceType) => {
                return serviceType.id === servicePoint.service_type_id;
            });
            servicePoint.service_type_name = selectedServiceType.name;
        }

        runInAction(() => {
            this.simpleState.servicePoint.updateFromJson(servicePoint);
        });

        await this.simpleState.servicePoint.save();

        history.push("/service_points");
    };

    cancelForm = (e) => {
        const { history } = this.props;
        e.preventDefault();
        history.push("/service_points");
    };

    onLatLngFieldChange = (e) => {
        runInAction(() => {
            this.simpleState.servicePoint[e.target.name] = e.target.value;
        });
    };

    centerPointNeedsToBeUpdated(centerPoint) {
        try {
            const { features } = this.drawControl.getAll();
            const pointFeatures = features.filter((feature) => {
                return feature.geometry.type === "Point";
            });

            return pointFeatures.length === 0
                || !_.isEqual(pointFeatures[0].geometry.coordinates, centerPoint.coordinates);
        }
        catch (e) {
            if (e instanceof TypeError) {
                // the call to getAll above fails with TypeError: "ctx.store is undefined" when the map has not
                // initialised
                return false;
            }
            throw e;
        }
    }

    removeAllPointFeatures(except = []) {
        const { features } = this.drawControl.getAll();
        const pointFeaturesToRemove = features.filter((feature) => {
            return feature.geometry.type === "Point" && !except.includes(feature.id);
        }).map((feature) => {
            return feature.id;
        });
        this.drawControl.delete(pointFeaturesToRemove);
    }

    handleDrawEvent(e, isCreate = false, isDelete = false) {
        const featureGeometry = e.features[0].geometry;
        if (featureGeometry.type === "Point") {
            if (isDelete) {
                runInAction(() => {
                    this.simpleState.servicePoint.lng = "";
                    this.simpleState.servicePoint.lat = "";
                });
            }
            else {
                if (isCreate) {
                    this.removeAllPointFeatures([e.features[0].id]);
                }

                const [lng, lat] = featureGeometry.coordinates;
                runInAction(() => {
                    this.simpleState.servicePoint.lng = lng;
                    this.simpleState.servicePoint.lat = lat;
                });
            }
        }
    }

    initMap() {
        this.drawControl = new MapboxDraw({
            displayControlsDefault: false,
            controls: {
                polygon: true,
                point: true,
                trash: true,
            },
        });

        this.map = new mapboxgl.Map({
            container: this.mapContainer.current,
            style: AppConfig.MAPBOX_GL_MAP_STYLE_URL,
            center: this.simpleState.servicePoint.lng && this.simpleState.servicePoint.lat
                ? [parseFloat(this.simpleState.servicePoint.lng), parseFloat(this.simpleState.servicePoint.lat)]
                : [0, 0],
            zoom: this.simpleState.servicePoint.lng && this.simpleState.servicePoint.lat ? 10 : 1,
        });
        this.map.addControl(this.drawControl, "top-right");

        this.map.on("load", () => {
            if (this.centerPoint) {
                this.drawControl.add(this.centerPoint);
            }
        });

        this.map.on("draw.create", (e) => {
            this.handleDrawEvent(e, true);
        });
        this.map.on("draw.update", (e) => {
            this.handleDrawEvent(e);
        });
        this.map.on("draw.delete", (e) => {
            this.handleDrawEvent(e, false, true);
        });
    }

    render() {
        const { locationStore: { locationsSortedByName } } = this.context;
        const { serviceTypeStore: { serviceTypesSortedByName } } = this.context;

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

                <Banner pageTitle="service point" elementAction={this.elementAction} buttonFunction={this.toggleDeleteConfirmationModal} />

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
                                                        this.simpleState.servicePoint
                                                        && this.simpleState.servicePoint.name
                                                    }
                                                />
                                                <AvField
                                                    type="select"
                                                    name="settlement_id"
                                                    label="Location"
                                                    required
                                                    value={
                                                        this.simpleState.servicePoint
                                                        && this.simpleState.servicePoint.settlementId
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
                                                    type="select"
                                                    name="service_type_id"
                                                    label="Service Type"
                                                    required
                                                    value={
                                                        this.simpleState.servicePoint
                                                        && this.simpleState.servicePoint.serviceTypeId
                                                    }
                                                >
                                                    <option value="">Please select</option>
                                                    {serviceTypesSortedByName.map((serviceType) => {
                                                        return (
                                                            <option key={serviceType.id} value={serviceType.id}>
                                                                {serviceType.name}
                                                            </option>
                                                        );
                                                    })}
                                                </AvField>
                                                <AvField
                                                    type="number"
                                                    name="lat"
                                                    label="Latitude"
                                                    required
                                                    validate={{ number: true }}
                                                    value={
                                                        this.simpleState.servicePoint
                                                        && this.simpleState.servicePoint.lat
                                                    }
                                                    onChange={this.onLatLngFieldChange}
                                                />
                                                <AvField
                                                    type="number"
                                                    name="lng"
                                                    label="Longitude"
                                                    required
                                                    validate={{ number: true }}
                                                    value={
                                                        this.simpleState.servicePoint
                                                        && this.simpleState.servicePoint.lng
                                                    }
                                                    onChange={this.onLatLngFieldChange}
                                                />
                                            </Col>
                                            <Col>
                                                <p className="small">
                                                    To add a center point, click the marker tool button and then the
                                                    map. Click a blue shape to make it editable (turns yellow). Click
                                                    away from a yellow shape to set it (turns blue).
                                                </p>
                                                <div className="data-map">
                                                    <div ref={this.mapContainer} />
                                                </div>
                                            </Col>
                                        </Row>

                                        <BtnRow buttonLabel={buttonLabel} cancelForm={this.cancelForm} />

                                        <p
                                            className="error-message"
                                            style={{ display: this.simpleState.errorMessage ? "block" : "none" }}
                                        >
                                            {this.simpleState.errorMessage}
                                        </p>
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
decorate(ServicePointsEdit, {
    simpleState: observable,
    elementAction: computed,
    centerPoint: computed({ equals: comparer.structural }),
});

ServicePointsEdit.contextType = StoreContext;

ServicePointsEdit.propTypes = {
    history: PropTypes.objectOf(PropTypes.any).isRequired,
    match: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default observer(ServicePointsEdit);
