import {
    flow, decorate, observable,
} from "mobx";
import Config from "./Config";
import ConfigApiService from "./ConfigApiService";
import AppConfig from "../../AppConfig";

class ConfigStore {
    siteHeader = {};
    isLoading = false;

    constructor(rootStore) {
        this.rootStore = rootStore;
        this.apiService = new ConfigApiService(AppConfig.API_URL);

        this.loadConfig();
    }

    loadConfig = flow(function* () { // eslint-disable-line func-names
        this.isLoading = true;
        try {
            const configJson = yield this.apiService.fetchConfig();
            const newConfig = new Config(
                this,
                configJson,
            );
            this.siteHeader = newConfig;
            this.isLoading = false;
            return this.siteHeader;
        }
        catch (error) {
            console.error(`ConfigStore failed to load config. ${error.message}`); // eslint-disable-line no-console
            this.isLoading = false;
        }
    });
}

decorate(ConfigStore, {
    siteHeader: observable,
    isLoading: observable,
});

export default ConfigStore;
