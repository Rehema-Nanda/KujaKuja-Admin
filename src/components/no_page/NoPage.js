import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { Row, Col, Container } from "reactstrap";
import PropTypes from "prop-types";

import "./noPage.css";

const facePath = require("../../img/face_unsatisfied.png");

class NoPage extends React.Component {
    goBack = () => {
        const { history } = this.props;

        history.goBack();
    }

    render() {
        return (
            <div>
                <div className="no-page">
                    <div className="title-background-parent">
                        <div className="title-background-shape" />
                    </div>
                    <Container>
                        <Row>
                            <Col sm="12" md={{ size: 6, offset: 3 }}>
                                <div className="no-page-container">
                                    <div className="no-page-icon">
                                        <img src={facePath} alt="alt" />
                                    </div>
                                    <div className="no-page-content">
                                        <h2>404 - Not found</h2>
                                        <p>This error has been recorded and we are looking into it. Please go back and try again or start over from our home page.</p>
                                    </div>
                                    <div className="no-page-buttons">
                                        <Row>
                                            <Col xs="6" className="no-page-option">
                                                <span className="no-page-back" onClick={this.goBack}>
                                                    <FontAwesomeIcon icon={faArrowLeft} />
                                                    {" "}
                                                    Go Back
                                                </span>
                                            </Col>
                                            <Col xs="6" className="no-page-option">
                                                <Link to="/">
                                                    <span className="no-page-back">
                                                        Home
                                                        {" "}
                                                        <FontAwesomeIcon icon={faArrowRight} />
                                                    </span>
                                                </Link>
                                            </Col>
                                        </Row>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </div>
            </div>
        );
    }
}

NoPage.propTypes = {
    history: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default NoPage;
