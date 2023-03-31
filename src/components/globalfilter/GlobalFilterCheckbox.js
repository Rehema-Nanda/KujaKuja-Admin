import React from "react";

import { Input, Label, FormGroup } from "reactstrap";
import PropTypes from "prop-types";

export default class GlobalFilterCheckbox extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            checked: props.selectedItems.indexOf(props.item.id) !== -1,
        };

        this.onChange = this.onChange.bind(this);
        this.label = this.label.bind(this);
    }

    onChange = () => {
        const { selectItemHandler, item, selectItemHandlerArgs } = this.props;
        const { checked } = this.state;

        this.setState({
            checked: !checked,
        });

        selectItemHandler(
            item.id,
            ...selectItemHandlerArgs,
        );
    };

    label = () => {
        const { item, itemLabelProperty, isServicePoint } = this.props;

        if (isServicePoint) {
            return (
                <span>
                    {`${item[itemLabelProperty]}`}
                    {" "}
                    <br />
                    <em>{`(${item.settlementName})`}</em>
                </span>
            );
        }

        return item[itemLabelProperty];
    };

    render() {
        const { checked } = this.state;

        return (
            <FormGroup check>
                <Label check className="map-controls-checkbox">
                    <Input type="checkbox" checked={checked} onChange={this.onChange} />
                    {this.label()}
                </Label>
            </FormGroup>
        );
    }
}

GlobalFilterCheckbox.propTypes = {
    selectItemHandler: PropTypes.func.isRequired,
    item: PropTypes.objectOf(PropTypes.any).isRequired,
    selectItemHandlerArgs: PropTypes.arrayOf(PropTypes.string).isRequired,
    selectedItems: PropTypes.arrayOf(PropTypes.any).isRequired,
    itemLabelProperty: PropTypes.string.isRequired,
};
