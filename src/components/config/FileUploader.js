import React from "react";
import reactCSS from "reactcss";
import PropTypes from "prop-types";

import "../Dashboard.css";
import "../../index.css";

const editIcon = require("../../img/config/edit-icon.svg");

class FileUploader extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            url: this.props.url,
            file: this.props.file,
            uploadTitle: this.props.uploadTitle,
        };
    }

    componentDidUpdate(props) {
        const { refresh, url, file } = this.props;

        if (props.refresh !== refresh) {
            this.toggleStates(refresh, url, file);
        }
    }

    toggleStates = (refresh, url, file) => {
        this.setState({
            url: url,
            file: file,
            refresh: refresh,
        });
    }

    onChangeHandler = (event) => {
        const reader = new FileReader();
        const { id, updateFile } = this.props;
        const [files] = event.target.files;

        reader.onload = (e) => {
            const imgElement = document.getElementById(id);
            imgElement.src = e.target.result;
            imgElement.style.display = "inline-block";
        };
        if (files) {
            reader.readAsDataURL(files);
            updateFile(files);
        }
    };

    render() {
        const { url } = this.state;
        const { id, altTag, uploadTitle } = this.props;
        const styles = reactCSS({
            default: {
                title_parent: {
                    textAlign: "center",
                    width: "100%",
                },
                title: {
                    color: "#5b5656",
                    fontSize: "15px",
                    marginTop: "-8px",
                    textAlign: "center",
                },
                file_upload_file: {
                    position: "absolute",
                    top: 0,
                    right: 0,
                    left: 0,
                    bottom: 0,
                    width: "100%",
                    fontSize: "20px",
                    cursor: "pointer",
                    opacity: 0,
                    filter: "alpha(opacity=0)",
                },
                file_upload_image_parent: {
                    position: "relative",
                },
                file_upload_image: {
                    maxWidth: "100px",
                    maxHeight: "100px",
                    minWidth: "52px",
                    minHeigth: "52px",
                    margin: "auto",
                    boxSizing: "none",
                    display: url ? "inline-block" : "none",
                    position: "relative",
                },
                file_upload_parent: {
                    borderRadius: "5px",
                    backgroundColor: "#ebebeb",
                    padding: "10px",
                    minWidth: "300px",
                    position: "relative",
                },
                edit_icon: {
                    textAlign: "center",
                    width: "26px",
                    height: "26px",
                    backgroundColor: "#FFC300",
                    borderRadius: "5px",
                    position: "absolute",
                    bottom: "-8px",
                    right: "-8px",
                },
                edit_icon_image: {
                    width: "12px",
                    margin: "auto",
                },
            },
        });

        return (
            <div style={styles.file_upload_parent} className="d-flex justify-content-start">
                <div>
                    <div style={styles.file_upload_image_parent}>
                        <img
                            alt={altTag}
                            id={id}
                            style={styles.file_upload_image}
                            src={url}
                        />
                        <div style={styles.edit_icon}>
                            <img alt="Edit Icon" style={styles.edit_icon_image} src={editIcon} />
                        </div>
                    </div>
                </div>
                <div style={styles.title_parent}>
                    <h3 style={styles.title}>{uploadTitle}</h3>
                    <input name="file" onChange={this.onChangeHandler} type="file" style={styles.file_upload_file} />
                </div>
            </div>
        );
    }
}

FileUploader.propTypes = {
    url: PropTypes.string.isRequired,
    file: PropTypes.string.isRequired,
    uploadTitle: PropTypes.string.isRequired,
    refresh: PropTypes.bool.isRequired,
    id: PropTypes.string.isRequired,
    updateFile: PropTypes.func.isRequired,
    altTag: PropTypes.string.isRequired,
};

export default FileUploader;
