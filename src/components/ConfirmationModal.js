import React from "react";
import PropTypes from "prop-types";
import {
    Button, Modal, ModalBody, ModalFooter,
} from "reactstrap";
import { observer } from "mobx-react";

import "../index.css";
import { StoreContext } from "../StoreContext";

class ConfirmationModal extends React.PureComponent {
    render() {
        const { isOpen, toggle, buttonFunction } = this.props;

        return (

            <Modal isOpen={isOpen} toggle={toggle}>
                <ModalBody>
                    Do you really want to delete this item?
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" className="primary" onClick={buttonFunction}>Yes</Button>
                    <Button color="primary" className="primary cancel" onClick={toggle}>No</Button>
                </ModalFooter>
            </Modal>

        );
    }
}

ConfirmationModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    toggle: PropTypes.func.isRequired,
    buttonFunction: PropTypes.func.isRequired,
};

ConfirmationModal.contextType = StoreContext;

export default observer(ConfirmationModal);
