import React from "react";
import {
    Form, FormGroup, Label, Input,
} from "reactstrap";

import DateOptions from "./DateOptions";

const LocalDateFilter = ({ handleLocalFilterDateOptionSelect, selectedDateOption }) => {
    return (
        <Form className="local-date-container">
            <FormGroup>
                {DateOptions.ALL_OPTIONS.map((option) => {
                    return (
                        <FormGroup check key={option} inline>
                            <Label check className="form-label-check">
                                <Input
                                    type="radio"
                                    name="radio1"
                                    onChange={handleLocalFilterDateOptionSelect}
                                    value={option}
                                    checked={option === selectedDateOption}
                                />
                                {option}
                            </Label>
                        </FormGroup>
                    );
                })}
            </FormGroup>
        </Form>
    );
};

export default LocalDateFilter;
