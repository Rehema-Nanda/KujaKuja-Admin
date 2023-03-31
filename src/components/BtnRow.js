import React from "react";
import PropTypes from "prop-types";
import { Row, Col, Button } from "reactstrap";
import "../index.css";
import { observer } from "mobx-react";
import { StoreContext } from "../StoreContext";

class BtnRow extends React.PureComponent {
    render() {
        const { userStore: { userInfo } } = this.context;
        const { buttonLabel, cancelForm } = this.props;

        return (

            <Row className="btn-row">
                <Col>
                    {
                        userInfo
                        && userInfo.length > 0
                        && userInfo[0].isAdmin
                        && buttonLabel
                        && <Button color="primary" className="primary">{buttonLabel}</Button>
                    }
                </Col>
                <Col>
                    <Button color="primary" className="primary cancel" onClick={cancelForm}>Back</Button>
                </Col>
            </Row>

        );
    }
}

BtnRow.propTypes = {
    buttonLabel: PropTypes.string.isRequired,
    cancelForm: PropTypes.func.isRequired,
};

BtnRow.contextType = StoreContext;

export default observer(BtnRow);
