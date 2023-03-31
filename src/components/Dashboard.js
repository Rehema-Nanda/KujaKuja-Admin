import React from "react";
import {
    Container, Row, Col, Badge,
} from "reactstrap";
import moment from "moment";
import { observer } from "mobx-react";
import { Pie } from "react-chartjs-2";
import formatNumber from "../helpers/formatNumber";
import { StoreContext } from "../StoreContext";
import "./Dashboard.css";
import Loading from "./Loading";

class Dashboard extends React.PureComponent {
    render() {
        const {
            locationStore, servicePointStore, serviceTypeStore, userStore, countryStore, dashboardStore: {
                responseCount, isLoading,
            }, featuredIdeaStore: { lastFeaturedIdea },
        } = this.context;

        const satisfiedResponsesCount = responseCount.length > 0 && parseInt(
            responseCount.filter((obj) => {
                return obj.satisfied;
            })[0].count,
            10,
        );

        const unsatisfiedResponsesCount = responseCount.length > 0 && parseInt(
            responseCount.filter((obj) => {
                return !obj.satisfied;
            })[0].count,
            10,
        );

        const totalResponsesCount = satisfiedResponsesCount + unsatisfiedResponsesCount;
        /* eslint-disable no-mixed-operators */
        const percentageSatisfied = (satisfiedResponsesCount / totalResponsesCount * 100).toFixed(1);
        const percentageUnsatisfied = (unsatisfiedResponsesCount / totalResponsesCount * 100).toFixed(1);
        const lastLogin = (userStore.userInfo.length > 0 && userStore.userInfo[0].lastSignInAt && moment(userStore.userInfo[0].lastSignInAt).format("h:mma MM/DD/YYYY")) || "";

        const chartData = {
            labels: [
                "Satisfied",
                "Unsatisfied",
            ],
            datasets: [
                {
                    data: [percentageSatisfied, percentageUnsatisfied],
                    backgroundColor: ["#00BA54", "#F8382B"],
                    hoverBackgroundColor: ["#00BA54", "#F8382B"],
                },
            ],
        };

        const chartOptions = {
            legend: {
                display: false,
            },
        };

        return (

            <div>
                <section className="dashboard">

                    <div className="title-background-parent">
                        <div className="title-background-shape" />
                    </div>

                    <Container>
                        <Row>
                            <Col>
                                <div className="login-bar">
                                    <div className="welcome">
                                        <p className="small">Welcome back!</p>
                                    </div>
                                    <div className="last-login">
                                        <p className="small">
                                            Last login:&nbsp;
                                            {lastLogin}
                                        </p>
                                    </div>
                                </div>
                            </Col>
                        </Row>

                        <Row>
                            <Col sm={{ size: 8 }}>
                                <Row>
                                    <Col>
                                        <div className="top-container">
                                            <h4 className="label">Total Data Points</h4>
                                            <div className="data-holder">
                                                <h2 className="numbers_big">{formatNumber(totalResponsesCount)}</h2>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col>
                                        <div className="top-container">
                                            <h4 className="label">Overall Satisfaction</h4>
                                            <div className="pie">
                                                <div className="pie-holder">
                                                    <Pie
                                                        data={chartData}
                                                        options={chartOptions}
                                                        height={64}
                                                        width={64}
                                                    />
                                                </div>
                                                <div className="pie-legend">
                                                    <p className="small">
                                                        <Badge
                                                            color="#F8382B"
                                                            style={{ backgroundColor: "#F8382B" }}
                                                            pill
                                                        >
                                                            &nbsp;
                                                        </Badge>
                                                        &nbsp;
                                                        {`${percentageUnsatisfied}% Unsatisfied`}
                                                    </p>
                                                    <p className="small">
                                                        <Badge
                                                            color="success"
                                                            style={{ backgroundColor: "#00BA54" }}
                                                            pill
                                                        >
                                                            &nbsp;
                                                        </Badge>
                                                        &nbsp;
                                                        {`${percentageSatisfied}% Satisfied`}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>

                                <Row className="top-details-row">
                                    <Col sm={{ size: 4 }}>
                                        <div>
                                            <h4 className="label">Active Countries</h4>
                                            <h2 className="numbers_big left">{formatNumber(countryStore.enabledCountries.length)}</h2>
                                        </div>
                                    </Col>
                                    <Col sm={{ size: 4 }}>
                                        <div>
                                            <h4 className="label">Active Locations</h4>
                                            <h2 className="numbers_big left">{formatNumber(locationStore.locations.length)}</h2>
                                        </div>
                                    </Col>
                                    <Col sm={{ size: 4 }}>
                                        <div>
                                            <h4 className="label">Active Service Points</h4>
                                            <h2 className="numbers_big left">{formatNumber(servicePointStore.servicePoints.length)}</h2>
                                        </div>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col sm={{ size: 4 }}>
                                        <div>
                                            <h4 className="label">Service Types</h4>
                                            <h2 className="numbers_big left">{formatNumber(serviceTypeStore.serviceTypes.length)}</h2>
                                        </div>
                                    </Col>
                                    <Col sm={{ size: 4 }}>
                                        <div>
                                            <h4 className="label">Team Members</h4>
                                            <h2 className="numbers_big left">{formatNumber(userStore.users.length)}</h2>
                                        </div>
                                    </Col>
                                </Row>
                            </Col>

                            <Col sm={{ size: 4 }}>
                                <Col>
                                    <div className="top-container-idea-feed">
                                        <h4 className="label">This Week&apos;s Featured Ideas</h4>
                                        <ul className="list-unstyled">
                                            {lastFeaturedIdea.length === 0
                                            && (
                                                <li>
                                                    <p>No featured ideas this week</p>
                                                </li>
                                            )}
                                            {lastFeaturedIdea && lastFeaturedIdea.map((row) => {
                                                return (
                                                    <li key={row.id}>
                                                        <p>{row.idea}</p>
                                                        <p className="small">
                                                            {moment(row.updated_at).format("L")}
                                                            &nbsp;|&nbsp;
                                                            {row.name}
                                                        </p>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </div>
                                </Col>
                            </Col>
                        </Row>
                    </Container>

                    {isLoading && <Loading /> }

                </section>
            </div>
        );
    }
}

Dashboard.contextType = StoreContext;

export default observer(Dashboard);
