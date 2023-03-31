import React from "react";
import {
    Badge, Button, Col, Container, Row,
} from "reactstrap";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory, {
    PaginationProvider, SizePerPageDropdownStandalone, PaginationListStandalone,
} from "react-bootstrap-table2-paginator";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import moment from "moment";
import PropTypes from "prop-types";
import convert from "htmr";

import { observer } from "mobx-react";
import GlobalFilter from "./globalfilter/GlobalFilter";

import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min.css";
import "react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css";
import "../index.css";
import "./MyData.css";
import { StoreContext } from "../StoreContext";
import DataListParent from "./data_review/DataListParent";
import { getQueryParamsFromUrl } from "../helpers/urlFilterParamsHelper";

const controller = new AbortController();
const { signal } = controller;

const satisfiedFacePath = require("../img/face_satisfied.svg");
const unsatisfiedFacePath = require("../img/face_unsatisfied.svg");

class MyData extends DataListParent {
    constructor(props) {
        super(props);

        const today = moment.utc().startOf("day");

        this.state = {
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
            refreshData: false,
            searchString: "",
            limit: 100,
            page: 1,
            profile: null,
            sort: {
                by: "createdAt",
                order: "desc",
            },
            clearSearch: false,
        };

        this.setData = this.setData.bind(this);
        this.selectLocation = this.selectLocation.bind(this);
        this.selectUser = this.selectUser.bind(this);
        this.selectSurveyType = this.selectSurveyType.bind(this);
        this.selectSatisfied = this.selectSatisfied.bind(this);
        this.selectFreshIdea = this.selectFreshIdea.bind(this);
        this.setDateStartEnd = this.setDateStartEnd.bind(this);
        this.getDateEndForExclusiveQuery = this.getDateEndForExclusiveQuery.bind(this);
        this.toggleServiceType = this.toggleServiceType.bind(this);
        this.toggleRefresh = this.toggleRefresh.bind(this);
        this.viewRow = this.viewRow.bind(this);
        this.handleTableChange = this.handleTableChange.bind(this);
    }

    ////////////////////////////////////////
    // lifecycle methods
    ////////////////////////////////////////

    async componentDidMount() {
        const queryParams = getQueryParamsFromUrl();

        if (Object.entries(queryParams).length > 0) {
            this.updateFilterState(queryParams); // update global filter state
            this.updateLocalStateFromQueryParams(queryParams); // update local state
        }
        else {
            this.pushHistoryIfRequired();
        }
    }

    async componentDidUpdate(prevProps, prevState) {
        const {
            refreshData, profile, selectedCountries, selectedLocations, selectedServiceTypes,
            selectedServicePoints, dateStart, dateEnd, selectedUsers, searchString,
        } = this.state;
        const { userStore: { userInfo, apiService: { isAuthenticated } } } = this.context;
        const { location } = this.props;

        const queryParams = getQueryParamsFromUrl();

        if (refreshData !== prevState.refreshData && refreshData) {
            if (!profile && isAuthenticated()) {
                const userProfile = userInfo.length > 0 && userInfo[0];
                userProfile && this.setState(
                    {
                        profile: { ...userProfile },
                        selectedLocations: userProfile.isAdmin
                        || userProfile.isServiceProvider ? [] : [userProfile.settlementId],
                        selectedUsers: userProfile.isAdmin || userProfile.isServiceProvider ? [] : [userProfile.id],
                    }, async () => {
                        await this.fetchData(refreshData);
                    },
                );
            }
            else {
                await this.fetchData(refreshData);
            }
        }

        if (
            (refreshData && (
                refreshData !== prevState.refreshData
                || dateStart !== prevState.dateStart
                || dateEnd !== prevState.dateEnd
                || selectedCountries !== prevState.selectedCountries
                || selectedLocations !== prevState.selectedLocations
                || selectedServiceTypes !== prevState.selectedServiceTypes
                || selectedServicePoints !== prevState.selectedServicePoints
                || searchString !== prevState.searchString
                || location.search !== prevProps.location.search
                || selectedUsers !== prevState.selectedUsers
            ))
        ) {
            await this.fetchData(refreshData);

            if (location.search !== prevProps.location.search) {
                if (Object.entries(queryParams).length > 0) {
                    this.updateFilterState(queryParams); // update global filter state
                    this.updateLocalStateFromQueryParams(queryParams); // update local state
                }
            }
            else {
                this.pushHistoryIfRequired();
            }
        }
    }

    fetchData = async (refresh = false) => {
        const {
            dateStart, dateEnd, selectedServiceTypes, selectedCountries, selectedLocations, selectedServicePoints,
            searchString, selectedUsers, selectedSurveyTypes, selectedSatisfied, selectedFreshIdea, limit, page,
            sort,
        } = this.state;
        const { myDataStore } = this.context;

        const mapSortName = {
            isStarred: "is_starred",
            createdAt: "created_at",
            serviceType: "service_type",
            servicePoint: "service_point",
            location: "location",
            user: "user",
            userLocation: "user_location",
            uploadedAt: "uploaded_at",
        };
        const reqData = {
            start: dateStart.format("YYYY-MM-DD"),
            end: this.getDateEndForExclusiveQuery(dateEnd).format("YYYY-MM-DD"),
            types: selectedServiceTypes,
            countries: selectedCountries,
            settlements: selectedLocations,
            points: selectedServicePoints,
            keyword: searchString,
            users: selectedUsers,
            response_types: selectedSurveyTypes,
            satisfied: selectedSatisfied,
            is_starred: selectedFreshIdea,
            limit: limit,
            page: page,
            sort: { ...sort, by: mapSortName[sort.by] },
        };

        const config = {
            data: reqData,
            signal: signal,
        };

        if (!myDataStore.responses || myDataStore.responses.length === 0 || refresh) {
            await myDataStore.fetchMydata(config);
            this.setState({ refreshData: false });
        }
    };

    render() {
        const {
            page, limit, selectedCountries, selectedLocations, selectedServiceTypes,
            selectedServicePoints, selectedUsers, selectedSurveyTypes, selectedSatisfied, selectedFreshIdea,
            dateStart, dateEnd, searchString,
        } = this.state;
        const { surveyTypes, booleanOptions } = this.props;
        const {
            locationStore, servicePointStore, serviceTypeStore, userStore, countryStore, myDataStore: { responses, count, isLoading },
        } = this.context;
        const columns = [
            {
                dataField: "id",
                text: "ID",
                sort: true,
                headerClasses: "col-id",
                classes: "col-id",
                hidden: true,
            },
            {
                dataField: "satisfied",
                text: "",
                sort: true,
                formatExtraData: [satisfiedFacePath, unsatisfiedFacePath],
                formatter: (cellContent, row, rowIdx, formatExtraData) => {
                    const [satisfiedFacePath, unsatisfiedFacePath] = formatExtraData;
                    return (
                        row.satisfied ? <img width="24" src={satisfiedFacePath} alt="satisfied" /> : <img width="24" src={unsatisfiedFacePath} alt="unsatisfied" />
                    );
                },
                headerClasses: "col-satisfied",
                classes: "col-satisfied",
            },
            {
                dataField: "isStarred",
                text: "Fresh Idea",
                sort: true,
                formatter: (cellContent, row, rowIdx, formatExtraData) => {
                    return (
                        row.is_starred ? <Badge color="primary">Yes</Badge> : <Badge color="secondary">No</Badge>
                    );
                },
                headerClasses: "col-is-starred",
                classes: "col-is-starred",
            },
            {
                dataField: "serviceType",
                text: "Service Type",
                sort: true,
                headerClasses: "col-service-type",
                classes: "col-service-type",
            },
            {
                dataField: "location",
                text: "Location",
                sort: true,
                headerClasses: "col-location",
                classes: "col-location",
            },
            {
                dataField: "servicePoint",
                text: "Service Point",
                sort: true,
                headerClasses: "col-service-point",
                classes: "col-service-point",
                formatter: (cellContent, row, rowIdx, formatExtraData) => {
                    return (
                        <span>
                            {cellContent}
                            {" "}
                            <em>
                                (
                                {row.location}
                                )
                            </em>
                        </span>
                    );
                },
            },
            {
                dataField: "user",
                text: "User",
                sort: true,
                formatter: (cellContent, row, rowIdx, formatExtraData) => {
                    if (cellContent) {
                        const parts = cellContent.split("@", 2);
                        if (parts.length === 1) {
                            return (parts);
                        }
                        return (
                            <span>
                                {parts[0]}
                                <br />
                                @
                                {parts[1]}
                            </span>
                        );
                    }
                },
                headerClasses: "col-user",
                classes: "col-user",
                title: true,
            },
            {
                dataField: "createdAt",
                text: "Date",
                sort: true,
                formatter: (cellContent, row, rowIdx, formatExtraData) => {
                    let dt = moment(cellContent);
                    return (
                        <span>
                            {dt.format("MMM D")}
                            <br />
                            {dt.format("HH:mm")}
                        </span>
                    );
                },
                headerClasses: "col-created-at",
                classes: "col-created-at",
            },
            {
                dataField: "idea",
                text: "Idea",
                headerClasses: "col-idea",
                classes: "col-idea",
                formatter: (cellContent, row) => {
                    return (
                        <div>
                            {convert(cellContent || '')}
                            <br />
                            {row.tags && row.tags.split(",").map((tag) => {
                                return (
                                    <Button key={tag} type="button" className="tag" value={`#${tag}`} onClick={this.tagSearch}>
                                        {`#${tag}`}
                                    </Button>
                                );
                            })}
                        </div>
                    );
                },
            },
            {
                dataField: "df1",
                text: "",
                isDummyField: true,
                headerFormatter: () => {
                    if (count === 0) {
                        return ("No results");
                    }
                    return (
                        <span>
                            Showing
                            <br />
                            {(page - 1) * limit + 1}
                            {" "}
                            to
                            {" "}
                            {Math.min(page * limit, count)}
                            {" "}
                            of
                            <br />
                            {count}
                            {" "}
                            results
                        </span>
                    );
                },
                formatter: (cellContent, row, rowIdx, formatExtraData) => {
                    return (
                        <Button color="primary" className="primary" onClick={() => this.viewRow(row)}>View</Button>
                    );
                },
                headerClasses: "col-df1",
                classes: "col-df1",
                csvExport: false,
            },
        ];

        const defaultSorted = [
            {
                dataField: "createdAt",
                order: "desc",
            },
        ];

        const pagination = paginationFactory(
            {
                custom: true,
                page: page,
                totalSize: count,
                sizePerPage: limit,
                sizePerPageList: [
                    { text: "25", value: 25 },
                    { text: "50", value: 50 },
                    { text: "100", value: 100 },
                    { text: "250", value: 250 },
                    { text: "500", value: 500 },
                    // { text: 'ALL', value: this.state.count }
                ],
            },
        );
        const { clearSearch } = this.state;

        return (
            <ToolkitProvider
                keyField="id"
                data={responses}
                columns={columns}
                bootstrap4
            >
                {
                    (props) => (
                        <div className="page">

                            <div className="title-background-parent">
                                <div className="title-background-shape" />
                            </div>

                            <Container fluid className="desktop-non-fluid">
                                <Row>
                                    <Col>
                                        <h1 className="left">My Data</h1>
                                        <p>Quickly view, analyze and export raw data</p>
                                    </Col>
                                </Row>
                            </Container>

                            <Container fluid className="desktop-non-fluid">
                                <Row>
                                    <Col>
                                        <GlobalFilter
                                            countries={countryStore.enabledCountries}
                                            locations={locationStore.locationsSyndicated}
                                            servicePoints={servicePointStore.servicePointsSyndicated}
                                            serviceTypes={serviceTypeStore.serviceTypes}
                                            users={userStore.usersSyndicated}
                                            surveyTypes={surveyTypes}
                                            booleanOptions={booleanOptions}
                                            selectedCountries={selectedCountries}
                                            selectedLocations={selectedLocations}
                                            selectedServiceTypes={selectedServiceTypes}
                                            selectedServicePoints={selectedServicePoints}
                                            selectedUsers={selectedUsers}
                                            selectedSurveyTypes={selectedSurveyTypes}
                                            selectedSatisfied={selectedSatisfied}
                                            selectedFreshIdea={selectedFreshIdea}
                                            selectLocation={this.selectLocation}
                                            selectUser={this.selectUser}
                                            selectSurveyType={this.selectSurveyType}
                                            selectSatisfied={this.selectSatisfied}
                                            selectFreshIdea={this.selectFreshIdea}
                                            setDateStartEnd={this.setDateStartEnd}
                                            dateStart={dateStart}
                                            dateEnd={dateEnd}
                                            dateEndForExclusiveQuery={this.getDateEndForExclusiveQuery}
                                            toggleServiceType={this.toggleServiceType}
                                            toggleRefresh={this.toggleRefresh}
                                            setData={this.setData}
                                            resetFilters={this.resetAllFilters}
                                            clearSearch={clearSearch}
                                            setClearSearchFalse={this.setClearSearchFalse}
                                            defaultSearchValue={searchString}
                                            isServicePoint
                                        />
                                    </Col>
                                </Row>
                            </Container>

                            <Container fluid className="desktop-non-fluid">
                                <div className="mydata-page white-page-bg">
                                    <Row>
                                        <Col>
                                            {responses && (
                                                <PaginationProvider
                                                    pagination={pagination}
                                                >
                                                    {
                                                        ({
                                                            paginationProps,
                                                            paginationTableProps,
                                                        }) => {
                                                            return (
                                                                <div>
                                                                    <BootstrapTable
                                                                        {...props.baseProps}
                                                                        {...paginationTableProps}
                                                                        defaultSorted={defaultSorted}
                                                                        striped
                                                                        hover
                                                                        remote
                                                                        onTableChange={this.handleTableChange}
                                                                        bordered={false}
                                                                        noDataIndication={isLoading ? "Loading data ..." : count === 0 ? "No Data" : ""}
                                                                    />
                                                                    <SizePerPageDropdownStandalone
                                                                        {...paginationProps}
                                                                    />
                                                                    <PaginationListStandalone
                                                                        {...paginationProps}
                                                                    />
                                                                </div>
                                                            );
                                                        }
                                                    }
                                                </PaginationProvider>
                                            )}
                                        </Col>
                                    </Row>
                                </div>
                            </Container>

                        </div>
                    )
                }
            </ToolkitProvider>
        );
    }
}

MyData.contextType = StoreContext;

MyData.propTypes = {
    history: PropTypes.objectOf(PropTypes.any).isRequired,
    surveyTypes: PropTypes.arrayOf(PropTypes.object),
    booleanOptions: PropTypes.arrayOf(PropTypes.object),
    location: PropTypes.objectOf(PropTypes.any).isRequired,
};

MyData.defaultProps = {
    surveyTypes: [],
    booleanOptions: [],
};

export default observer(MyData);
