import React from "react";
import PropTypes from "prop-types";
import {
    Container, Row, Col, Button,
} from "reactstrap";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory, { PaginationProvider, SizePerPageDropdownStandalone, PaginationListStandalone } from "react-bootstrap-table2-paginator";
import ToolkitProvider from "react-bootstrap-table2-toolkit";

import { observer } from "mobx-react";
import { StoreContext } from "../../StoreContext";

import Banner from "../Banner";
import Loading from "../Loading";
import DataListParent from "../data_review/DataListParent";
import { getQueryParamsFromUrl } from "../../helpers/urlFilterParamsHelper";


import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import "react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css";
import "../Dashboard.css";
import "../../index.css";

const controller = new AbortController();
const { signal } = controller;

class UsersList extends DataListParent {
    constructor(props) {
        super(props);

        this.state = {
            page: 1,
            limit: 25,
            sort: {
                by: "email",
                order: "desc",
            },
            refreshData: false,
        };
    }

    async componentDidMount() {
        const queryParams = getQueryParamsFromUrl();

        if (Object.entries(queryParams).length > 0) {
            this.updateFilterState(queryParams); // update global filter state
            this.updateLocalStateFromQueryParams(queryParams); // update local state
        }
        else {
            this.pushListPageHistoryIfRequired();
        }
    }

    async componentDidUpdate(prevProps, prevState) {
        const {
            refreshData,
        } = this.state;
        const { location } = this.props;

        const queryParams = getQueryParamsFromUrl();

        if (
            (refreshData && (
                refreshData !== prevState.refreshData
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
                this.pushListPageHistoryIfRequired();
            }
        }
    }

    fetchData = async (refresh = false) => {
        const {
            limit, page, sort,
        } = this.state;
        const { userStore } = this.context;

        const mapSortName = {
            email: "email",
            settlementName: "settlement_name",
            lastSignInAt: "last_sign_in_at",
        };
        const reqData = {
            limit: limit,
            page: page,
            sort: { ...sort, by: mapSortName[sort.by] },
        };

        const config = {
            data: reqData,
            signal: signal,
        };

        if (!userStore.users || userStore.users.length === 0 || refresh) {
            await userStore.loadUsers(config);
            this.setState({ refreshData: false });
        }
    };

    addElement = () => {
        const { history } = this.props;
        history.push("/users/add");
    };

    editRow = (id) => {
        const { history } = this.props;
        history.push(`/users/${id}`);
    };

    render() {
        const { apiService, userStore } = this.context;
        const { page, limit } = this.state;

        const dataLength = userStore.count;
        const resultsText = `Results: ${dataLength}`;

        const columns = [
            {
                dataField: "id",
                text: "ID",
                hidden: true,
            },
            {
                dataField: "email",
                text: "Email",
                sort: true,
            },
            {
                dataField: "settlementName",
                text: "Location",
                sort: true,
            },
            {
                dataField: "lastSignInAt",
                text: "Last SignIn Date",
                sort: true,
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
                            onClick={() => {
                                this.editRow(row.id);
                            }}
                        >
                            {apiService.getProfile() && apiService.getProfile().is_admin ? "Edit" : "View"}
                        </Button>
                    );
                },
            }];

        const defaultSorted = [{
            dataField: "email",
            order: "asc",
        }];

        const pagination = paginationFactory({
            custom: true,
            page: page,
            totalSize: dataLength,
            sizePerPage: limit,
            sizePerPageList: [
                { text: "25", value: 25 },
                { text: "50", value: 50 },
                { text: "100", value: 100 },
                { text: "ALL", value: dataLength || 1 }, // `|| 1` because 0 breaks the pagination
            ],
        });

        return (
            <ToolkitProvider
                keyField="id"
                data={userStore.users}
                columns={columns}
                bootstrap4
            >
                {
                    (props) => (
                        <div className="page">

                            <div className="title-background-parent">
                                <div className="title-background-shape" />
                            </div>

                            <Banner pageTitle="team members" elementAction="list" buttonFunction={this.addElement} />

                            <Container>
                                <div className="white-page-bg">
                                    <Row>
                                        <Col>
                                            <PaginationProvider pagination={pagination}>
                                                {({
                                                    paginationProps,
                                                    paginationTableProps,
                                                }) => {
                                                    return (
                                                        <div>
                                                            <BootstrapTable
                                                                {...props.baseProps}
                                                                {...paginationTableProps}
                                                                remote
                                                                defaultSorted={defaultSorted}
                                                                striped
                                                                hover
                                                                bordered={false}
                                                                noDataIndication="No Data"
                                                                onTableChange={this.handleTableChange}
                                                            />
                                                            <SizePerPageDropdownStandalone
                                                                {...paginationProps}
                                                            />
                                                            <PaginationListStandalone
                                                                {...paginationProps}
                                                            />
                                                        </div>
                                                    );
                                                }}
                                            </PaginationProvider>
                                        </Col>
                                    </Row>
                                </div>
                            </Container>

                            { userStore.isLoading && <Loading /> }

                        </div>
                    )
                }
            </ToolkitProvider>
        );
    }
}

UsersList.contextType = StoreContext;

UsersList.propTypes = {
    history: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default observer(UsersList);
