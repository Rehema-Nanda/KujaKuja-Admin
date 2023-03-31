import React from "react";

import {
    Navbar, NavbarBrand, NavbarToggler, Collapse, Button,
} from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes from "prop-types";
import GlobalFilterSearch from "./GlobalFilterSearch";
import GlobalFilterDropdown from "./GlobalFilterDropdown";
import GlobalFilterCalendar from "./GlobalFilterCalendar";
import GlobalFilterCalendarMobileStart from "./GlobalFilterCalendarMobileStart";
import GlobalFilterCalendarMobileEnd from "./GlobalFilterCalendarMobileEnd";
import GlobalFilterServices from "./GlobalFilterServices";
import GlobalFilterMobileButton from "./GlobalFilterMobileButton";
import GlobalFilterMobileList from "./GlobalFilterMobileList";

import "./GlobalFilter.css";
import CalendarConfig from "./CalendarConfig";

export default class GlobalFilter extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            mobileControlsOpen: false,
            showMobileFilter: true,
            showMobileFilterCountries: false,
            showMobileFilterLocations: false,
            showMobileFilterServicePoints: false,
            showMobileFilterStartDate: false,
            showMobileFilterEndDate: false,
            showMobileFilterUsers: false,
            showMobileFilterSurveyTypes: false,
            showMobileFilterSatisfied: false,
            showMobileFilterFreshIdea: false,
        };

        this.toggleMobileControlsAndClose = this.toggleMobileControlsAndClose.bind(this);
        this.displayMobileFilter = this.displayMobileFilter.bind(this);
        this.displayMobileFilterCountries = this.displayMobileFilterCountries.bind(this);
        this.displayMobileFilterLocations = this.displayMobileFilterLocations.bind(this);
        this.displayMobileFilterServicePoints = this.displayMobileFilterServicePoints.bind(this);
        this.displayMobileFilterStartDate = this.displayMobileFilterStartDate.bind(this);
        this.displayMobileFilterEndDate = this.displayMobileFilterEndDate.bind(this);
        this.displayMobileFilterUsers = this.displayMobileFilterUsers.bind(this);
        this.displayMobileFilterSurveyTypes = this.displayMobileFilterSurveyTypes.bind(this);
        this.displayMobileFilterSatisfied = this.displayMobileFilterSatisfied.bind(this);
        this.displayMobileFilterFreshIdea = this.displayMobileFilterFreshIdea.bind(this);
    }

    componentDidMount() {

    }


    toggleMobileControlsAndClose = (e) => {
        const { mobileControlsOpen } = this.state;

        this.setState(
            {
                mobileControlsOpen: !mobileControlsOpen,
            },
        );

        // swap icons on navbar
        if (navigator.userAgent.indexOf("Chrome") !== -1 || navigator.userAgent.indexOf("Safari") !== -1) {
            // needs firefox fix
            if (!mobileControlsOpen) {
                const arrowImgUp = require("../../img/mobile-controls-arrow-up.svg");
                e.target.style.backgroundImage = `url(${arrowImgUp})`;
                e.target.style.backgroundSize = "24px 24px";
                e.target.style.backgroundRepeat = "no-repeat";
                e.target.style.backgroundPosition = "center right";
            }
            else {
                const arrowImg = require("../../img/mobile-controls-arrow.svg");
                e.target.style.backgroundImage = `url(${arrowImg})`;
                e.target.style.backgroundSize = "24px 24px";
                e.target.style.backgroundRepeat = "no-repeat";
                e.target.style.backgroundPosition = "center center";
            }
        }
    };

    displayMobileFilter = () => {
        this.setState(
            {
                showMobileFilter: true,
                showMobileFilterCountries: false,
                showMobileFilterLocations: false,
                showMobileFilterServicePoints: false,
                showMobileFilterStartDate: false,
                showMobileFilterEndDate: false,
                showMobileFilterUsers: false,
                showMobileFilterSurveyTypes: false,
                showMobileFilterSatisfied: false,
                showMobileFilterFreshIdea: false,
            },
        );
    };

    displayMobileFilterCountries = () => {
        this.setState(
            {
                showMobileFilter: false,
                showMobileFilterCountries: true,
                showMobileFilterLocations: false,
                showMobileFilterServicePoints: false,
                showMobileFilterStartDate: false,
                showMobileFilterEndDate: false,
                showMobileFilterUsers: false,
                showMobileFilterSurveyTypes: false,
                showMobileFilterSatisfied: false,
                showMobileFilterFreshIdea: false,
            },
        );
    };

    displayMobileFilterLocations = () => {
        this.setState(
            {
                showMobileFilter: false,
                showMobileFilterCountries: false,
                showMobileFilterLocations: true,
                showMobileFilterServicePoints: false,
                showMobileFilterStartDate: false,
                showMobileFilterEndDate: false,
                showMobileFilterUsers: false,
                showMobileFilterSurveyTypes: false,
                showMobileFilterSatisfied: false,
                showMobileFilterFreshIdea: false,
            },
        );
    };

    displayMobileFilterServicePoints = () => {
        this.setState(
            {
                showMobileFilter: false,
                showMobileFilterCountries: false,
                showMobileFilterLocations: false,
                showMobileFilterServicePoints: true,
                showMobileFilterStartDate: false,
                showMobileFilterEndDate: false,
                showMobileFilterUsers: false,
                showMobileFilterSurveyTypes: false,
                showMobileFilterSatisfied: false,
                showMobileFilterFreshIdea: false,
            },
        );
    };

    displayMobileFilterStartDate = () => {
        this.setState(
            {
                showMobileFilter: false,
                showMobileFilterCountries: false,
                showMobileFilterLocations: false,
                showMobileFilterServicePoints: false,
                showMobileFilterStartDate: true,
                showMobileFilterEndDate: false,
                showMobileFilterUsers: false,
                showMobileFilterSurveyTypes: false,
                showMobileFilterSatisfied: false,
                showMobileFilterFreshIdea: false,
            },
        );
    };

    displayMobileFilterEndDate = () => {
        this.setState(
            {
                showMobileFilter: false,
                showMobileFilterCountries: false,
                showMobileFilterLocations: false,
                showMobileFilterServicePoints: false,
                showMobileFilterStartDate: false,
                showMobileFilterEndDate: true,
                showMobileFilterUsers: false,
                showMobileFilterSurveyTypes: false,
                showMobileFilterSatisfied: false,
                showMobileFilterFreshIdea: false,
            },
        );
    };

    displayMobileFilterUsers = () => {
        this.setState(
            {
                showMobileFilter: false,
                showMobileFilterCountries: false,
                showMobileFilterLocations: false,
                showMobileFilterServicePoints: false,
                showMobileFilterStartDate: false,
                showMobileFilterEndDate: false,
                showMobileFilterUsers: true,
                showMobileFilterSurveyTypes: false,
                showMobileFilterSatisfied: false,
                showMobileFilterFreshIdea: false,
            },
        );
    };

    displayMobileFilterSurveyTypes = () => {
        this.setState(
            {
                showMobileFilter: false,
                showMobileFilterCountries: false,
                showMobileFilterLocations: false,
                showMobileFilterServicePoints: false,
                showMobileFilterStartDate: false,
                showMobileFilterEndDate: false,
                showMobileFilterUsers: false,
                showMobileFilterSurveyTypes: true,
                showMobileFilterSatisfied: false,
                showMobileFilterFreshIdea: false,
            },
        );
    };

    displayMobileFilterSatisfied = () => {
        this.setState(
            {
                showMobileFilter: false,
                showMobileFilterCountries: false,
                showMobileFilterLocations: false,
                showMobileFilterServicePoints: false,
                showMobileFilterStartDate: false,
                showMobileFilterEndDate: false,
                showMobileFilterUsers: false,
                showMobileFilterSurveyTypes: false,
                showMobileFilterSatisfied: true,
                showMobileFilterFreshIdea: false,
            },
        );
    };

    displayMobileFilterFreshIdea = () => {
        this.setState(
            {
                showMobileFilter: false,
                showMobileFilterCountries: false,
                showMobileFilterLocations: false,
                showMobileFilterServicePoints: false,
                showMobileFilterStartDate: false,
                showMobileFilterEndDate: false,
                showMobileFilterUsers: false,
                showMobileFilterSurveyTypes: false,
                showMobileFilterSatisfied: false,
                showMobileFilterFreshIdea: true,
            },
        );
    };

    render() {
        const {
            setData, toggleRefresh, countries, selectLocation, selectedCountries, locations, selectedLocations,
            setDateStartEnd, dateStart, dateEnd, toggleServiceType, selectedServiceTypes, serviceTypes, users,
            selectUser, selectedUsers, servicePoints, selectedServicePoints, surveyTypes, selectSurveyType,
            selectedSurveyTypes, booleanOptions, selectSatisfied, selectedSatisfied, selectFreshIdea, selectedFreshIdea,
            resetFilters, clearSearch, setClearSearchFalse, defaultSearchValue, isServicePoint,
        } = this.props;
        const {
            mobileControlsOpen, showMobileFilter, showMobileFilterUsers,
            showMobileFilterStartDate, showMobileFilterEndDate, showMobileFilterCountries,
            showMobileFilterLocations, showMobileFilterServicePoints, showMobileFilterSurveyTypes,
            showMobileFilterSatisfied, showMobileFilterFreshIdea,
        } = this.state;

        return (

            <div>

                <div className={`globalfilter-container ${mobileControlsOpen ? "filter-shadow" : ""}`}>

                    <div className="globalfilter-desktop">

                        <div className="globalfilter-search-container">
                            <GlobalFilterSearch
                                setData={setData}
                                toggleRefresh={toggleRefresh}
                                placeholder="Idea Search"
                                clearSearch={clearSearch}
                                setClearSearchFalse={setClearSearchFalse}
                                defaultSearchValue={defaultSearchValue}
                            />
                        </div>

                        <div className="globalfilter-locations-container">
                            <GlobalFilterDropdown
                                id="CountriesDropDown"
                                title="Countries"
                                items={countries}
                                itemLabelProperty="name"
                                selectItemHandler={selectLocation}
                                selectItemHandlerArgs={["Countries"]}
                                selectedItems={selectedCountries}
                                showSearch
                            />
                            <div className="globalfilter-locations-spacer" />
                            <GlobalFilterDropdown
                                id="LocationsDropDown"
                                className="location-dropdown"
                                title="Locations"
                                items={locations}
                                itemLabelProperty="name"
                                selectItemHandler={selectLocation}
                                selectItemHandlerArgs={["Locations"]}
                                selectedItems={selectedLocations}
                                showSearch
                            />
                        </div>

                        <div className="globalfilter-calendar-container">
                            <GlobalFilterCalendar
                                title="From:"
                                id="CalendarDropDown"
                                withPortal={false}
                                setDateStartEnd={setDateStartEnd}
                                type={CalendarConfig.CALENDAR_DATE}
                                dateStart={dateStart}
                                dateEnd={dateEnd}
                            />
                        </div>

                        <div className="globalfilter-service-container">
                            <GlobalFilterServices
                                serviceTypes={serviceTypes}
                                toggleServiceType={toggleServiceType}
                                selectedServiceTypes={selectedServiceTypes}
                            />
                        </div>

                    </div>

                    <div className="globalfilter-desktop">

                        <div className="globalfilter-users-container">
                            <GlobalFilterDropdown
                                id="UsersDropDown"
                                title="Users"
                                items={users}
                                itemLabelProperty="email"
                                selectItemHandler={selectUser}
                                selectItemHandlerArgs={[]}
                                selectedItems={selectedUsers}
                                showSearch
                            />
                        </div>

                        <div className="globalfilter-service-points-container">
                            <GlobalFilterDropdown
                                id="ServicePointsDropDown"
                                title="Service Points"
                                items={servicePoints}
                                itemLabelProperty="name"
                                selectItemHandler={selectLocation}
                                selectItemHandlerArgs={["ServicePoints"]}
                                selectedItems={selectedServicePoints}
                                showSearch
                                isServicePoint={isServicePoint}
                            />
                        </div>

                        <div className="globalfilter-survey-types-container">
                            <GlobalFilterDropdown
                                id="SurveyTypeDropDown"
                                title="Survey Types"
                                items={surveyTypes}
                                itemLabelProperty="name"
                                selectItemHandler={selectSurveyType}
                                selectItemHandlerArgs={[]}
                                selectedItems={selectedSurveyTypes}
                            />
                        </div>

                        <div className="globalfilter-satisfied-container">
                            <GlobalFilterDropdown
                                id="SatisfiedDropDown"
                                title="Satisfied"
                                items={booleanOptions}
                                itemLabelProperty="name"
                                selectItemHandler={selectSatisfied}
                                selectItemHandlerArgs={[]}
                                selectedItems={selectedSatisfied}
                            />
                        </div>

                        <div className="globalfilter-fresh-idea-container">
                            <GlobalFilterDropdown
                                id="FreshIdeaDropDown"
                                title="Fresh Idea"
                                items={booleanOptions}
                                itemLabelProperty="name"
                                selectItemHandler={selectFreshIdea}
                                selectItemHandlerArgs={[]}
                                selectedItems={selectedFreshIdea}
                            />
                        </div>

                        <div className="globalfilter-reset-filters-container">
                            <Button
                                className="resetButton primary"
                                onClick={resetFilters}
                            >
                                Reset All
                            </Button>
                        </div>

                    </div>


                    <div className="globalfilter-mobile">

                        <Navbar>
                            <NavbarBrand className="globalfilter-mobile-brand">
                                {showMobileFilter ? (
                                    <p>Filter</p>
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

                                            <div className="globalfilter-search-container fadein">
                                                <GlobalFilterSearch
                                                    setData={setData}
                                                    toggleRefresh={toggleRefresh}
                                                    placeholder="Idea Search"
                                                />
                                            </div>

                                            <div className="globalfilter-users-container fadein">
                                                <GlobalFilterMobileButton
                                                    text={`Users (${selectedUsers.length})`}
                                                    onClick={this.displayMobileFilterUsers}
                                                />
                                            </div>

                                            <div className="globalfilter-label fadein">
                                                <p className="small">Start Date:</p>
                                            </div>

                                            <div className="globalfilter-label fadein">
                                                <p className="small">End Date:</p>
                                            </div>

                                            <div className="globalfilter-calendar-container fadein">

                                                <GlobalFilterMobileButton
                                                    text={dateStart.format("L")}
                                                    onClick={this.displayMobileFilterStartDate}
                                                />

                                                <GlobalFilterMobileButton
                                                    text={dateEnd.format("L")}
                                                    onClick={this.displayMobileFilterEndDate}
                                                />

                                            </div>

                                            <div className="globalfilter-locations-container fadein">

                                                <GlobalFilterMobileButton
                                                    text={`Countries (${selectedCountries.length})`}
                                                    onClick={this.displayMobileFilterCountries}
                                                />

                                                <GlobalFilterMobileButton
                                                    text={`Locations (${selectedLocations.length})`}
                                                    onClick={this.displayMobileFilterLocations}
                                                />

                                            </div>

                                            <div className="globalfilter-service-points-container fadein">
                                                <GlobalFilterMobileButton
                                                    text={`Service Points (${selectedServicePoints.length})`}
                                                    onClick={this.displayMobileFilterServicePoints}
                                                />
                                            </div>

                                            <div className="globalfilter-service-container fadein">
                                                <GlobalFilterServices
                                                    serviceTypes={serviceTypes}
                                                    toggleServiceType={toggleServiceType}
                                                    selectedServiceTypes={selectedServiceTypes}
                                                />
                                            </div>

                                            <div className="globalfilter-survey-types-container fadein">
                                                <GlobalFilterMobileButton
                                                    text={`Survey Types (${selectedSurveyTypes.length})`}
                                                    onClick={this.displayMobileFilterSurveyTypes}
                                                />
                                            </div>

                                            <div className="globalfilter-satisfied-container fadein">
                                                <GlobalFilterMobileButton
                                                    text={`Satisfied (${selectedSatisfied.length})`}
                                                    onClick={this.displayMobileFilterSatisfied}
                                                />
                                            </div>

                                            <div className="globalfilter-fresh-idea-container fadein">
                                                <GlobalFilterMobileButton
                                                    text={`Fresh Idea (${selectedFreshIdea.length})`}
                                                    onClick={this.displayMobileFilterFreshIdea}
                                                />
                                            </div>

                                            <div className="globalfilter-reset-filters-container">
                                                <Button
                                                    className="resetButton primary"
                                                    onClick={resetFilters}
                                                >
                                                    Reset All
                                                </Button>
                                            </div>

                                        </div>
                                    )}

                                    {showMobileFilterUsers
                                    && (
                                        <GlobalFilterMobileList
                                            items={users}
                                            itemLabelProperty="email"
                                            selectItemHandler={selectUser}
                                            selectItemHandlerArgs={[]}
                                            selectedItems={selectedUsers}
                                            showSearch
                                        />
                                    )}

                                    {showMobileFilterStartDate
                                    && (
                                        <GlobalFilterCalendarMobileStart
                                            title="From:"
                                            id="CalendarDropDownMobileStart"
                                            withPortal={false}
                                            setDateStartEnd={setDateStartEnd}
                                            dateStart={dateStart}
                                            dateEnd={dateEnd}
                                            type={CalendarConfig.CALENDAR_DATE}
                                            displayMobileFilter={this.displayMobileFilter}
                                        />
                                    )}

                                    {showMobileFilterEndDate
                                    && (
                                        <GlobalFilterCalendarMobileEnd
                                            title="To:"
                                            id="CalendarDropDownMobileEnd"
                                            withPortal={false}
                                            setDateStartEnd={setDateStartEnd}
                                            dateStart={dateStart}
                                            dateEnd={dateEnd}
                                            type={CalendarConfig.CALENDAR_DATE}
                                            displayMobileFilter={this.displayMobileFilter}
                                        />
                                    )}

                                    {showMobileFilterCountries
                                    && (
                                        <GlobalFilterMobileList
                                            items={countries}
                                            itemLabelProperty="name"
                                            selectItemHandler={selectLocation}
                                            selectItemHandlerArgs={["Countries"]}
                                            selectedItems={selectedCountries}
                                            showSearch
                                        />
                                    )}

                                    {showMobileFilterLocations
                                    && (
                                        <GlobalFilterMobileList
                                            items={locations}
                                            itemLabelProperty="name"
                                            selectItemHandler={selectLocation}
                                            selectItemHandlerArgs={["Locations"]}
                                            selectedItems={selectedLocations}
                                            showSearch
                                        />
                                    )}

                                    {showMobileFilterServicePoints
                                    && (
                                        <GlobalFilterMobileList
                                            items={servicePoints}
                                            itemLabelProperty="name"
                                            selectItemHandler={selectLocation}
                                            selectItemHandlerArgs={["ServicePoints"]}
                                            selectedItems={selectedServicePoints}
                                            showSearch
                                            isServicePoint
                                        />
                                    )}

                                    {showMobileFilterSurveyTypes
                                    && (
                                        <GlobalFilterMobileList
                                            items={surveyTypes}
                                            itemLabelProperty="name"
                                            selectItemHandler={selectSurveyType}
                                            selectItemHandlerArgs={[]}
                                            selectedItems={selectedSurveyTypes}
                                        />
                                    )}

                                    {showMobileFilterSatisfied
                                    && (
                                        <GlobalFilterMobileList
                                            items={booleanOptions}
                                            itemLabelProperty="name"
                                            selectItemHandler={selectSatisfied}
                                            selectItemHandlerArgs={[]}
                                            selectedItems={selectedSatisfied}
                                        />
                                    )}

                                    {showMobileFilterFreshIdea
                                    && (
                                        <GlobalFilterMobileList
                                            items={booleanOptions}
                                            itemLabelProperty="name"
                                            selectItemHandler={selectFreshIdea}
                                            selectItemHandlerArgs={[]}
                                            selectedItems={selectedFreshIdea}
                                        />
                                    )}

                                </div>

                            </Collapse>

                        </Navbar>

                    </div>

                </div>

            </div>
        );
    }
}

GlobalFilter.propTypes = {
    setData: PropTypes.func.isRequired,
    toggleRefresh: PropTypes.func.isRequired,
    countries: PropTypes.arrayOf(PropTypes.object).isRequired,
    selectLocation: PropTypes.func.isRequired,
    selectedCountries: PropTypes.arrayOf(PropTypes.any),
    locations: PropTypes.arrayOf(PropTypes.object).isRequired,
    selectedLocations: PropTypes.arrayOf(PropTypes.any),
    setDateStartEnd: PropTypes.func.isRequired,
    dateStart: PropTypes.objectOf(PropTypes.any).isRequired,
    dateEnd: PropTypes.objectOf(PropTypes.any).isRequired,
    toggleServiceType: PropTypes.func.isRequired,
    serviceTypes: PropTypes.arrayOf(PropTypes.object).isRequired,
    selectedServiceTypes: PropTypes.arrayOf(PropTypes.any),
    users: PropTypes.arrayOf(PropTypes.object).isRequired,
    selectUser: PropTypes.func.isRequired,
    selectedUsers: PropTypes.arrayOf(PropTypes.any),
    servicePoints: PropTypes.arrayOf(PropTypes.object).isRequired,
    selectedServicePoints: PropTypes.arrayOf(PropTypes.any),
    surveyTypes: PropTypes.arrayOf(PropTypes.object).isRequired,
    selectSurveyType: PropTypes.func.isRequired,
    selectedSurveyTypes: PropTypes.arrayOf(PropTypes.any),
    booleanOptions: PropTypes.arrayOf(PropTypes.object).isRequired,
    selectSatisfied: PropTypes.func.isRequired,
    selectedSatisfied: PropTypes.arrayOf(PropTypes.any).isRequired,
    selectFreshIdea: PropTypes.func.isRequired,
    selectedFreshIdea: PropTypes.arrayOf(PropTypes.any),
    resetFilters: PropTypes.func.isRequired,
    clearSearch: PropTypes.bool.isRequired,
    setClearSearchFalse: PropTypes.func.isRequired,
    defaultSearchValue: PropTypes.string,
    isServicePoint: PropTypes.bool,
};

GlobalFilter.defaultProps = {
    selectedCountries: [],
    selectedLocations: [],
    selectedServiceTypes: [],
    selectedUsers: [],
    selectedServicePoints: [],
    selectedSurveyTypes: [],
    selectedFreshIdea: [],
    defaultSearchValue: "",
    isServicePoint: false,
};
