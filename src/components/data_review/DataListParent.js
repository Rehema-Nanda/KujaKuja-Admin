import React from "react";
import moment from "moment";
import PropTypes from "prop-types";
import _ from "lodash";

import { StoreContext } from "../../StoreContext";
import {
    remapQueryParamsToLocalStateVariableNamesAndTypes, getGlobalFilterParams,
    remapQueryParamsToGlobalFilterStateVariableNames, getDefinedParams,
} from "../../helpers/urlFilterParamsHelper";


class DataListParent extends React.Component {
    setData(name, value) {
        this.setState(
            {
                [name]: value,
            },
        );
    }

    selectLocation = (id, type, clear = false, refreshData = true) => {
        const selectedType = `selected${type}`;
        let previousState = [];

        if (clear) {
            this.setState(
                {
                    selectedCountries: [],
                    selectedLocations: [],
                    selectedServicePoints: [],
                },
            );
            previousState.push(id);
        }
        else {
            previousState = [].concat(this.state[selectedType]); // eslint-disable-line react/destructuring-assignment

            if (previousState.indexOf(id) === -1) {
                // push id
                previousState.push(id);
            }
            else {
                // remove id
                const index = previousState.indexOf(id);
                previousState.splice(index, 1);
            }
        }

        if (type === "Countries") {
            this.setState(
                {
                    selectedCountries: previousState,
                    selectedLocations: [],
                    selectedServicePoints: [],
                    refreshData: refreshData,
                },
            );
        }
        else if (type === "Locations") {
            this.setState(
                {
                    selectedCountries: [],
                    selectedLocations: previousState,
                    selectedServicePoints: [],
                    refreshData: refreshData,
                },
            );
        }
        else if (type === "ServicePoints") {
            this.setState(
                {
                    selectedCountries: [],
                    selectedLocations: [],
                    selectedServicePoints: previousState,
                    refreshData: refreshData,
                },
            );
        }
    };

    selectUser = (id, clear = false, refreshData = true) => {
        const { selectedUsers } = this.state;
        let previousState = [];

        if (clear) {
            this.setState(
                {
                    selectedUsers: [],
                },
            );
            previousState.push(id);
        }
        else {
            previousState = [].concat(selectedUsers);

            if (previousState.indexOf(id) === -1) {
                // push id
                previousState.push(id);
            }
            else {
                // remove id
                const index = previousState.indexOf(id);
                previousState.splice(index, 1);
            }
        }

        this.setState(
            {
                selectedUsers: previousState,
                refreshData: refreshData,
            },
        );
    };

    selectSurveyType = (id, clear = false, refreshData = true) => {
        const { selectedSurveyTypes } = this.state;
        let previousState = [];

        if (clear) {
            this.setState(
                {
                    selectedSurveyTypes: [],
                },
            );
            previousState.push(id);
        }
        else {
            previousState = [].concat(selectedSurveyTypes);

            if (previousState.indexOf(id) === -1) {
                // push id
                previousState.push(id);
            }
            else {
                // remove id
                const index = previousState.indexOf(id);
                previousState.splice(index, 1);
            }
        }

        this.setState(
            {
                selectedSurveyTypes: previousState,
                refreshData: refreshData,
            },
        );
    };

    selectSatisfied = (id, clear = false, refreshData = true) => {
        const { selectedSatisfied } = this.state;
        let previousState = [];

        if (clear) {
            this.setState(
                {
                    selectedSatisfied: [],
                },
            );
            previousState.push(id);
        }
        else {
            previousState = [].concat(selectedSatisfied);

            if (previousState.indexOf(id) === -1) {
                // push id
                previousState.push(id);
            }
            else {
                // remove id
                const index = previousState.indexOf(id);
                previousState.splice(index, 1);
            }
        }

        this.setState(
            {
                selectedSatisfied: previousState,
                refreshData: refreshData,
            },
        );
    };

    selectFreshIdea = (id, clear = false, refreshData = true) => {
        const { selectedFreshIdea } = this.state;
        let previousState = [];

        if (clear) {
            this.setState(
                {
                    selectedFreshIdea: [],
                },
            );
            previousState.push(id);
        }
        else {
            previousState = [].concat(selectedFreshIdea);

            if (previousState.indexOf(id) === -1) {
                // push id
                previousState.push(id);
            }
            else {
                // remove id
                const index = previousState.indexOf(id);
                previousState.splice(index, 1);
            }
        }

        this.setState(
            {
                selectedFreshIdea: previousState,
                refreshData: refreshData,
            },
        );
    };

    setDateStartEnd = (startDate, endDate) => {
        const { dateEnd, dateStart } = this.state;
        let startDateToSet = startDate.clone();
        let endDateToSet = endDate.clone();

        if (endDateToSet.isSameOrBefore(startDateToSet, "day")) {
            if (endDateToSet !== dateEnd) {
                // the end date is being changed, set the start date appropriately
                startDateToSet = endDateToSet.clone();
            }
            else if (startDateToSet !== dateStart) {
                // the start date is being changed, set the end date appropriately
                endDateToSet = startDateToSet.clone();
            }
        }

        this.setState(
            {
                dateStart: startDateToSet,
                dateEnd: endDateToSet,
                refreshData: true,
            },
        );
    };

    getDateEndForExclusiveQuery = (dateEnd) => {
        return dateEnd.clone().add(1, "days").startOf("day");
    };

    toggleServiceType = (serviceTypeId) => {
        const { selectedServiceTypes } = this.state;

        if (selectedServiceTypes.indexOf(serviceTypeId) === -1) {
            this.setState((prevState) => {
                return {
                    selectedServiceTypes: [...prevState.selectedServiceTypes, serviceTypeId],
                    refreshData: true,
                };
            });
        }
        else {
            const array = [...selectedServiceTypes];
            const index = array.indexOf(serviceTypeId);
            array.splice(index, 1);

            this.setState(
                {
                    selectedServiceTypes: array,
                    refreshData: true,
                },
            );
        }
    };

    handleTableChange = (type, tableChangeObject) => {
        this.setState(
            {
                page: tableChangeObject.page,
                limit: tableChangeObject.sizePerPage,
                sort: {
                    by: tableChangeObject.sortField,
                    order: tableChangeObject.sortOrder,
                },
                refreshData: true,
            },
        );
    };

    resetAllFilters = () => {
        const today = moment.utc().startOf("day");
        this.setState({
            selectedCountries: [],
            selectedLocations: [],
            selectedServicePoints: [],
            selectedServiceTypes: [],
            selectedUsers: [],
            selectedSurveyTypes: [],
            selectedSatisfied: [],
            selectedFreshIdea: [],
            dateStart: today.clone().subtract(7, "days"),
            dateEnd: today,
            searchString: "",
            page: 1,
            clearSearch: true,
            refreshData: true,
        });
    }

    tagSearch = (e) => {
        const tag = e.target.value;
        this.setState({ searchString: tag.trim(), refreshData: true });
    }

    setClearSearchFalse = () => {
        this.setState({ clearSearch: false });
    }

    updateLocalStateFromQueryParams = (queryParams) => {
        const mappedParams = remapQueryParamsToLocalStateVariableNamesAndTypes(queryParams);
        const globalFilterParams = getGlobalFilterParams(mappedParams);
        const {
            searchString, selectedCountries, dateStart, dateEnd, selectedLocations, selectedServiceTypes,
            selectedServicePoints, selectedUsers, selectedSurveyTypes, selectedSatisfied, page, limit,
        } = this.state;
        const today = moment.utc().startOf("day");

        // merge the default state with whatever state variables are present in the URL query params
        // this ensures that any state not present in the URL query params is reset
        const defaultState = {
            selectedCountries: [],
            selectedLocations: [],
            selectedServiceTypes: [],
            selectedServicePoints: [],
            selectedSurveyTypes: [],
            selectedSatisfied: [],
            selectedFreshIdea: [],
            searchString: "",
            dateStart: today.clone().subtract(7, "days"),
            dateEnd: today,
            selectedUsers: [],
            page: 1,
            limit: 100,
        };
        const finalState = { ...defaultState, ...globalFilterParams };

        // only update state if we need to
        if (searchString !== finalState.searchString
            || selectedCountries !== finalState.selectedCountries
            || dateStart !== finalState.dateStart
            || dateEnd !== finalState.dateEnd
            || selectedLocations !== finalState.selectedLocations
            || selectedServiceTypes !== finalState.selectedServiceTypes
            || selectedServicePoints !== finalState.selectedServicePoints
            || selectedSurveyTypes !== finalState.selectedSurveyTypes
            || selectedSatisfied !== finalState.selectedSatisfied
            || selectedUsers !== finalState.selectedUsers
            || page !== finalState.page
            || limit !== finalState.limit
        ) {
            this.setState(finalState);
            return true;
        }

        return false;
    };

    updateFilterState = (queryParams) => {
        const mappedParams = remapQueryParamsToGlobalFilterStateVariableNames(queryParams);
        const globalFilterParams = getGlobalFilterParams(mappedParams);
        const {
            searchString, selectedCountries, dateStart, dateEnd, selectedLocations, selectedServiceTypes,
            selectedServicePoints, selectedUsers, selectedSurveyTypes, selectedSatisfied, selectedFreshIdea,
            page, limit,
        } = this.state;

        // merge the default state with whatever state variables are present in the URL query params
        // this ensures that any state not present in the URL query params is reset
        // dateStart & dateEnd should always be present
        const defaultFilterState = {
            selectedCountries: [],
            selectedLocations: [],
            selectedServiceTypes: [],
            selectedServicePoints: [],
            selectedUsers: [],
            selectedSurveyTypes: [],
            selectedSatisfied: [],
            selectedFreshIdea: [],
            searchString: "",
            refreshData: true,
            page: 1,
            limit: 25,
        };
        const finalState = { ...defaultFilterState, ...globalFilterParams };

        // only update state if we need to
        if (!_.isEqual(selectedCountries, finalState.selectedCountries)
            || !_.isEqual(selectedLocations, finalState.selectedLocations)
            || !_.isEqual(selectedServiceTypes, finalState.selectedServiceTypes)
            || !_.isEqual(selectedServicePoints, finalState.selectedServicePoints)
            || !_.isEqual(selectedUsers, finalState.selectedUsers)
            || !_.isEqual(searchString, finalState.searchString)
            || !_.isEqual(selectedSurveyTypes, finalState.selectedSurveyTypes)
            || !_.isEqual(selectedSatisfied, finalState.selectedSatisfied)
            || !_.isEqual(selectedFreshIdea, finalState.selectedFreshIdea)
            || !_.isEqual(page, finalState.page)
            || !_.isEqual(limit, finalState.limit)
            || !dateStart.isSame(finalState.dateStart)
            || !dateEnd.isSame(finalState.dateEnd)
        ) {
            this.setState(finalState);
            return true;
        }
        return false;
    };

    pushListPageHistoryIfRequired = () => {
        const { location, history } = this.props;
        const {
            page, limit,
        } = this.state;
        const historyParams = {
            page: page,
            limit: limit,
        };

        const definedParams = getDefinedParams(historyParams);
        const query = new URLSearchParams(definedParams);

        if (query.toString() !== location.search.substr(1)) {
            history.push({ search: `?${query}` });
        }
    };

    pushHistoryIfRequired = () => {
        const { location, history } = this.props;
        const {
            searchString, selectedCountries, dateStart, dateEnd, selectedLocations, selectedServiceTypes,
            selectedServicePoints, selectedUsers, selectedSurveyTypes, selectedSatisfied, selectedFreshIdea,
            page, limit,
        } = this.state;
        const historyParams = {
            start: dateStart.format("YYYY-MM-DD"),
            end: dateEnd.format("YYYY-MM-DD"),
            countries: selectedCountries,
            settlements: selectedLocations,
            types: selectedServiceTypes,
            keyword: searchString,
            points: selectedServicePoints,
            survey: selectedSurveyTypes,
            satisfied: selectedSatisfied,
            fresh: selectedFreshIdea,
            users: selectedUsers,
            page: page,
            limit: limit,
        };

        const definedParams = getDefinedParams(historyParams);
        const query = new URLSearchParams(definedParams);

        if (query.toString() !== location.search.substr(1)) {
            history.push({ search: `?${query}` });
        }
    };

    toggleRefresh() {
        const { refreshData } = this.state;

        this.setState(
            {
                refreshData: !refreshData,
            },
        );
    }

    viewRow(row) {
        const { history } = this.props;
        history.replace(`/responses/${row.id}`);
    }
}

DataListParent.contextType = StoreContext;

DataListParent.propTypes = {
    history: PropTypes.objectOf(PropTypes.any).isRequired,
    location: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default DataListParent;
