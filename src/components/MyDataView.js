import React from "react";
import {
    Container, Row, Col, Button,
} from "reactstrap";
import {
    AvForm, AvField,
} from "availity-reactstrap-validation";
import PropTypes from "prop-types";

import "./Dashboard.css";
import "../index.css";
import "./Edit.css";
import { StoreContext } from "../StoreContext";

export default class MyDataView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};

        this.getPathElements = this.getPathElements.bind(this);
        this.setData = this.setData.bind(this);
        this.cancelForm = this.cancelForm.bind(this);
    }

    ////////////////////////////////////////
    // lifecycle methods
    ////////////////////////////////////////

    async componentWillMount() {
        const pathElements = this.getPathElements();
        const { myDataStore: { apiService } } = this.context;
        if (apiService.isAuthenticated()) {
            const res = await apiService.makeHttpCall(`${pathElements[1]}/${pathElements[2]}`);
            this.setData("formData", res.data.data[0]);
        }
        this.setState({
            elementType: pathElements[1],
        });
    }

    getPathElements = () => {
        const { location } = this.props;

        let pageName = location.pathname;
        pageName = pageName.split("/");
        return pageName;
    };

    setData(name, value) {
        this.setState(
            {
                [name]: value,
            },
        );
    }

    cancelForm() {
        const { history } = this.props;
        const { elementType } = this.state;

        history.replace(`/${elementType}`);
    }

    render() {
        const { formData } = this.state;

        return (

            <div className="page">

                <div className="title-background-parent">
                    <div className="title-background-shape" />
                </div>

                <Container>
                    <Row>
                        <Col sm={{ size: 7 }} md={{ size: 8 }}>
                            <div className="page-title">
                                <h1 className="left">Response</h1>
                                <p />
                            </div>
                        </Col>
                        <Col sm={{ size: 5 }} md={{ size: 4 }}>
                            <div className="page-title">
                                <Button color="primary" className="primary" onClick={() => this.cancelForm()}>Responses List</Button>
                            </div>
                        </Col>
                    </Row>
                </Container>

                <Container>
                    <div className="white-page-bg">
                        <Row>
                            <Col lg={{ size: 8, offset: 2 }}>
                                <div className="list-feed">
                                    <AvForm model={formData}>
                                        <Row>
                                            <Col>
                                                <AvField type="text" name="id" label="Id" value={formData && formData.id} disabled />
                                                <AvField type="email" name="email" label="Email" value={formData && formData.email} disabled />
                                                <AvField type="text" name="service_point" label="Service Point" value={formData && formData.service_point} disabled />
                                                <AvField type="text" name="service_type" label="Service Type" value={formData && formData.service_type} disabled />
                                                <AvField type="text" name="location" label="Location" value={formData && formData.location} disabled />
                                                <AvField type="text" name="country" label="Country" value={formData && formData.country} disabled />
                                                <AvField type="checkbox" name="satisfied" label="Satisfied" checked={formData && formData.satisfied} disabled />
                                                <AvField type="textarea" rows="5" name="idea" label="Idea" value={formData && (formData.idea || '')} disabled />
                                                <AvField type="text" name="lat" label="Lat" value={formData && (formData.lat || '')} disabled />
                                                <AvField type="text" name="lng" label="Lng" value={formData && (formData.lng || '')} disabled />
                                                <AvField type="text" name="created_at" label="Created At" value={formData && formData.created_at} disabled />
                                                <AvField type="text" name="updated_at" label="Updated At" value={formData && formData.updated_at} disabled />
                                                <AvField type="text" name="uploaded_at" label="Uploaded At" value={formData && formData.uploaded_at} disabled />
                                                <AvField type="text" name="response_type" label="Response Type" value={formData && formData.response_type} disabled />
                                                <AvField type="checkbox" name="is_starred" label="Is Starred" checked={formData && formData.is_starred} disabled />
                                            </Col>
                                        </Row>

                                    </AvForm>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </Container>

            </div>
        );
    }
}

MyDataView.contextType = StoreContext;

MyDataView.propTypes = {
    location: PropTypes.objectOf(PropTypes.any).isRequired,
    history: PropTypes.objectOf(PropTypes.any).isRequired,
};
