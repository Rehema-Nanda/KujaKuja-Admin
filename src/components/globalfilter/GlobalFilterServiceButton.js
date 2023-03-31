
import React from "react";

import { Button, Tooltip } from "reactstrap";
import PropTypes from "prop-types";

let buttonStyle;
let iconPath;

export default class GlobalFilterServiceButton extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            tipState: false,
            buttonState: false,
        };

        this.setTipState = this.setTipState.bind(this);
        this.setButtonState = this.setButtonState.bind(this);
    }

    componentDidMount() {
        const { selectedServiceTypes, id } = this.props;

        if (selectedServiceTypes.indexOf(id) !== -1) {
            this.setState({ buttonState: true });
        }
    }

    setTipState = () => {
        const { tipState } = this.state;

        this.setState({
            tipState: !tipState,
        });
    }

    setButtonState = (id) => {
        const { buttonState } = this.state;
        const { toggleServiceType } = this.props;

        this.setState({
            buttonState: !buttonState,
        });
        toggleServiceType(id);
    }

    render() {
        const { buttonState, tipState } = this.state;
        const {
            iconoff, iconon, tipId, id, name,
        } = this.props;

        if (!buttonState) {
            buttonStyle = "service-toggle-off";
            iconPath = iconoff;
        }
        else {
            buttonStyle = "service-toggle-on";
            iconPath = iconon;
        }

        return (

            <div>
                <Button id={tipId} data-service-id={id} className={buttonStyle} onClick={(e) => this.setButtonState(id)}><img alt="" src={iconPath} /></Button>
                <Tooltip placement="bottom" target={tipId} isOpen={tipState} toggle={this.setTipState}>{name}</Tooltip>
            </div>

        );
    }
}

GlobalFilterServiceButton.propTypes = {
    iconoff: PropTypes.string.isRequired,
    iconon: PropTypes.string.isRequired,
    tipId: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    toggleServiceType: PropTypes.func.isRequired,
    selectedServiceTypes: PropTypes.arrayOf(PropTypes.object).isRequired,
};
