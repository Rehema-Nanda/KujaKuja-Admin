import React from "react";
import PropTypes from "prop-types";
import {
    Badge, Button, Col, Container, Row, Dropdown, DropdownToggle, DropdownMenu, DropdownItem,
} from "reactstrap";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory, {
    PaginationProvider, SizePerPageDropdownStandalone, PaginationListStandalone,
} from "react-bootstrap-table2-paginator";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import moment from "moment";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import convert from "htmr";

import GlobalFilter from "../globalfilter/GlobalFilter";
import UpdateConfirmationModal from "./UpdateConfirmationModal";
import ServicePointSelectionModal from "./ServicePointSelectionModal";
import LanguageSelectionModal from "./LanguageSelectionModal";
import ConfirmationModal from "../ConfirmationModal";
import AddTagModal from "./AddTagModal";
import SuccessModal from "./SuccessModal";
import LocalFilter from "./LocalFilter";
import DateOptions from "./DateOptions";

import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min.css";
import "react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css";
import "../../index.css";
import "./DataReview.css";
import { StoreContext } from "../../StoreContext";
import { getQueryParamsFromUrl } from "../../helpers/urlFilterParamsHelper";

import DataListParent from "./DataListParent";

const controller = new AbortController();
const { signal } = controller;

const satisfiedFacePath = require("../../img/face_satisfied.svg");
const unsatisfiedFacePath = require("../../img/face_unsatisfied.svg");

export default class DataReviewList extends DataListParent {
    constructor(props) {
        super(props);

        const today = moment.utc().startOf("day");

        this.state = {
            count: 0,
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
            selectedDataFixName: "",
            limit: 100,
            page: 1,
            sort: {
                by: "createdAt",
                order: "desc",
            },
            selectedDateOption: DateOptions.CREATED_AT,
            selectedUserLocations: [],
            selectedResponseIds: [],
            responsesToUpdate: [],
            isUpdateDropdownOpen: false,
            isServicePointSelectionModalOpen: false,
            isLanguageSelectionModalOpen: false,
            isUpdateConfirmationModalOpen: false,
            isSuccessModalOpen: false,
            selectedForUpdate: {
                columnName: "",
                name: "",
                value: {},
            },
            clearSearch: false,
            servicePointsToDisplay: [],
            servicePointSearchTerm: "",
            tags: [],
            isAddTagModalOpen: false,
            selectedResponseIdForTagging: "",
            responseTag: "",
            isLoading: false,
            isTagging: false,
            filteredTags: [],
            isDeleteTagConfirmationModalOpen: false,
            responseIdToDelete: "",
            tagToDelete: "",
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
        this.toggleUpdateDropdown = this.toggleUpdateDropdown.bind(this);
        this.toggleAddTagModal = this.toggleAddTagModal.bind(this);
        this.toggleDeleteTagConfirmationModal = this.toggleDeleteTagConfirmationModal.bind(this);
    }

    ////////////////////////////////////////
    // lifecycle methods
    ////////////////////////////////////////

    async componentDidMount() {
        const queryParams = getQueryParamsFromUrl();
        const {
            selectedCountries, selectedLocations, selectedServiceTypes, selectedServicePoints, dateStart,
            dateEnd, selectedUsers, searchString, selectedSurveyTypes, selectedSatisfied, selectedFreshIdea,
        } = this.state;
        const { location, history } = this.props;
        const filterState = {
            selectedCountries,
            selectedLocations,
            selectedServiceTypes,
            selectedServicePoints,
            dateStart,
            dateEnd,
            searchString,
            selectedSurveyTypes,
            selectedSatisfied,
            selectedFreshIdea,
            selectedUsers,
        };

        if (Object.entries(queryParams).length > 0) {
            const updateFilterStateRes = this.updateFilterState(queryParams); // update global filter state
            const updateLocalStateRes = this.updateLocalStateFromQueryParams(queryParams); // update local state

            // if state was NOT updated, this is a user visiting the page containing default query params
            // in this case, retrieve all tags
            if (!updateFilterStateRes && !updateLocalStateRes) {
                await this.getTags();
            }
        }
        else {
            await this.getTags();
            this.pushHistoryIfRequired(filterState, location, history);
        }
    }

    async componentDidUpdate(prevProps, prevState) {
        const {
            refreshData, selectedCountries, selectedLocations, selectedServiceTypes, selectedServicePoints, dateStart,
            dateEnd, selectedUsers, searchString, selectedSurveyTypes, selectedSatisfied, selectedFreshIdea,
        } = this.state;
        const { location, history } = this.props;
        const { servicePointStore: { servicePoints } } = this.context;
        const queryParams = getQueryParamsFromUrl();
        const filterState = {
            selectedCountries,
            selectedLocations,
            selectedServiceTypes,
            selectedServicePoints,
            dateStart,
            dateEnd,
            searchString,
            selectedSurveyTypes,
            selectedSatisfied,
            selectedFreshIdea,
            selectedUsers,
        };

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
                this.pushHistoryIfRequired(filterState, location, history);
            }
        }

        if (prevState.servicePointsToDisplay !== servicePoints) {
            this.setState({
                servicePointsToDisplay: servicePoints,
                servicePointSearchTerm: "",
            });
        }
    }

    setData(name, value) {
        this.setState(
            {
                [name]: value,
            },
        );
    }

    fetchData = async (refresh = false) => {
        const {
            selectedDateOption, dateStart, dateEnd, selectedServiceTypes, selectedCountries, selectedLocations,
            selectedServicePoints, searchString, selectedUsers, selectedSurveyTypes, selectedSatisfied,
            selectedFreshIdea, limit, page, sort, selectedUserLocations,
        } = this.state;
        const { myDataStore } = this.context;

        const dateFilter = selectedDateOption === DateOptions.uploadedAt
            ? {
                uploaded_at_start_date: dateStart.format("YYYY-MM-DD"),
                uploaded_at_end_date: this.getDateEndForExclusiveQuery(dateEnd).format("YYYY-MM-DD"),
            }
            : {
                start: dateStart.format("YYYY-MM-DD"),
                end: this.getDateEndForExclusiveQuery(dateEnd).format("YYYY-MM-DD"),
            };

        const reqData = {
            ...dateFilter,
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
            sort: { ...sort, by: "created_at" },
            user_locations: selectedUserLocations,
        };

        const config = {
            data: reqData,
            signal: signal,
        };
        if (!myDataStore.responsesNonSyndicated || myDataStore.responsesNonSyndicated.length === 0 || refresh) {
            this.setState({ isLoading: true });
            await myDataStore.fetchMydata(config);
            this.setState(
                {
                    refreshData: false,
                    isLoading: false,
                },
            );
        }
    };

    getTags = async () => {
        const { myDataStore } = this.context;
        this.setState({ isLoading: true });
        const tags = await myDataStore.apiService.fetchAllTags();
        this.setState({
            tags: tags,
            filteredTags: tags,
            isLoading: false,
        });
    }

    handleRowSelect = (row) => {
        const { selectedResponseIds, responsesToUpdate } = this.state;
        const { myDataStore: { responsesNonSyndicated } } = this.context;

        if (selectedResponseIds.indexOf(row.id) === -1) {
            const selectedResponse = responsesNonSyndicated.find((response) => {
                return response.id === row.id;
            });

            this.setState((prevState) => {
                return {
                    selectedResponseIds: [...prevState.selectedResponseIds, row.id],
                    responsesToUpdate: [...prevState.responsesToUpdate, selectedResponse],
                };
            });
        }
        else {
            const array = [...selectedResponseIds];
            const index = array.indexOf(row.id);
            array.splice(index, 1);

            const validResponses = responsesToUpdate.filter((response) => {
                return row.id !== response.id;
            });

            this.setState(
                {
                    selectedResponseIds: array,
                    responsesToUpdate: validResponses,
                },
            );
        }
    };

    handleRowSelectAll = (isSelected) => {
        const { myDataStore: { responsesNonSyndicated } } = this.context;
        const responseIds = responsesNonSyndicated.map((response) => {
            return response.id;
        });

        if (isSelected) {
            this.setState({
                selectedResponseIds: responseIds,
                responsesToUpdate: responsesNonSyndicated,
            });
        }
        else {
            this.setState({
                selectedResponseIds: [],
                responsesToUpdate: [],
            });
        }
    };

    isUpdateButtonDisabled = () => {
        const { selectedResponseIds } = this.state;
        return selectedResponseIds.length < 1;
    };

    toggleUpdateConfirmationModal = () => {
        const { isUpdateConfirmationModalOpen } = this.state;
        this.setState({
            isUpdateConfirmationModalOpen: !isUpdateConfirmationModalOpen,
            isServicePointSelectionModalOpen: false,
            isLanguageSelectionModalOpen: false,
        });
    };

    openSuccessConfirmationModal = () => {
        this.setState({
            isSuccessModalOpen: true,
        });
    };

    closeSuccessConfirmationModal = () => {
        this.closeAllModalsAndResetDatafixAction();
        this.resetSelectedResponses();
        this.toggleRefresh();
    };

    toggleServicePointSelectionModal = () => {
        const { isServicePointSelectionModalOpen, responsesToUpdate } = this.state;
        const firstServicePoint = responsesToUpdate[0].service_oint;
        const isEqual = responsesToUpdate.every((response) => {
            return response.service_oint === firstServicePoint;
        });

        if (isEqual) {
            this.setState({
                servicePointSearchTerm: "",
                isServicePointSelectionModalOpen: !isServicePointSelectionModalOpen,
            });
        }
        else {
            toast.error("Selected responses must have the same service point!");
        }
    };

    toggleLanguageSelectionModal = () => {
        const { isLanguageSelectionModalOpen, responsesToUpdate } = this.state;
        const firstIdeaLang = responsesToUpdate[0].idea_language;
        const isEqual = responsesToUpdate.every((response) => {
            return response.idea_language === firstIdeaLang;
        });

        if (isEqual) {
            this.setState({ isLanguageSelectionModalOpen: !isLanguageSelectionModalOpen });
        }
        else {
            toast.error("Selected responses must have the same idea language!");
        }
    }

    closeUpdateConfirmationModalAndOpenPreviousModal = (previousModal) => {
        this.setState({ isUpdateConfirmationModalOpen: false });
        if (previousModal === "servicePoint") {
            this.setState({ isServicePointSelectionModalOpen: true });
        }
        if (previousModal === "ideaLanguage") {
            this.setState({ isLanguageSelectionModalOpen: true });
        }
    };

    handleServicePointSelect = (selectedItemId) => {
        const { servicePointStore: { servicePoints } } = this.context;
        const selectedItem = servicePoints.find((item) => {
            return item.id === selectedItemId.toString();
        });

        if (selectedItem) {
            this.setState({
                selectedForUpdate: {
                    columnName: "servicePoint",
                    name: selectedItem.name,
                    value: {
                        new_service_point_id: selectedItem.id,
                        action: "change_service_point",
                    },
                },
                selectedDataFixName: "Service Point",
            });
        }
        this.toggleUpdateConfirmationModal();
    };

    handleLanguageSelect = (selectedItem) => {
        this.setState({
            selectedForUpdate: {
                columnName: "ideaLanguage",
                name: selectedItem.value,
                value: {
                    new_idea_lang: selectedItem.value,
                    action: "change_idea_language",
                },
            },
            selectedDataFixName: "Idea Language",
        });

        this.toggleUpdateConfirmationModal();
    };

    updateResponses = async () => {
        const { selectedResponseIds, selectedForUpdate } = this.state;
        const { myDataStore } = this.context;

        try {
            const reqData = {
                ...selectedForUpdate.value,
                response_ids: selectedResponseIds.map((id) => {
                    return parseInt(id, 10);
                }),
            };

            const config = {
                data: reqData,
            };
            this.setState({ isLoading: true });
            await myDataStore.apiService.updateResponses(config);
            this.setState({ isLoading: false });
            this.openSuccessConfirmationModal();
        }
        catch (err) {
            this.setState({ isLoading: false });
            const errorMessage = err.error ? err.error : "Something went wrong";
            toast.error(errorMessage);
        }
    };

    setTagToState = (e) => {
        const tag = e.target.value.replace(/[\s#]/g, ""); // removes spaces and # from tag
        this.setState({ responseTag: tag });
    }

    tagResponse = async () => {
        const { myDataStore } = this.context;
        const { selectedResponseIdForTagging, responseTag } = this.state;

        if (!selectedResponseIdForTagging || !responseTag) {
            toast.error("Missing tag and/or response");
            return;
        }

        try {
            const config = {
                data: {
                    response_id: parseInt(selectedResponseIdForTagging, 10),
                    tag: responseTag,
                },
            };

            this.setState({ isTagging: true });
            await myDataStore.apiService.tagResponses(config);
            await this.getTags();
            this.setState({
                isTagging: false,
                isAddTagModalOpen: false,
                refreshData: true,
                selectedResponseIdForTagging: "",
                responseTag: "",
            });
            toast.success("Response tagged successfully.");
        }
        catch (err) {
            const errorMessage = err.error ? err.error : "Something went wrong";
            toast.error(errorMessage);
            this.setState({ isTagging: false });
        }
    }

    searchTags = (e) => {
        const { tags } = this.state;
        const tagSearchTerm = e.target.value.replace(/[#]/g, ""); // removes all # from tag search term
        const searchResults = tags.filter((tag) => tag.name.includes(tagSearchTerm));
        this.setState({ filteredTags: searchResults });
    }

    toggleDeleteTagConfirmationModal = () => {
        const { isDeleteTagConfirmationModalOpen } = this.state;

        this.setState({
            isDeleteTagConfirmationModalOpen: !isDeleteTagConfirmationModalOpen,
        });
    }

    setTagToDeleteToStateAndToggleDeleteConfirmationModal = (responseId, tag) => {
        this.setState({
            responseIdToDelete: responseId,
            tagToDelete: tag,
        });
        this.toggleDeleteTagConfirmationModal();
    }

    deleteTag = async () => {
        const { myDataStore } = this.context;
        const { responseIdToDelete, tagToDelete } = this.state;

        try {
            await myDataStore.apiService.deleteTag(responseIdToDelete, tagToDelete);
            await this.getTags();
            this.setState({ refreshData: true });
            this.toggleDeleteTagConfirmationModal();
            toast.success(`Tag #${tagToDelete} deleted successfully`);
        }
        catch (err) {
            this.toggleDeleteTagConfirmationModal();
            const errorMessage = err.error ? err.error : `Error: #${tagToDelete} was added by tag filter`;
            toast.error(errorMessage);
        }
    }

    closeAllModalsAndResetDatafixAction = () => {
        this.setState({
            isSuccessModalOpen: false,
            isUpdateConfirmationModalOpen: false,
            isServicePointSelectionModalOpen: false,
            isLanguageSelectionModalOpen: false,
            selectedForUpdate: {
                columnName: "",
                name: "",
                value: {},
            },
            servicePointSearchTerm: "",
        });
    };

    resetSelectedResponses = () => {
        this.setState({
            selectedResponseIds: [],
            responsesToUpdate: [],
        });
    };

    handleLocalFilterDateOptionSelect = (e) => {
        this.setState({
            selectedDateOption: e.target.value,
            refreshData: true,
        });
    };

    handleUserLocationChange = (e) => {
        const { selectedUserLocations } = this.state;
        const locationId = e.target.value.toString();

        const previousState = [].concat(selectedUserLocations);

        if (previousState.indexOf(locationId) === -1) {
            previousState.push(locationId);
        }
        else {
            const index = previousState.indexOf(locationId);
            previousState.splice(index, 1);
        }

        this.setState({
            selectedUserLocations: previousState,
            refreshData: true,
        });
    };

    handleCreatedAtChange = () => {
        const { responsesToUpdate } = this.state;

        const firstUploadedAt = moment(responsesToUpdate[0].uploadedAt);

        const isEqual = responsesToUpdate.every((response) => {
            return moment(response.uploadedAt).isSame(firstUploadedAt, "day");
        });
        if (isEqual) {
            this.setState({
                selectedForUpdate: {
                    columnName: "createdAt",
                    name: firstUploadedAt,
                    value: {
                        action: "reset_date_to_uploaded",
                    },
                },
                selectedDataFixName: "Date",
            });
            this.toggleUpdateConfirmationModal();
        }
        else {
            toast.error("Selected responses must have been uploaded on the same day!");
        }
    };

    noDataIndication = () => {
        const { isLoading } = this.state;
        const { myDataStore: { countNonSyndicated } } = this.context;

        if (isLoading) {
            return "Loading data ...";
        }
        else if (countNonSyndicated === 0) {
            return "No Data";
        }

        return "";
    };

    setServicePointsToDisplay = (servicePoints) => {
        this.setState({
            servicePointsToDisplay: servicePoints,
        });
    };

    setServicePointSearchTerm = (searchTerm) => {
        this.setState({
            servicePointSearchTerm: searchTerm,
        });
    };

    handleServicePointSearch = (e) => {
        const { servicePointStore: { servicePoints } } = this.context;
        const spSearchTerm = e.target.value;
        const lowerCasedSearchTerm = spSearchTerm.toLowerCase();
        const results = servicePoints.filter((item) => {
            return item.name.toLowerCase().includes(lowerCasedSearchTerm);
        });
        this.setServicePointsToDisplay(results);
        this.setServicePointSearchTerm(spSearchTerm);
    }

    toggleUpdateDropdown() {
        this.setState((prevState) => {
            return {
                isUpdateDropdownOpen: !prevState.isUpdateDropdownOpen,
            };
        });
    }

    toggleAddTagModal(responseId) {
        this.setState((prevState) => {
            return {
                selectedResponseIdForTagging: responseId,
                isAddTagModalOpen: !prevState.isAddTagModalOpen,
            };
        });
    }

    render() {
        const {
            page, limit, selectedResponseIds, selectedCountries, selectedLocations,
            selectedServiceTypes, selectedServicePoints, selectedUsers, selectedSurveyTypes, selectedDateOption,
            selectedSatisfied, selectedFreshIdea, dateStart, dateEnd, selectedUserLocations, isUpdateDropdownOpen,
            isUpdateConfirmationModalOpen, responsesToUpdate, selectedForUpdate, isServicePointSelectionModalOpen,
            isLanguageSelectionModalOpen, isSuccessModalOpen, selectedDataFixName, clearSearch, servicePointsToDisplay,
            servicePointSearchTerm, searchString, isAddTagModalOpen, responseTag, isLoading, isTagging,
            filteredTags, isDeleteTagConfirmationModalOpen,
        } = this.state;

        const { surveyTypes, booleanOptions } = this.props;
        const {
            locationStore, servicePointStore, serviceTypeStore, userStore, countryStore,
            myDataStore: { responsesNonSyndicated, countNonSyndicated },
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
                formatter: (cellContent, row) => {
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
                formatter: (cellContent) => {
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
                dataField: "userLocation",
                text: "User Location",
                sort: true,
                headerClasses: "col-location",
                classes: "col-location",
            },
            {
                dataField: "createdAt",
                text: "Created At",
                sort: true,
                formatter: (cellContent) => {
                    const dt = moment(cellContent);
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
                dataField: "uploadedAt",
                text: "Uploaded At",
                sort: true,
                formatter: (cellContent) => {
                    const dt = moment(cellContent);
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
                                    <span className="tagItem">
                                        <Button key={tag} type="button" className="tag" value={`#${tag}`} onClick={this.tagSearch}>
                                            {`#${tag}`}
                                        </Button>
                                        <FontAwesomeIcon icon={faTrash} className="tagIcon" onClick={() => {this.setTagToDeleteToStateAndToggleDeleteConfirmationModal(row.id, tag)}} />
                                        &nbsp;
                                    </span>
                                );
                            })}
                        </div>
                    );
                },
            },
            {
                dataField: "ideaLanguage",
                text: "Idea Language",
                headerClasses: "col-idea-lang",
                classes: "col-idea-lang",
            },
            {
                dataField: "df1",
                text: "",
                isDummyField: true,
                headerFormatter: () => {
                    if (countNonSyndicated === 0) {
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
                            {Math.min(page * limit, countNonSyndicated)}
                            {" "}
                            of
                            <br />
                            {countNonSyndicated}
                            {" "}
                            results
                        </span>
                    );
                },
                formatter: (cellContent, row) => {
                    return (
                        <div>
                            <Button
                                color="primary"
                                className="primary"
                                onClick={() => {
                                    this.viewRow(row);
                                }}
                            >
                                View
                            </Button>
                            <Button
                                color="secondary"
                                className="secondary"
                                onClick={() => {
                                    this.toggleAddTagModal(row.id);
                                }}
                            >
                                <FontAwesomeIcon icon={faPlus} />
                                &nbsp;Tag
                            </Button>
                        </div>
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
                totalSize: countNonSyndicated,
                sizePerPage: limit,
                sizePerPageList: [
                    { text: "25", value: 25 },
                    { text: "50", value: 50 },
                    { text: "100", value: 100 },
                    { text: "250", value: 250 },
                    { text: "500", value: 500 },
                ],
            },
        );

        const selectRowProp = {
            mode: "checkbox",
            bgColor: "#fdca3c",
            clickToSelect: false,
            onSelect: this.handleRowSelect,
            onSelectAll: this.handleRowSelectAll,
            selected: selectedResponseIds,
        };

        return (
            <ToolkitProvider
                keyField="id"
                data={responsesNonSyndicated || []}
                columns={columns}
                bootstrap4
            >
                {
                    (props) => {
                        return (
                            <div className="page">
                                <div className="title-background-parent">
                                    <div className="title-background-shape" />
                                </div>

                                <Container fluid className="desktop-non-fluid">
                                    <Row>
                                        <Col>
                                            <h1 className="left">Data Review</h1>
                                            <p>Quickly view, analyze and fix raw data</p>
                                        </Col>
                                        <Col>
                                            <div className="bulk-update-button">
                                                <Dropdown isOpen={isUpdateDropdownOpen} toggle={this.toggleUpdateDropdown}>
                                                    <DropdownToggle caret color="primary" className="primary" disabled={this.isUpdateButtonDisabled()}>
                                                        Fix Data (
                                                        {selectedResponseIds.length}
                                                        )
                                                    </DropdownToggle>
                                                    <DropdownMenu>
                                                        <DropdownItem onClick={this.toggleServicePointSelectionModal} className="bulk-update-dropdown">
                                                            <span className="bulk-update-dropdown-title">
                                                                Fix Service Point
                                                            </span>
                                                            {" "}
                                                            <br />
                                                            <div className="bulk-update-dropdown-content">
                                                                <span className="bulk-update-dropdown-content-left">
                                                                    Batch update responses with the wrong location
                                                                </span>
                                                                <span className="bulk-update-dropdown-content-right">
                                                                    <FontAwesomeIcon icon={faArrowRight} />
                                                                </span>
                                                            </div>
                                                        </DropdownItem>
                                                        <DropdownItem onClick={this.handleCreatedAtChange} className="bulk-update-dropdown">
                                                            <span className="bulk-update-dropdown-title">
                                                                Fix Date
                                                            </span>
                                                            {" "}
                                                            <br />
                                                            <div className="bulk-update-dropdown-content">
                                                                <span className="bulk-update-dropdown-content-left">
                                                                    Batch update responses with the wrong date
                                                                </span>
                                                                <span className="bulk-update-dropdown-content-right">
                                                                    <FontAwesomeIcon icon={faArrowRight} />
                                                                </span>
                                                            </div>
                                                        </DropdownItem>
                                                        <DropdownItem onClick={this.toggleLanguageSelectionModal} className="bulk-update-dropdown">
                                                            <span className="bulk-update-dropdown-title">
                                                                Fix Idea Language
                                                            </span>
                                                            {" "}
                                                            <br />
                                                            <div className="bulk-update-dropdown-content">
                                                                <span className="bulk-update-dropdown-content-left">
                                                                    Batch update responses with the wrong language
                                                                </span>
                                                                <span className="bulk-update-dropdown-content-right">
                                                                    <FontAwesomeIcon icon={faArrowRight} />
                                                                </span>
                                                            </div>
                                                        </DropdownItem>
                                                    </DropdownMenu>
                                                </Dropdown>
                                            </div>
                                        </Col>
                                    </Row>
                                </Container>

                                <Container fluid className="desktop-non-fluid">
                                    <Row>
                                        <Col>
                                            <GlobalFilter
                                                countries={countryStore.enabledCountries}
                                                locations={locationStore.locations}
                                                servicePoints={servicePointStore.servicePoints}
                                                serviceTypes={serviceTypeStore.serviceTypes}
                                                users={userStore.users}
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
                                    <div className="daily-review-page white-page-bg">
                                        <Row>
                                            <LocalFilter
                                                handleLocalFilterDateOptionSelect={this.handleLocalFilterDateOptionSelect}
                                                selectedDateOption={selectedDateOption}
                                                locations={locationStore.locations}
                                                handleUserLocationChange={this.handleUserLocationChange}
                                                selectedUserLocations={selectedUserLocations}
                                            />
                                        </Row>
                                        <hr />
                                        {responsesNonSyndicated && (
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
                                                                    selectRow={selectRowProp}
                                                                    striped
                                                                    hover
                                                                    remote
                                                                    onTableChange={this.handleTableChange}
                                                                    bordered={false}
                                                                    noDataIndication={this.noDataIndication}
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
                                    </div>
                                </Container>

                                <UpdateConfirmationModal
                                    responses={responsesToUpdate}
                                    isOpen={isUpdateConfirmationModalOpen}
                                    toggle={this.closeAllModalsAndResetDatafixAction}
                                    goBack={this.closeUpdateConfirmationModalAndOpenPreviousModal}
                                    selectedForUpdate={selectedForUpdate}
                                    updateResponses={this.updateResponses}
                                    isLoading={isLoading}
                                />

                                <SuccessModal
                                    isOpen={isSuccessModalOpen}
                                    fixedDataName={selectedDataFixName}
                                    numberOfFixedResponses={responsesToUpdate.length}
                                    toggle={this.closeSuccessConfirmationModal}
                                />

                                <ServicePointSelectionModal
                                    isOpen={isServicePointSelectionModalOpen}
                                    toggle={this.toggleServicePointSelectionModal}
                                    responsesToUpdate={responsesToUpdate}
                                    selectedForUpdate={selectedForUpdate}
                                    handleServicePointSelect={this.handleServicePointSelect}
                                    servicePointsToDisplay={servicePointsToDisplay}
                                    servicePointSearchTerm={servicePointSearchTerm}
                                    handleServicePointSearch={this.handleServicePointSearch}
                                />

                                <LanguageSelectionModal
                                    isOpen={isLanguageSelectionModalOpen}
                                    toggle={this.toggleLanguageSelectionModal}
                                    responsesToUpdate={responsesToUpdate}
                                    selectedForUpdate={selectedForUpdate}
                                    handleLanguageSelect={this.handleLanguageSelect}
                                />

                                <AddTagModal
                                    isOpen={isAddTagModalOpen}
                                    toggle={this.toggleAddTagModal}
                                    tags={filteredTags}
                                    tagResponse={this.tagResponse}
                                    setTagToState={this.setTagToState}
                                    selectedTag={responseTag}
                                    isTagging={isTagging}
                                    searchTags={this.searchTags}
                                />

                                <ConfirmationModal
                                    isOpen={isDeleteTagConfirmationModalOpen}
                                    toggle={this.toggleDeleteTagConfirmationModal}
                                    buttonFunction={this.deleteTag}
                                />
                            </div>
                        );
                    }
                }
            </ToolkitProvider>
        );
    }
}

DataReviewList.contextType = StoreContext;

DataReviewList.propTypes = {
    surveyTypes: PropTypes.arrayOf(PropTypes.object),
    booleanOptions: PropTypes.arrayOf(PropTypes.object),
    history: PropTypes.objectOf(PropTypes.any).isRequired,
    location: PropTypes.objectOf(PropTypes.any).isRequired,
};

DataReviewList.defaultProps = {
    surveyTypes: [],
    booleanOptions: [],
};
