import {
    flow, decorate, observable, computed,
} from "mobx";
import Country from "./Country";
import CountryApiService from "./CountryApiService";
import AppConfig from "../../AppConfig";

class CountryStore {
    countries = [];
    count = 0;
    enabledCountries = [];
    isLoading = false;

    constructor(rootStore) {
        this.rootStore = rootStore;
        this.apiService = new CountryApiService(AppConfig.API_URL);

        this.loadCountries();
        this.loadEnabledCountries();
    }

    get countriesSortedByName() {
        return this.countries.slice().sort((a, b) => {
            if (a.name < b.name) {
                return -1;
            }
            else if (a.name > b.name) {
                return 1;
            }
            return 0;
        });
    }

    loadCountries = flow(function* (config) { // eslint-disable-line func-names
        this.isLoading = true;
        try {
            const countriesJson = yield this.apiService.fetchAllCountries(config);
            this.countries.replace(countriesJson.data.map((countryJson) => {
                return new Country(this, countryJson);
            }));
            this.count = countriesJson.count;
            this.isLoading = false;
        }
        catch (error) {
            console.error(`CountryStore failed to load countries. ${error.message}`); // eslint-disable-line no-console
            this.isLoading = false;
        }
    });

    loadEnabledCountries = flow(function* () { // eslint-disable-line func-names
        this.isLoading = true;
        try {
            const countriesJson = yield this.apiService.fetchEnabledCountries();
            this.enabledCountries.replace(countriesJson.map((countryJson) => {
                return new Country(this, countryJson);
            }));
            this.isLoading = false;
        }
        catch (error) {
            console.error(`CountryStore failed to load enabled countries. ${error.message}`); // eslint-disable-line no-console
            this.isLoading = false;
        }
    });

    updateCountryFromServer = flow(function* (id) { // eslint-disable-line func-names
        this.isLoading = true;
        const countriesJson = yield this.apiService.fetchCountryById(id);
        let country = this.countries.find((c) => {
            return c.id === id;
        });

        if (countriesJson.length === 0 && country) {
            // country no longer exists on the server, remove it locally
            yield this.removeCountry(country);
            country = null;
        }
        if (countriesJson.length > 0) {
            if (country) {
                country.updateFromJson(countriesJson[0]);
            }
            else {
                country = new Country(this, countriesJson[0]);
                this.countries.push(country);
            }
        }
        this.isLoading = false;
        return country;
    });

    removeCountry = flow(function* (country) { // eslint-disable-line func-names, require-yield
        this.countries.splice(this.countries.indexOf(country), 1);
    });

    addCountry = flow(function* (country) { // eslint-disable-line func-names, require-yield
        this.countries.push(country);
    });
}
decorate(CountryStore, {
    countries: observable,
    enabledCountries: observable,
    countriesSortedByName: computed,
    isLoading: observable,
});

export default CountryStore;
