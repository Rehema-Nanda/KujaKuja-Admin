import React from "react";
import PropTypes from "prop-types";
import {
    Container, Row, Col, Button, Dropdown, DropdownToggle, DropdownMenu, DropdownItem,
} from "reactstrap";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";

import { observer } from "mobx-react";
import { toast } from "react-toastify";
import moment from "moment";
import Loading from "../Loading";
import { StoreContext } from "../../StoreContext";

class TagFilterList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isTagDropdownOpen: false,
            isRunningTagFilters: false,
        };
    }

    toggleTagDropdown = () => {
        this.setState((prevState) => {
            return {
                isTagDropdownOpen: !prevState.isTagDropdownOpen,
            };
        });
    };

    addElement = () => {
        const { history } = this.props;
        history.push("/tag_filters/add");
    };

    editRow = (id) => {
        const { history } = this.props;
        history.push(`/tag_filters/${id}`);
    };

    applyAllTagFilters = async () => {
        const { tagFilterStore } = this.context;
        this.setState({ isRunningTagFilters: true });

        try {
            await tagFilterStore.apiService.runAllTagFilters();
            this.setState({ isRunningTagFilters: false });
            toast.success("Tag filters apply process started");
        }
        catch {
            this.setState({ isRunningTagFilters: false });
            toast.error("Error applying tag filters");
        }
    };

    render() {
        const { tagFilterStore, userStore } = this.context;
        const { isTagDropdownOpen, isRunningTagFilters } = this.state;

        const dataLength = tagFilterStore.tagFilters.length;
        const resultsText = `Results: ${dataLength}`;

        const columns = [
            {
                dataField: "tagText",
                text: "Tag",
                sort: true,
                formatter: (cellContent) => {
                    return <small><strong>#{cellContent}</strong></small>;
                },
            },
            {
                dataField: "searchText",
                text: "Search Text",
                sort: true,
                formatter: (cellContent) => {
                    return <small>{cellContent}</small>;
                },
            },
            {
                dataField: "status",
                text: "Status",
                sort: true,
            },
            {
                dataField: "createdAt",
                text: "Created At",
                sort: true,
                formatter: (cellContent) => {
                    return moment(cellContent).format("DD-MMM-YYYY HH:mm");
                },
            },
            {
                dataField: "df2",
                isDummyField: true,
                headerClasses: () => {
                    return "column-right";
                },
                classes: () => {
                    return "column-right";
                },
                text: resultsText,
                formatter: (cellContent, row) => {
                    return (
                        <Button
                            color="primary"
                            className="primary"
                            onClick={() => this.editRow(row.id)}
                        >
                            {userStore.userInfo && userStore.userInfo.length > 0 && userStore.userInfo[0].isAdmin ? "Edit" : "View"}
                        </Button>
                    );
                },
            },
        ];

        const defaultSorted = [{
            dataField: "name",
            order: "asc",
        }];

        const pagination = paginationFactory({
            sizePerPage: 25,
            sizePerPageList: [
                { text: "25", value: 25 },
                { text: "50", value: 50 },
                { text: "100", value: 100 },
                { text: "ALL", value: dataLength || 1 },
            ],
        });

        return (
            <div className="page">

                <div className="title-background-parent">
                    <div className="title-background-shape" />
                </div>

                <Container className="desktop-non-fluid">
                    <Row>
                        <Col>
                            <h1 className="left">Tag Filters</h1>
                            <p>Manage your Tag Filters</p>
                        </Col>

                        <Col sm={{ size: 5 }} md={{ size: 2 }}>
                            <div className="bulk-update-button">
                                <Dropdown isOpen={isTagDropdownOpen} toggle={this.toggleTagDropdown}>
                                    <DropdownToggle caret color="primary" className="primary">
                                        Actions
                                    </DropdownToggle>
                                    <DropdownMenu>
                                        <DropdownItem className="bulk-update-dropdown" onClick={this.addElement}>
                                            <span className="bulk-update-dropdown-title">
                                                Add filter
                                            </span>
                                        </DropdownItem>
                                        <DropdownItem className="bulk-update-dropdown" onClick={this.applyAllTagFilters}>
                                            <span className="bulk-update-dropdown-title">
                                                Apply all filters
                                            </span>
                                        </DropdownItem>
                                    </DropdownMenu>
                                </Dropdown>
                            </div>
                        </Col>
                    </Row>
                </Container>

                <Container>
                    <div className="white-page-bg">
                        <Row>
                            <Col>
                                <div>
                                    <BootstrapTable
                                        bootstrap4
                                        size="sm"
                                        responsive="sm"
                                        keyField="id"
                                        data={tagFilterStore.tagFilters}
                                        columns={columns}
                                        defaultSorted={defaultSorted}
                                        pagination={pagination}
                                        striped
                                        hover
                                        bordered={false}
                                        noDataIndication="No Data"
                                    />
                                </div>
                            </Col>
                        </Row>
                    </div>
                </Container>

                {(tagFilterStore.isLoading || isRunningTagFilters) && <Loading />}

            </div>
        );
    }
}

TagFilterList.contextType = StoreContext;

TagFilterList.propTypes = {
    history: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default observer(TagFilterList);
