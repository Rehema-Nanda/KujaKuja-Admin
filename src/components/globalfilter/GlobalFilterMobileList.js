import React, { useState } from "react";
import PropTypes from "prop-types";
import GlobalFilterDropdownSearch from "./GlobalFilterDropdownSearch";
import GlobalFilterCheckbox from "./GlobalFilterCheckbox";

function GlobalFilterMobileList(props) {
    const {
        items,
        itemLabelProperty,
        selectItemHandler,
        selectItemHandlerArgs,
        selectedItems,
        showSearch,
        isServicePoint,
    } = props;

    const [itemsToDisplay, setItemsToDisplay] = useState(items);

    return (
        <div>
            {showSearch
            && (
                <GlobalFilterDropdownSearch
                    className="mobile-list-search"
                    items={items}
                    itemLabelProperty={itemLabelProperty}
                    setResults={setItemsToDisplay}
                />
            )}
            <ul className="map-controls-popover-list fadein">
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
        </div>
    );
}

GlobalFilterMobileList.propTypes = {
    items: PropTypes.arrayOf(PropTypes.object).isRequired,
    itemLabelProperty: PropTypes.string.isRequired,
    selectItemHandler: PropTypes.func.isRequired,
    selectItemHandlerArgs: PropTypes.arrayOf(PropTypes.any),
    selectedItems: PropTypes.arrayOf(PropTypes.object).isRequired,
    showSearch: PropTypes.bool,
    isServicePoint: PropTypes.bool,
};

GlobalFilterMobileList.defaultProps = {
    selectItemHandlerArgs: [],
    showSearch: false,
    isServicePoint: false,
};

export default GlobalFilterMobileList;
