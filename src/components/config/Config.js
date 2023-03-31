import React from "react";
import { Col, Container, Row } from "reactstrap";

import "../Dashboard.css";
import "../../index.css";
import "./Config.css";
import reactCSS from "reactcss";
import { AvForm } from "availity-reactstrap-validation";
import { observer } from "mobx-react";
import { runInAction } from "mobx";
import { StoreContext } from "../../StoreContext";
import Banner from "../Banner";
import BtnRow from "../BtnRow";
import ColorPicker from "./ColorPicker";
import FileUploader from "./FileUploader";
import AppConfig from "../../AppConfig";

const hintHeader = require("../../img/config/hint-header-logo-220px.png");
const hintBrowser = require("../../img/config/hint-browser-tab-214px.png");
const hintColor = require("../../img/config/hint-color-band-213px.png");

class Config extends React.PureComponent {
    simpleState = {
        siteHeader: null,
    }

    constructor(props) {
        super(props);

        this.state = {
            refreshColorPicker: false,
            refreshHeaderLogo: false,
            refreshFaviconImage: false,
            buttonTitle: "Update",
            adviseUserToRefresh: false,
        };

        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.handleHeaderHighlightColorChange = this.handleHeaderHighlightColorChange.bind(this);
        this.handleTitleTextChange = this.handleTitleTextChange.bind(this);
        this.updateHeaderFile = this.updateHeaderFile.bind(this);
        this.updateFaviconFile = this.updateFaviconFile.bind(this);
        this.cancelForm = this.cancelForm.bind(this);
    }

    async componentDidMount() {
        const { configStore } = this.context;
        const config = await configStore.loadConfig();
        await this.retrieveConfig(config);
    }


    async retrieveConfig(config) {
        const siteHeader = config;
        if (typeof siteHeader.titleText === "undefined" || siteHeader.titleText === null) {
            siteHeader.titleText = AppConfig.SITE_HEADER_DEFAULT_TITLE_TEXT;
        }
        if (typeof siteHeader.highlightColour === "undefined" || siteHeader.highlightColour === null) {
            siteHeader.highlightColour = AppConfig.SITE_HEADER_DEFAULT_HIGHLIGHT_COLOUR;
        }
        runInAction(() => {
            this.simpleState.siteHeader = siteHeader;
        });

        this.setState({
            adviseUserToRefresh: false,
        }, () => {
            this.refreshColorPicker();
            this.refreshHeaderLogo();
            this.refreshFaviconImage();
        });
    }

    refreshColorPicker() {
        const { refreshColorPicker } = this.state;

        this.setState({
            refreshColorPicker: !refreshColorPicker,
        });
    }

    refreshHeaderLogo() {
        const { refreshHeaderLogo } = this.state;

        this.setState({
            refreshHeaderLogo: !refreshHeaderLogo,
        });
    }

    refreshFaviconImage() {
        const { refreshFaviconImage } = this.state;

        this.setState({
            refreshFaviconImage: !refreshFaviconImage,
        });
    }

    updateHeaderFile(file) {
        const { refreshHeaderLogo } = this.state;

        this.simpleState.siteHeader.logoFile = file;

        this.setState({
            refreshHeaderLogo: !refreshHeaderLogo,
        });
    }

    updateFaviconFile(file) {
        const { refreshFaviconImage } = this.state;
        this.simpleState.siteHeader.faviconFile = file;
        this.setState({
            refreshFaviconImage: !refreshFaviconImage,
        });
    }

    handleHeaderHighlightColorChange(colour) {
        this.simpleState.siteHeader.highlightColour = colour.hex;
    }

    handleTitleTextChange(event) {
        this.simpleState.siteHeader.titleText = event.target.value;
    }

    async handleFormSubmit() {
        this.setState({
            buttonTitle: "Updating...",
            adviseUserToRefresh: false,
        }, () => {
            this.simpleState.siteHeader.save();
            this.setState({
                buttonTitle: "✔ Updated!",
                adviseUserToRefresh: true,
            }, () => {
                setTimeout(() => {
                    this.setState({
                        buttonTitle: "Update",
                    });
                }, 3000);
            });
        });
    }

    async cancelForm() {
        await this.retrieveConfig();
    }

    render() {
        const {
            adviseUserToRefresh, refreshColorPicker, refreshHeaderLogo, refreshFaviconImage, buttonTitle,
        } = this.state;
        const styles = reactCSS({
            default: {
                configParent: {
                    backgroundColor: "#FFFFFF",
                    borderRadius: "8px",
                    margin: "10px auto 56px auto",
                    boxShadow: "0 24px 18px -10px rgba(23,29,33,0.08)",
                    width: "100%",
                    maxWidth: "800px",
                    padding: "10px",
                },
                hintImage: {
                    width: "200px",
                    marginTop: "-10px",
                    marginLeft: "-10px",
                    marginRight: "10px",
                },
                settingsParent: {
                    marginTop: "30px",
                },
                explainerHeader: {
                    textAlign: "left",
                    fontSize: "18px",
                },
                RowParent: {
                    backgroundColor: "#F5F5F5",
                    borderRadius: "8px",
                    margin: "10px",
                    padding: "20px 10px",
                },
                RowParent2: {
                    marginTop: "20px",
                },
                titleTextParent: {
                    backgroundColor: "#FFFFFF",
                    padding: "10px",
                    borderRadius: "5px",
                    minWidth: "300px",
                    position: "relative",
                },
                title: {
                    color: "#5b5656",
                    fontSize: "15px",
                    textAlign: "left",
                    marginBottom: "0",
                },
                titleTextHeader: {
                    marginTop: "-8px",
                },
                buttonParent: {
                    textAlign: "center",
                    marginTop: "20px",
                },
                hint: {
                    textAlign: "center",
                    padding: "0",
                },
                hintVisibile: {
                    display: adviseUserToRefresh ? "block" : "none",
                },
            },
        });
        const { siteHeader } = this.simpleState;

        return (

            <div className="page">

                <div className="title-background-parent">
                    <div className="title-background-shape" />
                </div>

                <Banner pageTitle="custom header" />
                <Container>

                    <AvForm
                        encType="multipart/form-data"
                        onValidSubmit={this.handleFormSubmit}
                        model={siteHeader}
                    >

                        <div style={styles.configParent}>
                            <Row style={styles.RowParent}>

                                <Col lg={{ size: 12 }}>
                                    <h4 style={styles.explainerHeader}>Header Highlight Color</h4>
                                    <p>This is the thin color band that runs across the very top of the page.</p>

                                    <div style={styles.settingsParent} className="d-flex justify-content-start">
                                        <div className="p-2"><img alt="" style={styles.hintImage} src={hintColor} /></div>
                                        <div className="p-2">
                                            <ColorPicker
                                                color={siteHeader && siteHeader.highlightColour}
                                                refresh={siteHeader && refreshColorPicker}
                                                handleColorChange={this.handleHeaderHighlightColorChange}
                                            />
                                        </div>
                                    </div>

                                </Col>
                            </Row>
                            <Row style={{ ...styles.RowParent, ...styles.RowParent2 }}>
                                <Col lg={{ size: 12 }}>
                                    <h4 style={styles.explainerHeader}>Branding</h4>
                                    <p>You can add your logo and title to the header, plus a favicon for the site.</p>

                                    <div style={styles.settingsParent} className="d-flex justify-content-start">
                                        <div className="p-2"><img alt="" style={styles.hintImage} src={hintHeader} /></div>
                                        <FileUploader
                                            url={siteHeader && siteHeader.logoUrl}
                                            file={siteHeader && siteHeader.logoFile}
                                            refresh={refreshHeaderLogo}
                                            updateFile={this.updateHeaderFile}
                                            uploadTitle="Page header logo"
                                            altTag="Logo"
                                            id="logoImage"
                                        />
                                    </div>
                                </Col>

                                <Col lg={{ size: 12 }}>
                                    <div style={styles.settingsParent} className="d-flex justify-content-start">
                                        <div className="p-2"><img alt="" style={styles.hintImage} src={hintBrowser} /></div>
                                        <div>
                                            <FileUploader
                                                url={siteHeader && siteHeader.faviconUrl}
                                                file={siteHeader && siteHeader.faviconFile}
                                                refresh={refreshFaviconImage}
                                                updateFile={this.updateFaviconFile}
                                                uploadTitle="Browser favicon icon"
                                                altTag="Favicon"
                                                id="faviconImage"
                                            />
                                        </div>
                                    </div>
                                </Col>
                                <Col style={styles.buttonParent} lg={{ size: 12 }}>
                                    <BtnRow
                                        buttonLabel={buttonTitle}
                                        cancelForm={this.cancelForm}
                                    />
                                </Col>
                            </Row>

                            <p style={{ ...styles.hint, ...styles.hintVisibile }} className="small">
                                Thank you, please refresh your screen to view saved changes
                            </p>

                        </div>

                    </AvForm>

                </Container>
            </div>
        );
    }
}

Config.contextType = StoreContext;

export default observer(Config);
