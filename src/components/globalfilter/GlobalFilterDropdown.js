import React from "react";

import {
    Popover, PopoverBody, Badge,
} from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes, { arrayOf } from "prop-types";

import GlobalFilterCheckbox from "./GlobalFilterCheckbox";
import GlobalFilterDropdownSearch from "./GlobalFilterDropdownSearch";

export default class GlobalFilterDropdown extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            popoverOpen: false,
            selectedItemName: "",
            itemsToDisplay: props.items,
            searchTerm: "",
        };

        this.toggle = this.toggle.bind(this);
    }

    componentDidUpdate = (prevProps) => {
        const { items, selectedItems } = this.props;

        if (prevProps.items !== items) {
            this.setState({
                itemsToDisplay: items,
                searchTerm: "",
            });
        }
        if (prevProps.selectedItems !== selectedItems) {
            this.getSelectedItemName(selectedItems);
        }
    }

    toggle = () => {
        const { popoverOpen } = this.state;

        this.setState(
            {
                popoverOpen: !popoverOpen,
            },
        );
    };

    getSelectedItemName = (selectedItemIds) => {
        const { items, itemLabelProperty } = this.props;

        if (selectedItemIds.length !== 1) {
            return;
        }

        const selectedItem = items.find((item) => {
            return item.id === selectedItemIds[0];
        });

        if (selectedItem) {
            this.setState({ selectedItemName: selectedItem[itemLabelProperty] });
        }
    }

    truncate = (str, id) => {
        let length = 8;

        if (id === "ServicePointsDropDown") {
            length += 19;
        }
        else if (id === "UsersDropDown") {
            length += 5;
        }

        if (str.length <= length) {
            return str;
        }
        return `${str.substring(0, length)}...`;
    }

    setItemsToDisplay = (items) => {
        this.setState({
            itemsToDisplay: items,
        });
    };

    setSearchTerm = (searchTerm) => {
        this.setState({
            searchTerm: searchTerm,
        });
    };

    render() {
        const { popoverOpen, selectedItemName, itemsToDisplay, searchTerm } = this.state;
        const {
            id,
            items,
            title,
            selectedItems,
            selectItemHandler,
            itemLabelProperty,
            selectItemHandlerArgs,
            showSearch,
            isServicePoint,
        } = this.props;

        return (
            <div>
                <div id={id} onClick={this.toggle} className="map-controls-button">
                    <Badge color="secondary" pill>
                        {
                            selectedItems.length > 0
                                ? selectedItems.length
                                : "All"
                        }
                    </Badge>
                    &nbsp;
                    {selectedItems.length === 1
                        ? this.truncate(selectedItemName, id)
                        : title}
                    <div className="map-controls-button-caret"><FontAwesomeIcon icon="caret-down" /></div>
                </div>
                <Popover placement="bottom" isOpen={popoverOpen} target={id} toggle={this.toggle} className="map-controls-popover">
                    {showSearch
                    && (
                        <GlobalFilterDropdownSearch
                            items={items}
                            itemLabelProperty={itemLabelProperty}
                            setResults={this.setItemsToDisplay}
                            searchTerm={searchTerm}
                            setSearchTerm={this.setSearchTerm}
                        />
                    )}
                    <PopoverBody>
                        <ul className="map-controls-popover-list">
                            {itemsToDisplay.map((item) => {
                                return (
                                    <li key={item.id}>
                                        <GlobalFilterCheckbox
                                            item={item}
                                            itemLabelProperty={itemLabelProperty}
                                            selectItemHandler={selectItemHandler}
                                            selectItemHandlerArgs={selectItemHandlerArgs}
                                            selectedItems={selectedItems}
                                            isServicePoint={isServicePoint}
                                        />
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

GlobalFilterDropdown.propTypes = {
    selectedItems: arrayOf(PropTypes.any).isRequired,
    items: PropTypes.arrayOf(PropTypes.object).isRequired,
    itemLabelProperty: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    selectItemHandler: PropTypes.func.isRequired,
    selectItemHandlerArgs: PropTypes.arrayOf(PropTypes.string).isRequired,
    showSearch: PropTypes.bool,
    isServicePoint: PropTypes.bool,
};

GlobalFilterDropdown.defaultProps = {
    isServicePoint: false,
    showSearch: false,
};
