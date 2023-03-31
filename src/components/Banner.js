import React from "react";
import PropTypes from "prop-types";
import {
    Container, Row, Col, Button,
} from "reactstrap";

import { observer } from "mobx-react";

import "../index.css";
import { StoreContext } from "../StoreContext";

class Banner extends React.PureComponent {
    render() {
        const { userStore: { userInfo } } = this.context;
        const { pageTitle, elementAction, buttonFunction, buttonDisabled } = this.props;

        const title = pageTitle.charAt(0).toUpperCase() + pageTitle.slice(1);
        let buttonLabel;

        if (elementAction === "list") {
            buttonLabel = `Add ${title}`;
        }
        else if (elementAction === "update") {
            buttonLabel = `Delete ${title}`;
        }

        return (

            <Container>
                <Row>
                    <Col sm={{ size: 7 }} md={{ size: 8 }}>
                        <div className="page-title">
                            <h1 className="left">{title}</h1>
                            <p>
                                Manage your
                                {" "}
                                {pageTitle}
                            </p>
                        </div>
                    </Col>
                    <Col sm={{ size: 5 }} md={{ size: 4 }}>
                        <div className="page-title">
                            {
                                userInfo
                                && userInfo.length > 0
                                && userInfo[0].isAdmin
                                && elementAction !== "add"
                                && buttonLabel
                                && (
                                    <Button disabled={buttonDisabled} color="primary" className="primary" onClick={buttonFunction}>
                                        {buttonLabel}
                                    </Button>
                                )
                            }
                        </div>
                    </Col>
                </Row>
            </Container>

        );
    }
}

Banner.propTypes = {
    pageTitle: PropTypes.string.isRequired,
    elementAction: PropTypes.string.isRequired,
    buttonFunction: PropTypes.func.isRequired,
    buttonDisabled: PropTypes.bool,
};

Banner.defaultProps = {
    buttonDisabled: false,
};

Banner.contextType = StoreContext;

export default observer(Banner);
