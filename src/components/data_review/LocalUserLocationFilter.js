import React, { Component } from "react";
import {
    Popover, PopoverBody, Input, Label, FormGroup, Badge,
} from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class LocalUserLocationFilter extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isTeamLocationDropdownOpen: false,
        };
    }

    truncate = (str) => {
        const length = 14;

        if (str.length <= length) {
            return str;
        }

        return `${str.substring(0, length)}...`;
    };

    toggleTeamLocationDropdown = () => {
        const { isTeamLocationDropdownOpen } = this.state;

        this.setState({
            isTeamLocationDropdownOpen: !isTeamLocationDropdownOpen,
        });
    };

    getSelectedTeamLocationName = () => {
        const { locations, selectedUserLocations } = this.props;

        if (selectedUserLocations.length === 1) {
            const location = locations.find((loc) => {
                return selectedUserLocations[0] === loc.id;
            });

            if (location) {
                return this.truncate(location.name);
            }
        }

        return "Team Location";
    };

    render() {
        const { isTeamLocationDropdownOpen } = this.state;

        const { locations, handleUserLocationChange, selectedUserLocations } = this.props;

        return (
            <div className="user-location-container">
                <div
                    id="UserLocationDropdown"
                    className="map-controls-button user-location-button"
                    onClick={this.toggleTeamLocationDropdown}
                >
                    <Badge color="secondary" pill>
                        {selectedUserLocations.length > 0 ? selectedUserLocations.length : "All"}
                    </Badge>
                    {" "}
                    {this.getSelectedTeamLocationName()}
                    <div className="map-controls-button-caret">
                        <FontAwesomeIcon icon="caret-down" />
                    </div>
                </div>
                <Popover
                    placement="bottom"
                    isOpen={isTeamLocationDropdownOpen}
                    target="UserLocationDropdown"
                    toggle={this.toggleTeamLocationDropdown}
                    className="map-controls-popover"
                >
                    <PopoverBody>
                        <ul className="map-controls-popover-list">
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
                    </PopoverBody>
                </Popover>
            </div>
        );
    }
}

export default LocalUserLocationFilter;
