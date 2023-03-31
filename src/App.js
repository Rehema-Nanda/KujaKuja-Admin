import React, { PureComponent } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
    faArrowRight, faArrowLeft, faArrowUp, faArrowDown, faCaretDown, faCaretRight, faSearch, faFilter,
    faTint, faHeart, faAppleAlt, faHome, faShieldAlt, faChartLine, faThumbsUp, faChevronLeft, faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { observer } from "mobx-react";

import GlobalHeader from "./components/GlobalHeader";
import GlobalFooter from "./components/GlobalFooter";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import MyData from "./components/MyData";
import MyDataView from "./components/MyDataView";
import UsersList from "./components/users/list";
import UsersEdit from "./components/users/edit";
import FeaturedIdeasList from "./components/featured_ideas/list";
import FeaturedIdeasEdit from "./components/featured_ideas/edit";
import CountriesList from "./components/countries/list";
import CountriesEdit from "./components/countries/edit";
import LocationsList from "./components/locations/list";
import LocationsEdit from "./components/locations/edit";
import ServicePointsList from "./components/service_points/list";
import ServicePointsEdit from "./components/service_points/edit";
import ServiceTypesList from "./components/service_types/list";
import ServiceTypesEdit from "./components/service_types/edit";
import Config from "./components/config/Config";
import DataReviewList from "./components/data_review/list";
import NoPage from "./components/no_page/NoPage";
import TagFilterList from "./components/tag_filters/list";
import TagFilterEdit from "./components/tag_filters/edit";

import { StoreContext } from "./StoreContext";

library.add(
    faArrowRight, faArrowLeft, faArrowUp, faArrowDown, faCaretDown, faCaretRight, faSearch, faFilter,
    faTint, faHeart, faAppleAlt, faHome, faShieldAlt, faChartLine, faThumbsUp, faChevronLeft, faChevronRight,
);

toast.configure();

class App extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            surveyTypes: [{ id: "", name: "Survey" }, { id: "binary", name: "Self-Swipe" }],
            booleanOptions: [{ id: true, name: "Yes" }, { id: false, name: "No" }],
        };
    }

    ////////////////////////////////////////
    // lifecycle methods
    ////////////////////////////////////////

    async componentDidUpdate() {
        const { dashboardStore: { apiService: { getToken } } } = this.context;

        if (!window.location.href.includes("login")) {
            await getToken(); // getToken will redirect to the login page if necessary
        }
    }

    render() {
        const { dashboardStore: { apiService: { isAuthenticated, getProfile } } } = this.context;
        const { surveyTypes, booleanOptions } = this.state;

        return (
            <div className="App">
                <BrowserRouter>
                    <div>

                        <Route render={() => {
                            return <GlobalHeader />;
                        }}
                        />

                        <Switch>
                            <Route
                                exact
                                path="/"
                                render={() => {
                                    return <Dashboard />;
                                }}
                            />

                            <Route
                                exact
                                path="/login"
                                render={() => {
                                    return <Login />;
                                }}
                            />

                            <Route
                                exact
                                path="/mydata"
                                render={(props) => {
                                    return <MyData history={props.history} surveyTypes={surveyTypes} booleanOptions={booleanOptions} location={props.location} />;
                                }}
                            />
                            <Route
                                exact
                                path="/mydata/*"
                                render={(props) => {
                                    return <MyDataView history={props.history} location={props.location} />;
                                }}
                            />
                            <Route
                                exact
                                path="/responses"
                                render={(props) => {
                                    return <MyData history={props.history} surveyTypes={surveyTypes} booleanOptions={booleanOptions} location={props.location} />;
                                }}
                            />
                            <Route
                                exact
                                path="/responses/*"
                                render={(props) => {
                                    return <MyDataView history={props.history} location={props.location} />;
                                }}
                            />

                            <Route
                                exact
                                path="/users"
                                render={(props) => {
                                    return <UsersList history={props.history} location={props.location} />;
                                }}
                            />
                            <Route
                                exact
                                path="/users/:id"
                                render={(props) => {
                                    return <UsersEdit history={props.history} match={props.match} />;
                                }}
                            />

                            <Route
                                exact
                                path="/featured_ideas"
                                render={(props) => {
                                    return <FeaturedIdeasList history={props.history} location={props.location} />;
                                }}
                            />
                            <Route
                                exact
                                path="/featured_ideas/:id"
                                render={(props) => {
                                    return <FeaturedIdeasEdit match={props.match} history={props.history} />;
                                }}
                            />

                            <Route
                                path="/countries/:id"
                                render={(props) => {
                                    return <CountriesEdit match={props.match} history={props.history} />;
                                }}
                            />
                            <Route
                                path="/countries"
                                render={(props) => {
                                    return <CountriesList history={props.history} location={props.location} />;
                                }}
                            />

                            <Route
                                exact
                                path="/locations"
                                render={(props) => {
                                    return <LocationsList history={props.history} location={props.location} />;
                                }}
                            />
                            <Route
                                exact
                                path="/locations/:id"
                                render={(props) => {
                                    return <LocationsEdit history={props.history} match={props.match} />;
                                }}
                            />

                            <Route
                                exact
                                path="/service_points"
                                render={(props) => {
                                    return <ServicePointsList history={props.history} location={props.location} />;
                                }}
                            />
                            <Route
                                exact
                                path="/service_points/:id"
                                render={(props) => {
                                    return <ServicePointsEdit history={props.history} match={props.match} />;
                                }}
                            />

                            <Route
                                exact
                                path="/service_types"
                                render={(props) => {
                                    return <ServiceTypesList history={props.history} location={props.location} />;
                                }}
                            />
                            <Route
                                exact
                                path="/service_types/:id"
                                render={(props) => {
                                    return <ServiceTypesEdit history={props.history} match={props.match} />;
                                }}
                            />

                            {isAuthenticated() && getProfile().is_admin
                            && (
                                <>
                                    <Route exact path="/config" component={Config} />

                                    <Route
                                        exact
                                        path="/data_review"
                                        render={(props) => {
                                            return <DataReviewList history={props.history} surveyTypes={surveyTypes} booleanOptions={booleanOptions} location={props.location} />;
                                        }}
                                    />

                                    <Route
                                        exact
                                        path="/tag_filters"
                                        render={(props) => {
                                            return <TagFilterList history={props.history} />;
                                        }}
                                    />

                                    <Route
                                        exact
                                        path="/tag_filters/:id"
                                        render={(props) => {
                                            return <TagFilterEdit history={props.history} match={props.match} />;
                                        }}
                                    />
                                </>
                            )}
                            <Route render={(props) => {
                                return <NoPage history={props.history} />;
                            }}
                            />
                        </Switch>

                        <Route render={() => {
                            return <GlobalFooter />;
                        }}
                        />

                    </div>
                </BrowserRouter>

            </div>
        );
    }
}

App.contextType = StoreContext;

export default observer(App);
