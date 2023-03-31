import React from "react";

import { Input } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes from "prop-types";

import { debounce } from "lodash";

export default class GlobalFilterSearch extends React.Component {
    handleSearchDebounced = debounce((value) => {
        const { setData, toggleRefresh } = this.props;

        setData("searchString", value);
        toggleRefresh();
    }, 500);

    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
    }

    componentDidMount() {
        const { clearSearch } = this.props;

        if (clearSearch) {
            this.clearSearchValue();
        }
    }

    componentDidUpdate(prevProps) {
        const { clearSearch } = this.props;

        if (prevProps.clearSearch !== clearSearch) {
            this.clearSearchValue();
        }
    }

    componentWillUnmount() {
        this.handleSearchDebounced.cancel();
    }

    onChange(event) {
        // ref: https://stackoverflow.com/questions/23123138/perform-debounce-in-react-js
        // note that we are NOT passing the event object or using event.persist()
        // https://stackoverflow.com/questions/23123138/perform-debounce-in-react-js#comment83607053_24679479
        this.handleSearchDebounced(event.target.value);
    }

    clearSearchValue = () => {
        const { setClearSearchFalse } = this.props;

        this.searchInput.value = "";
        setClearSearchFalse();
    }

    render() {
        const { placeholder, defaultSearchValue } = this.props;

        return (
            <div>
                <div className="map-controls-search-icon"><FontAwesomeIcon icon="search" /></div>
                <Input
                    type="text"
                    innerRef={e => this.searchInput = e}
                    name=""
                    onChange={this.onChange}
                    id="search"
                    className="map-controls-search"
                    placeholder={placeholder || "Search"}
                    defaultValue={defaultSearchValue}
                />
            </div>
        );
    }
}

GlobalFilterSearch.propTypes = {
    clearSearch: PropTypes.bool,
    setClearSearchFalse: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
    setData: PropTypes.func.isRequired,
    toggleRefresh: PropTypes.func.isRequired,
    defaultSearchValue: PropTypes.string,
};

GlobalFilterSearch.defaultProps = {
    clearSearch: false,
    placeholder: "",
    defaultSearchValue: "",
};
