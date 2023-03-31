import React from "react";
import { SketchPicker } from "react-color";
import reactCSS from "reactcss";
import PropTypes from "prop-types";

import "../Dashboard.css";
import "../../index.css";
import { Col, Row } from "reactstrap";

class ColorPicker extends React.Component {
    // https://casesandberg.github.io/react-color/
    // https://github.com/casesandberg/reactcss

    static get DEFAULT_COLOR() {
        return "#000";
    }

    constructor(props) {
        super(props);

        this.state = {
            displayColorPicker: false,
            color: ColorPicker.DEFAULT_COLOR,
        };
    }

    componentDidUpdate(props) {
        const { refresh, color } = this.props;
        if (props.refresh !== refresh) {
            // eslint-disable-next-line react/no-did-update-set-state
            this.setState({
                color: color,
            });
        }
    }


    handleClick = () => {
        const { displayColorPicker } = this.state;

        this.setState({ displayColorPicker: !displayColorPicker });
    };

    handleClose = () => {
        this.setState({ displayColorPicker: false });
    };

    handleChange = (color) => {
        const { handleColorChange } = this.props;

        this.setState({ color: color.hex }, () => {
            handleColorChange(color);
        });
    };

    render() {
        const { color, displayColorPicker } = this.state;
        const styles = reactCSS({
            default: {
                color: {
                    width: "60px",
                    height: "60px",
                    borderRadius: "2px",
                    background: color,
                },
                swatch: {
                    padding: "4px",
                    background: "#fff",
                    borderRadius: "1px",
                    boxShadow: "0 0 0 1px rgba(0,0,0,.1)",
                    display: "inline-block",
                    cursor: "pointer",
                },
                popover: {
                    position: "absolute",
                    zIndex: "2",
                },
                cover: {
                    position: "fixed",
                    top: "0px",
                    right: "0px",
                    bottom: "0px",
                    left: "0px",
                },
                picker_col: {
                    textAlign: "center",
                },
            },
        });

        return (
            <Row>
                <Col style={styles.picker_col} sm="12" md="6">
                    <div style={styles.swatch} onClick={this.handleClick} role="presentation">
                        <div style={styles.color} />
                    </div>
                    {displayColorPicker
                        ? (
                            <div style={styles.popover}>
                                <div style={styles.cover} onClick={this.handleClose} role="presentation" />
                                <SketchPicker id="sketch" color={color || ColorPicker.DEFAULT_COLOR} onChange={this.handleChange} />
                            </div>
                        ) : null}
                </Col>
            </Row>
        );
    }
}

ColorPicker.propTypes = {
    refresh: PropTypes.bool.isRequired,
    color: PropTypes.string.isRequired,
    handleColorChange: PropTypes.func.isRequired,
};

export default ColorPicker;
