import React from "react";
import {
    Modal, ModalBody, ModalHeader, Button, FormGroup, Label, Input, ModalFooter, Col,
} from "reactstrap";
import PropTypes from "prop-types";

const AddTagModal = ({
    isOpen, toggle, tags, tagResponse, setTagToState, selectedTag, isTagging, searchTags,
}) => {
    return (
        <Modal
            isOpen={isOpen}
        >
            <ModalHeader toggle={toggle}>Tag response</ModalHeader>
            <ModalBody>
                <div>
                    <ul className="map-controls-popover-list tags-list">
                        <Input type="text" name="tag" placeholder="Search tags" onChange={searchTags} />
                        {tags.map((tag) => {
                            return (
                                <li key={tag.name}>
                                    <FormGroup check>
                                        <Label check className="map-controls-checkbox">
                                            <Input
                                                type="radio"
                                                onChange={setTagToState}
                                                value={tag.name}
                                                checked={tag.name === selectedTag}
                                            />
                                            {tag.name}
                                        </Label>
                                    </FormGroup>
                                </li>
                            );
                        })}
                    </ul>
                    <hr />
                    <FormGroup row>
                        <Col sm={12}>
                            <Input type="text" name="tag" id="tag" placeholder="Create new tag" onChange={setTagToState} />
                        </Col>
                    </FormGroup>
                </div>
            </ModalBody>
            <ModalFooter>
                <Button color="primary" className="primary cancel" onClick={toggle}>Cancel</Button>
                {" "}
                <Button color="primary" className="primary" onClick={tagResponse} disabled={selectedTag.length < 1}>
                    {isTagging ? <div className="loader" /> : "Tag"}
                </Button>
            </ModalFooter>
        </Modal>
    );
};

AddTagModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    toggle: PropTypes.func.isRequired,
    tags: PropTypes.arrayOf(PropTypes.object),
    tagResponse: PropTypes.func.isRequired,
    setTagToState: PropTypes.func.isRequired,
    selectedTag: PropTypes.string,
    isTagging: PropTypes.bool,
    searchTags: PropTypes.func.isRequired,
};

AddTagModal.defaultProps = {
    tags: [],
    selectedTag: "",
    isTagging: false,
};

export default AddTagModal;
