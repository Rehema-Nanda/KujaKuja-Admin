import React from "react";
import PropTypes from "prop-types";
import { Button } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function GlobalFilterMobileButton(props) {
    const {
        text,
        onClick,
    } = props;

    return (
        <Button onClick={onClick} className="globalfilter-mobile-button">
            {text}
            <div className="globalfilter-button-caret">
                <FontAwesomeIcon icon="caret-right" />
            </div>
        </Button>
    );
}

GlobalFilterMobileButton.propTypes = {
    text: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
};

export default GlobalFilterMobileButton;
