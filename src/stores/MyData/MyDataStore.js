import {
    flow, decorate, observable, computed,
} from "mobx";
import Response from "./Response";
import Tag from "./Tag";
import MyDataApiService from "./MyDataApiService";
import AppConfig from "../../AppConfig";

class MyDataStore {
    responses = [];
    dates = {};
    count = 0;
    tags = [];
    isLoading = false;
    responsesNonSyndicated = [];
    countNonSyndicated = 0;

    constructor(rootStore) {
        this.rootStore = rootStore;
        this.apiService = new MyDataApiService(AppConfig.API_URL);

        this.fetchMydata();
        this.fetchTags();
    }

    get tagsSortedByName() {
        return this.tags.sort((a, b) => {
            if (a.name < b.name) {
                return -1;
            }
            else if (a.name > b.name) {
                return 1;
            }
            return 0;
        });
    }

    // eslint-disable-next-line func-names
    fetchMydata = flow(function* (config) {
        this.isLoading = true;

        try {
            const myDataJson = yield this.apiService.fetchMyData(config);
            this.responses.replace(myDataJson.data.map((data) => {
                return new Response(this, data);
            }));
            this.responsesNonSyndicated.replace(this.responses.filter((r) => r.id < 1000000000));
            this.countNonSyndicated = myDataJson.nonSyndicatedResponsesCount;
            this.count = myDataJson.count;
            this.dates = myDataJson.dates;
            this.isLoading = false;
        }
        catch (error) {
            console.error(`MyDataStore failed to load MyData ${error.message}`); // eslint-disable-line no-console
            this.isLoading = false;
        }
    });

    fetchTags = flow(function* () {
        this.isLoading = true;

        try {
            const tagsJson = yield this.apiService.fetchAllTags();
            this.tags.replace(tagsJson.map((tagJson) => {
                return new Tag(
                    this,
                    tagJson,
                );
            }));
            this.isLoading = false;
        }
        catch (error) {
            console.error(`MyDataStore failed to load tags. ${error.message}`); // eslint-disable-line no-console
            this.isLoading = false;
        }
    })
}

decorate(MyDataStore, {
    responses: observable,
    tags: observable,
    isLoading: observable,
    tagsSortedByName: computed,
    responsesNonSyndicated: observable,
});

export default MyDataStore;
