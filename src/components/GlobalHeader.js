import React from "react";
import { NavLink as Link } from "react-router-dom";
import {
    Button, Collapse, DropdownItem, DropdownMenu, DropdownToggle, Modal,
    ModalBody, ModalFooter, Nav, Navbar, NavbarToggler, NavItem, NavLink, UncontrolledDropdown,
} from "reactstrap";
import { observer } from "mobx-react";
import "./GlobalHeader.css";
import reactCSS from "reactcss";
import AppConfig from "../AppConfig";
import { StoreContext } from "../StoreContext";

const kujakujaLogo = require("../img/global-logo-dark.svg");

class GlobalHeader extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isMenuOpen: false,
            isLogoutConfirmationModalOpen: false,
        };

        this.toggleMenu = this.toggleMenu.bind(this);
        this.toggleLogoutConfirmationModal = this.toggleLogoutConfirmationModal.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
    }

    toggleMenu() {
        const { isMenuOpen } = this.state;

        // close menu if mobile
        if (window.innerWidth <= 992) {
            this.setState({
                isMenuOpen: !isMenuOpen,
            });
        }
    }

    toggleLogoutConfirmationModal() {
        const { isLogoutConfirmationModalOpen } = this.state;

        this.setState({
            isLogoutConfirmationModalOpen: !isLogoutConfirmationModalOpen,
        });
    }

    async handleLogout() {
        const { apiService } = this.context;

        this.toggleLogoutConfirmationModal();
        await apiService.logout();
    }

    render() {
        const { userStore: { userInfo, apiService: { isAuthenticated } }, configStore: { siteHeader } } = this.context;
        const {
            isMenuOpen, isLogoutConfirmationModalOpen,
        } = this.state;

        const styles = reactCSS({
            default: {
                customHeaderBg: {
                    borderTopColor: siteHeader.highlightColour || AppConfig.SITE_HEADER_DEFAULT_HIGHLIGHT_COLOUR,
                },
                customLogoParentBg: {
                    backgroundColor: siteHeader.highlightColour || AppConfig.SITE_HEADER_DEFAULT_HIGHLIGHT_COLOUR,
                },
            },
        });

        return (

            <div>
                <Navbar className="global-header" style={styles.customHeaderBg} expand="lg">
                    <div className="logo-parent-div">
                        {siteHeader.logoUrl
                        && (
                            <div style={styles.customLogoParentBg} className="customer-logo-parent-div">
                                <NavLink className="customer-logo-nav-link" to="/" tag={Link} onClick={this.toggleMenu}>
                                    <img alt="Logo" className="customer-logo custom-logo" src={siteHeader.logoUrl} />
                                </NavLink>
                            </div>
                        )}
                        <NavLink className="kuja-kuja-logo-nav-link" to="/" tag={Link} onClick={this.toggleMenu}>
                            <img alt="Logo" className="customer-logo" src={kujakujaLogo} />
                        </NavLink>
                    </div>

                    {isAuthenticated()
                    && (
                        <>
                            <NavbarToggler onClick={this.toggleMenu} />

                            <Collapse isOpen={isMenuOpen} navbar>
                                <Nav className="ml-auto" navbar>
                                    <NavItem>
                                        <NavLink
                                            to="/mydata"
                                            tag={Link}
                                            activeClassName="navbar_active"
                                            onClick={this.toggleMenu}
                                        >
                                            My Data
                                        </NavLink>
                                    </NavItem>
                                    <UncontrolledDropdown nav inNavbar>
                                        <DropdownToggle nav caret>
                                            Administration
                                        </DropdownToggle>
                                        <DropdownMenu>
                                            <DropdownItem
                                                href="/users"
                                                to="/users"
                                                tag={Link}
                                                activeClassName="navbar_active"
                                                onClick={this.toggleMenu}
                                            >
                                                Team Members
                                            </DropdownItem>
                                            <DropdownItem
                                                href="/featured_ideas"
                                                to="/featured_ideas"
                                                tag={Link}
                                                activeClassName="navbar_active"
                                                onClick={this.toggleMenu}
                                            >
                                                Featured Ideas
                                            </DropdownItem>
                                            <DropdownItem
                                                href="/countries"
                                                to="/countries"
                                                tag={Link}
                                                activeClassName="navbar_active"
                                                onClick={this.toggleMenu}
                                            >
                                                Countries
                                            </DropdownItem>
                                            <DropdownItem
                                                href="/locations"
                                                to="/locations"
                                                tag={Link}
                                                activeClassName="navbar_active"
                                                onClick={this.toggleMenu}
                                            >
                                                Locations
                                            </DropdownItem>
                                            <DropdownItem
                                                href="/service_points"
                                                to="/service_points"
                                                tag={Link}
                                                activeClassName="navbar_active"
                                                onClick={this.toggleMenu}
                                            >
                                                Service Points
                                            </DropdownItem>
                                            <DropdownItem
                                                href="/service_types"
                                                to="/service_types"
                                                tag={Link}
                                                activeClassName="navbar_active"
                                                onClick={this.toggleMenu}
                                            >
                                                Service Types
                                            </DropdownItem>

                                            {userInfo.length > 0 && userInfo[0].isAdmin
                                            && (
                                                <>
                                                    <DropdownItem
                                                        href="/config"
                                                        to="/config"
                                                        tag={Link}
                                                        activeClassName="navbar_active"
                                                        onClick={this.toggleMenu}
                                                    >
                                                        Custom Header
                                                    </DropdownItem>
                                                    <DropdownItem
                                                        href="/data_review"
                                                        to="/data_review"
                                                        tag={Link}
                                                        activeClassName="navbar_active"
                                                        onClick={this.toggleMenu}
                                                    >
                                                        Data Review
                                                    </DropdownItem>
                                                    <DropdownItem
                                                        href="/tag_filters"
                                                        to="/tag_filters"
                                                        tag={Link}
                                                        activeClassName="navbar_active"
                                                        onClick={this.toggleMenu}
                                                    >
                                                        Tag Filter
                                                    </DropdownItem>
                                                </>
                                            )}
                                        </DropdownMenu>
                                    </UncontrolledDropdown>
                                    <NavItem>
                                        <NavLink
                                            to="#"
                                            tag={Link}
                                            onClick={this.toggleLogoutConfirmationModal}
                                        >
                                            Log Out
                                        </NavLink>
                                    </NavItem>
                                </Nav>
                            </Collapse>
                        </>
                    )}
                </Navbar>

                <Modal isOpen={isLogoutConfirmationModalOpen} toggle={this.toggleLogoutConfirmationModal}>
                    <ModalBody>
                        Do you really want to log out?
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" className="primary" onClick={this.handleLogout}>Yes</Button>
                        <Button color="primary" className="primary cancel" onClick={this.toggleLogoutConfirmationModal}>No</Button>
                    </ModalFooter>
                </Modal>
            </div>

        );
    }
}

GlobalHeader.contextType = StoreContext;

export default observer(GlobalHeader);
