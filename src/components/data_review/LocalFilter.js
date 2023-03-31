import React, { Component } from "react";
import {
    Navbar, NavbarBrand, NavbarToggler, Collapse, Button, Input, Label, FormGroup,
} from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import LocalDateFilter from "./LocalDateFilter";
import LocalUserLocationFilter from "./LocalUserLocationFilter";
import DateOptions from "./DateOptions";

class LocalFilter extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showMobileFilter: true,
            mobileControlsOpen: false,
            showMobileFilterDates: false,
            showMobileFilterLocations: false,
        };
    }

    toggleMobileControlsAndClose = () => {
        const { mobileControlsOpen } = this.state;

        this.setState({
            mobileControlsOpen: !mobileControlsOpen,
        });
    };

    displayMobileFilter = () => {
        this.setState(
            {
                showMobileFilter: true,
                showMobileFilterLocations: false,
                showMobileFilterDates: false,
            },
        );
    };

    displayMobileFilterLocations = () => {
        this.setState(
            {
                showMobileFilter: false,
                showMobileFilterLocations: true,
                showMobileFilterDates: false,
            },
        );
    };

    displayMobileFilterDates = () => {
        this.setState(
            {
                showMobileFilter: false,
                showMobileFilterLocations: false,
                showMobileFilterDates: true,
            },
        );
    };

    render() {
        const {
            handleLocalFilterDateOptionSelect,
            selectedDateOption,
            locations,
            handleUserLocationChange,
            selectedUserLocations,
        } = this.props;

        const {
            mobileControlsOpen, showMobileFilter, showMobileFilterLocations, showMobileFilterDates,
        } = this.state;

        return (
            <div className="local-filter">
                <div className="local-filter-container">
                    <LocalDateFilter
                        handleLocalFilterDateOptionSelect={handleLocalFilterDateOptionSelect}
                        selectedDateOption={selectedDateOption}
                    />
                    <LocalUserLocationFilter
                        locations={locations}
                        handleUserLocationChange={handleUserLocationChange}
                        selectedUserLocations={selectedUserLocations}
                    />
                </div>

                <div className="globalfilter-mobile">
                    <Navbar>
                        <NavbarBrand className="globalfilter-mobile-brand">
                            {showMobileFilter ? (
                                <p>Local Filter</p>
                            ) : (
                                <div className="globalfilter-back-button" onClick={this.displayMobileFilter}>
                                    <FontAwesomeIcon icon="arrow-left" className="globalfilter-back-icon" />
                                    <p>Back</p>
                                </div>
                            )}
                        </NavbarBrand>

                        <NavbarToggler onClick={this.toggleMobileControlsAndClose} />

                        <Collapse isOpen={mobileControlsOpen} navbar>
                            <div className="globalfilter-mobile-container">
                                {showMobileFilter
                                    && (
                                        <div>
                                            <div className="globalfilter-locations-container fadein">
                                                <Button
                                                    onClick={this.displayMobileFilterDates}
                                                    className="globalfilter-mobile-button"
                                                >
                                                    {selectedDateOption || "Date Options"}
                                                    <div className="globalfilter-button-caret">
                                                        <FontAwesomeIcon icon="caret-right" />
                                                    </div>
                                                </Button>

                                                <Button
                                                    onClick={this.displayMobileFilterLocations}
                                                    className="globalfilter-mobile-button"
                                                >
                                                    Team Location (
                                                    {selectedUserLocations.length}
                                                    )
                                                    <div className="globalfilter-button-caret">
                                                        <FontAwesomeIcon icon="caret-right" />
                                                    </div>
                                                </Button>
                                            </div>
                                        </div>
                                    )}

                                {showMobileFilterLocations
                                    && (
                                        <ul className="popover show map-controls-popover local-data-review-filter-dropdown  bs-popover-bottom mobile-dropdown">
                                            {locations.map((location) => {
                                                return (
                                                    <li key={location.id}>
                                                        <FormGroup check>
                                                            <Label check className="map-controls-checkbox">
                                                                <Input
                                                                    type="checkbox"
                                                                    onChange={handleUserLocationChange}
                                                                    value={location.id}
                                                                    checked={selectedUserLocations.includes(location.id)}
                                                                />
                                                                {location.name}
                                                            </Label>
                                                        </FormGroup>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    )}

                                {showMobileFilterDates
                                    && (
                                        <ul className="map-controls-popover-list fadein">
                                            {DateOptions.ALL_OPTIONS.map((option) => {
                                                return (
                                                    <FormGroup check key={option} inline>
                                                        <Label check>
                                                            <Input
                                                                type="radio"
                                                                name="radio1"
                                                                onChange={handleLocalFilterDateOptionSelect}
                                                                value={option}
                                                                checked={option === selectedDateOption}
                                                            />
                                                            {option}
                                                        </Label>
                                                    </FormGroup>
                                                );
                                            })}
                                        </ul>
                                    )}
                            </div>
                        </Collapse>
                    </Navbar>
                </div>
            </div>
        );
    }
}

export default LocalFilter;
