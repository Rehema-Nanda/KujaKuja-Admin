import { configure } from "mobx";
import AppConfig from "../AppConfig";
import ApiService from "./ApiService";
import FeaturedIdeaStore from "./FeaturedIdea/FeaturedIdeaStore";
import CountryStore from "./Country/CountryStore";
import LocationStore from "./Location/LocationStore";
import UserStore from "./User/UserStore";
import ServicePointStore from "./ServicePoint/ServicePointStore";
import MyDataStore from "./MyData/MyDataStore";
import ConfigStore from "./Config/ConfigStore";
import DashboardStore from "./DashBoard/DashBoardStore";
import ServiceTypeStore from "./ServiceType/ServiceTypeStore";
import TagFilterStore from "./TagFilter/TagFilterStore";

configure({ enforceActions: "observed" });

export default class RootStore {
    constructor() {
        this.apiService = new ApiService(AppConfig.API_URL);
        this.countryStore = new CountryStore(this);
        this.featuredIdeaStore = new FeaturedIdeaStore(this);
        this.serviceTypeStore = new ServiceTypeStore(this);
        this.locationStore = new LocationStore(this);
        this.userStore = new UserStore(this);
        this.servicePointStore = new ServicePointStore(this);
        this.myDataStore = new MyDataStore(this);
        this.configStore = new ConfigStore(this);
        this.dashboardStore = new DashboardStore(this);
        this.tagFilterStore = new TagFilterStore(this);
    }
}
