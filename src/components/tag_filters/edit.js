import React from "react";
import PropTypes from "prop-types";
import {
    Container, Row, Col, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Table,
} from "reactstrap";
import { AvForm, AvField } from "availity-reactstrap-validation";
import moment from "moment";
import { toast } from "react-toastify";

import {
    decorate, computed, observable, runInAction,
} from "mobx";
import { observer } from "mobx-react";
import { StoreContext } from "../../StoreContext";
import TagFilter from "../../stores/TagFilter/TagFilter";
import AppConfig from "../../AppConfig";
import BtnRow from "../BtnRow";
import ConfirmationModal from "../ConfirmationModal";

import "../Dashboard.css";
import "../../index.css";
import "../Edit.css";

class TagFilterEdit extends React.PureComponent {
    simpleState = {
        tagFilter: null,
        isDeleteConfirmationModalOpen: false,
        isTagDropdownOpen: false,
        createAndApply: false,
    };

    async componentDidMount() {
        const { match, history } = this.props;
        const { tagFilterStore } = this.context;

        if (match.params.id === "add") {
            runInAction(() => {
                this.simpleState.tagFilter = new TagFilter(tagFilterStore);
                this.simpleState.tagFilter.status = this.simpleState.tagFilter.status || "EDITING";
            });
        }
        else {
            const tagFilter = await tagFilterStore.updateTagFromServer(match.params.id);

            if (!tagFilter) {
                // invalid tag filter, go back to list page
                history.push("/tag_filters");
                return;
            }

            runInAction(() => {
                this.simpleState.tagFilter = tagFilter;
            });
        }
    }

    get elementAction() {
        const { match } = this.props;
        if (match.params.id === "add") {
            return "add";
        }
        return "update";
    }

    canApplyFilter = () => {
        const { tagFilter } = this.simpleState;
        return tagFilter && (tagFilter.status === "EDITING" || tagFilter.status === "ERROR");
    };

    toggleDeleteConfirmationModal = () => {
        runInAction(() => {
            this.simpleState.isDeleteConfirmationModalOpen = !this.simpleState.isDeleteConfirmationModalOpen;
        });
    };

    delete = async () => {
        const { history } = this.props;

        try {
            await this.simpleState.tagFilter.delete();
            toast.success(`Tag: #${this.simpleState.tagFilter.tagText} deleted successfully`);
            history.push("/tag_filters");
        }
        catch {
            this.toggleDeleteConfirmationModal();
            toast.error("Error deleting tag filter");
        }
    };

    toggleCreateAndApplyCheckBox = () => {
        runInAction(() => {
            this.simpleState.createAndApply = !this.simpleState.createAndApply;
        });
    }

    handleFormSubmit = async (event, values) => {
        const { history } = this.props;

        if (!values.start_date) {
            values.start_date = null;
        }

        if (!values.end_date) {
            values.end_date = null;
        }

        if (this.validateDates(values.start_date, values.end_date) === false) {
            return;
        }

        values.tag_text = values.tag_text.replace(/[^0-9a-zA-Z]/g, '');

        const tagFilter = values;

        runInAction(() => {
            this.simpleState.tagFilter.updateFromJson(tagFilter);
        });

        if (this.elementAction !== "add" && tagFilter.status !== "EDITING") {
            toast.error("Undo tag before editing");
            return;
        }

        try {
            await this.simpleState.tagFilter.save();

            if (this.simpleState.createAndApply) {
                await this.runTagFilter(this.simpleState.tagFilter.id, this.simpleState.tagFilter.tagText);
            }

            if (this.elementAction === "add") {
                toast.success(`Tag: #${this.simpleState.tagFilter.tagText} added successfully`);
            }
            else {
                toast.success(`Tag: #${this.simpleState.tagFilter.tagText} updated successfully`);
            }

            history.push("/tag_filters");
        }
        catch {
            toast.error("Error handling tag filter");
        }
    };

    cancelForm = (e) => {
        const { history } = this.props;
        e.preventDefault();
        history.push("/tag_filters");
    };

    toggleTagDropdown = () => {
        runInAction(() => {
            this.simpleState.isTagDropdownOpen = !this.simpleState.isTagDropdownOpen;
        });
    };

    runTagFilter = async (id, tagText) => {
        const { history } = this.props;

        try {
            const { tagFilterStore } = this.context;
            await tagFilterStore.apiService.runTagFilterById(id);
            toast.success(`Tag filter apply process started for: #${tagText}`);
            history.push("/tag_filters");
        }
        catch (e) {
            toast.error("Error applying tag filter");
        }
    };

    undoTagFilterBulkTag = async (id, tagText) => {
        const { history } = this.props;

        try {
            const { tagFilterStore } = this.context;
            await tagFilterStore.apiService.undoTagFilterBulkTagById(id);
            toast.success(`Tag filter undo process started for: #${tagText}`);
            history.push("/tag_filters");
        }
        catch {
            toast.error("Error undoing tag filter");
        }
    };

    handleTextSearchTestButtonClick = () => {
        const val = document.querySelector("#search_text").value;
        const queryParams = {
            keyword: `textsearch:${val}`,
        };
        const searchParams = new URLSearchParams(queryParams);
        const startDate = document.getElementById('start_date').value;
        const endDate = document.getElementById('end_date').value;
        const datesAreValid = this.validateDates(startDate, endDate);
        let linkToIdeaFeed = `${AppConfig.FRONT_END_URL}ideafeed?${searchParams.toString()}`;
        if (datesAreValid === true) {
            linkToIdeaFeed += `&start=${startDate}&end=${endDate}`;
        }
        window.open(
            linkToIdeaFeed,
            "_blank", // <- This is what makes it open in a new window.
        );
    };

    validateDates(startDate, endDate) {
        if (!startDate && !endDate) {
            return undefined;
        }

        const dateRegex = /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/;
        if (!startDate.match(dateRegex) || !endDate.match(dateRegex)) {
            toast.error("Wrong date format");
            return false;
        }
        if (!moment(startDate).isSameOrBefore(endDate)) {
            toast.error("Start Date must be before End Date");
            return false;
        }
        return true;
    }

    render() {
        const { tagFilter, isTagDropdownOpen } = this.simpleState;
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

                <Container>
                    <Row>
                        <Col sm={{ size: 7 }} md={{ size: 8 }}>
                            <div className="page-title">
                                <h1 className="left">Tag Filters</h1>
                                <p>
                                    Manage your tag filter
                                </p>
                            </div>
                        </Col>
                        {this.elementAction !== "add" && (
                            <Col sm={{ size: 5 }} md={{ size: 4 }}>
                                <div className="bulk-update-button">
                                    <Dropdown isOpen={isTagDropdownOpen} toggle={this.toggleTagDropdown}>
                                        <DropdownToggle caret color="primary" className="primary">
                                            Actions
                                        </DropdownToggle>
                                        <DropdownMenu>
                                            <DropdownItem className="bulk-update-dropdown" onClick={this.toggleDeleteConfirmationModal} disabled={tagFilter && tagFilter.status !== "EDITING"}>
                                                <span className="bulk-update-dropdown-title">
                                                    Delete filter
                                                </span>
                                            </DropdownItem>
                                            <DropdownItem className="bulk-update-dropdown" onClick={() => this.runTagFilter(tagFilter.id, tagFilter.tagText)} disabled={!this.canApplyFilter()}>
                                                <span className="bulk-update-dropdown-title">
                                                    Apply filter
                                                </span>
                                            </DropdownItem>
                                            <DropdownItem className="bulk-update-dropdown" onClick={() => this.undoTagFilterBulkTag(tagFilter.id, tagFilter.tagText)} disabled={tagFilter && tagFilter.status !== "ACTIVE"}>
                                                <span className="bulk-update-dropdown-title">
                                                    Undo filter
                                                </span>
                                            </DropdownItem>
                                        </DropdownMenu>
                                    </Dropdown>
                                </div>
                            </Col>
                        )}
                    </Row>
                </Container>

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
                                            <Col sm={this.elementAction !== "add" ? { size: 6 } : { size: 12 }}>
                                                <AvField
                                                    name="tag_text"
                                                    label="Tag Name"
                                                    required
                                                    value={
                                                        tagFilter
                                                        && tagFilter.tagText
                                                    }
                                                />
                                            </Col>
                                            {this.elementAction !== "add"
                                            && (
                                                <Col sm={{ size: 6 }}>
                                                    <AvField
                                                        disabled
                                                        name="status"
                                                        label="Status"
                                                        value={
                                                            tagFilter
                                                            && tagFilter.status
                                                        }
                                                    />
                                                </Col>
                                            )}
                                            <Col sm={{ size: 12 }}>
                                                <AvField
                                                    name="search_text"
                                                    label="Search Text"
                                                    value={
                                                        tagFilter
                                                        && tagFilter.searchText
                                                    }
                                                />
                                            </Col>
                                            <Col sm={{ size: 10, offset: 2 }}>
                                                <Table className="search-examples">
                                                    <thead>
                                                        <tr>
                                                            <th colSpan="4">Search text examples</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td><strong>food & water</strong></td>
                                                            <td><em>both "food" <strong>and</strong> "water" are present in text</em></td>
                                                        </tr>
                                                        <tr>
                                                            <td><strong>food | water</strong></td>
                                                            <td><em>either "food" <strong>or</strong> "water" are present in text</em></td>
                                                        </tr>
                                                        <tr>
                                                            <td><strong>!food</strong></td>
                                                            <td><em>"food" <strong>not</strong> present in text</em></td>
                                                        </tr>
                                                        <tr>
                                                            <td><strong>food & (water | thirst) & !electricity</strong></td>
                                                            <td><em>"food" and either "water" or "thirst", and not "electricity", present in text</em></td>
                                                        </tr>
                                                    </tbody>
                                                </Table>
                                            </Col>
                                            <Col className="dates-parent" sm={{ size: 6 }}>
                                                <AvField
                                                    name="start_date"
                                                    id="start_date"
                                                    label="Start Date (e.g 2020-03-31)"
                                                    validate={{ pattern: { value: /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/ } }}
                                                    placeholder="YYYY-MM-DD"
                                                    value={
                                                        tagFilter && tagFilter.startDate && moment(tagFilter.startDate).format("YYYY-MM-DD")
                                                    }
                                                />
                                            </Col>
                                            <Col className="dates-parent" sm={{ size: 6 }}>
                                                <AvField
                                                    name="end_date"
                                                    id="end_date"
                                                    label="End Date (e.g 2020-03-31)"
                                                    validate={{ pattern: { value: /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/ } }}
                                                    placeholder="YYYY-MM-DD"
                                                    value={
                                                        tagFilter && tagFilter.endDate && moment(tagFilter.endDate).format("YYYY-MM-DD")
                                                    }
                                                />
                                            </Col>
                                            <Col className="test-search-text-button-parent" sm={{ size: 12 }}>
                                                <button
                                                    type="button"
                                                    className="test-search-text-button"
                                                    onClick={this.handleTextSearchTestButtonClick}
                                                >
                                                    Preview ideas
                                                </button>
                                            </Col>
                                            <Col sm={{ size: 12 }}>
                                                {this.elementAction === "add"
                                                    && (
                                                        <AvField
                                                            type="checkbox"
                                                            name="createAndApply"
                                                            label="Create and Apply"
                                                            checked={this.simpleState.createAndApply}
                                                            onClick={this.toggleCreateAndApplyCheckBox}
                                                        />
                                                    )}
                                            </Col>

                                            {tagFilter && tagFilter.locations && this.elementAction !== "add"
                                            && (
                                                <Col sm={{ size: 12 }}>
                                                    <AvField
                                                        disabled
                                                        name="locations"
                                                        label="Locations"
                                                        value={
                                                            tagFilter
                                                            && tagFilter.locations
                                                        }
                                                    />
                                                </Col>
                                            )}
                                        </Row>
                                        <BtnRow buttonLabel={buttonLabel} cancelForm={this.cancelForm} />
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

decorate(TagFilterEdit, {
    simpleState: observable,
    elementAction: computed,
});

TagFilterEdit.contextType = StoreContext;

TagFilterEdit.propTypes = {
    match: PropTypes.objectOf(PropTypes.any).isRequired,
    history: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default observer(TagFilterEdit);
