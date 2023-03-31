import React from "react";
import PropTypes from "prop-types";
import { Container, Row, Col } from "reactstrap";
import { AvForm, AvField } from "availity-reactstrap-validation";

import mapboxgl from "mapbox-gl";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import bbox from "@turf/bbox";

import _ from "lodash";

import {
    decorate, computed, observable, runInAction, reaction, comparer,
} from "mobx";
import { observer } from "mobx-react";
import { StoreContext } from "../../StoreContext";
import Country from "../../stores/Country/Country";

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

class CountriesEdit extends React.PureComponent {
    simpleState = {
        country: null,
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
        const { countryStore } = this.context;

        if (match.params.id === "add") {
            runInAction(() => {
                this.simpleState.country = new Country(countryStore);
            });
        }
        else {
            const country = await countryStore.updateCountryFromServer(match.params.id);

            if (!country) {
                // invalid country ID, go back to list page
                history.push("/countries");
                return;
            }

            runInAction(() => {
                this.simpleState.country = country;
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
        if (!this.simpleState.country || !(this.simpleState.country.lng && this.simpleState.country.lat)) {
            return null;
        }
        return {
            type: "Point",
            coordinates: [parseFloat(this.simpleState.country.lng), parseFloat(this.simpleState.country.lat)],
        };
    }

    toggleDeleteConfirmationModal = () => {
        runInAction(() => {
            this.simpleState.isDeleteConfirmationModalOpen = !this.simpleState.isDeleteConfirmationModalOpen;
        });
    };

    delete = async () => {
        const { history } = this.props;
        await this.simpleState.country.delete();
        history.push("/countries");
    };

    handleFormSubmit = async (event, values) => {
        const { history } = this.props;
        const country = values;

        runInAction(() => {
            this.simpleState.errorMessage = "";
        });

        const { features } = this.drawControl.getAll();
        const polygonFeatures = features.filter((feature) => {
            return feature.geometry.type === "Polygon";
        });

        if (polygonFeatures.length !== 1) {
            runInAction(() => {
                this.simpleState.errorMessage = "Please add an outline of this country on the map, as per the instructions above";
            });
            return;
        }
        country.geojson = polygonFeatures[0]; // eslint-disable-line prefer-destructuring

        runInAction(() => {
            this.simpleState.country.updateFromJson(country);
        });

        await this.simpleState.country.save();

        history.push("/countries");
    };

    cancelForm = (e) => {
        const { history } = this.props;
        e.preventDefault();
        history.push("/countries");
    };

    onLatLngFieldChange = (e) => {
        runInAction(() => {
            this.simpleState.country[e.target.name] = e.target.value;
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
                    this.simpleState.country.lng = "";
                    this.simpleState.country.lat = "";
                });
            }
            else {
                if (isCreate) {
                    this.removeAllPointFeatures([e.features[0].id]);
                }

                const [lng, lat] = featureGeometry.coordinates;
                runInAction(() => {
                    this.simpleState.country.lng = lng;
                    this.simpleState.country.lat = lat;
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
            center: this.simpleState.country.lng && this.simpleState.country.lat
                ? [parseFloat(this.simpleState.country.lng), parseFloat(this.simpleState.country.lat)]
                : [0, 0],
            zoom: 1,
        });
        this.map.addControl(this.drawControl, "top-right");

        this.map.on("load", () => {
            if (this.centerPoint) {
                this.drawControl.add(this.centerPoint);
            }

            if (this.simpleState.country.geojson) {
                this.drawControl.add(this.simpleState.country.geojson);
                this.map.fitBounds(bbox(this.simpleState.country.geojson), { padding: 50 });
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

                <Banner pageTitle="country" elementAction={this.elementAction} buttonFunction={this.toggleDeleteConfirmationModal} />

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
                                                    value={this.simpleState.country && this.simpleState.country.name}
                                                />
                                                <AvField
                                                    name="iso_two_letter_code"
                                                    label="ISO Two-Letter Code"
                                                    required
                                                    maxLength="2"
                                                    minLength="2"
                                                    value={
                                                        this.simpleState.country
                                                        && this.simpleState.country.isoTwoLetterCode
                                                    }
                                                />
                                                <AvField
                                                    type="checkbox"
                                                    name="enabled"
                                                    label="Enabled"
                                                    checked={
                                                        this.simpleState.country && this.simpleState.country.enabled
                                                    }
                                                />
                                                <AvField
                                                    type="number"
                                                    name="lat"
                                                    label="Latitude"
                                                    required
                                                    validate={{ number: true }}
                                                    value={this.simpleState.country && this.simpleState.country.lat}
                                                    onChange={this.onLatLngFieldChange}
                                                />
                                                <AvField
                                                    type="number"
                                                    name="lng"
                                                    label="Longitude"
                                                    required
                                                    validate={{ number: true }}
                                                    value={this.simpleState.country && this.simpleState.country.lng}
                                                    onChange={this.onLatLngFieldChange}
                                                />
                                            </Col>
                                            <Col>
                                                <p className="small">
                                                    To add a center point or outline, click one of the tool buttons and
                                                    then the map. Click a blue shape to make it editable (turns yellow).
                                                    Click away from a yellow shape to set it (turns blue).
                                                </p>
                                                <p className="small">
                                                    Make sure to move the center point to within the bounds of the
                                                    country when enabling a country for the first time.
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
decorate(CountriesEdit, {
    simpleState: observable,
    elementAction: computed,
    centerPoint: computed({ equals: comparer.structural }),
});

CountriesEdit.contextType = StoreContext;

CountriesEdit.propTypes = {
    match: PropTypes.objectOf(PropTypes.any).isRequired,
    history: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default observer(CountriesEdit);
