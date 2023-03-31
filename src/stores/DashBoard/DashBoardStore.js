import {
    flow, decorate, observable,
} from "mobx";
import ResponseCount from "./ResponseCount";
import DashboardApiService from "./DashboardApiService";
import AppConfig from "../../AppConfig";

class DashboardStore {
    responseCount = [];
    isLoading = false;

    constructor(rootStore) {
        this.rootStore = rootStore;
        this.apiService = new DashboardApiService(AppConfig.API_URL);

        this.loadResponsesCount();
    }

    loadResponsesCount = flow(function* () { // eslint-disable-line func-names
        this.isLoading = true;
        try {
            const responseCountJson = yield this.apiService.fetchResponsesCount();
            this.responseCount.replace(responseCountJson.map((countJson) => {
                return new ResponseCount(
                    this,
                    countJson,
                );
            }));
            this.isLoading = false;
        }
        catch (error) {
            console.error(`DashBoardStore failed to load response count. ${error.message}`); // eslint-disable-line no-console
            this.isLoading = false;
        }
    });
}

decorate(DashboardStore, {
    responseCount: observable,
    lastFeaturedIdea: observable,
});

export default DashboardStore;
