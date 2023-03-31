import {
    flow, decorate, observable, computed,
} from "mobx";
import Location from "./Location";
import LocationApiService from "./LocationApiService";
import AppConfig from "../../AppConfig";

class LocationStore {
    locations = [];
    locationsSyndicated = [];
    isLoading = false;
    count = 0;

    constructor(rootStore) {
        this.rootStore = rootStore;
        this.apiService = new LocationApiService(AppConfig.API_URL);

        this.loadLocations();
        this.loadSyndicatedLocations();
    }

    get locationsSortedByName() {
        return this.locations.sort((a, b) => {
            if (a.name < b.name) {
                return -1;
            }
            else if (a.name > b.name) {
                return 1;
            }
            return 0;
        });
    }

    loadLocations = flow(function* (config) { // eslint-disable-line func-names
        this.isLoading = true;
        try {
            const locationsJson = yield this.apiService.fetchAllLocations(config);
            this.locations.replace(locationsJson.data.map((locationJson) => {
                return new Location(
                    this,
                    locationJson,
                );
            }));
            this.count = locationsJson.count;
            this.isLoading = false;
        }
        catch (error) {
            console.error(`LocationStore failed to load locations. ${error.message}`); // eslint-disable-line no-console
            this.isLoading = false;
        }
    });

    loadSyndicatedLocations = flow(function* () { // eslint-disable-line func-names
        this.isLoading = true;
        try {
            const locationsJson = yield this.apiService.fetchSyndicatedLocations();

            this.locationsSyndicated.replace(locationsJson.map((locationJson) => {
                return new Location(
                    this,
                    locationJson,
                );
            }));
            this.isLoading = false;
        }
        catch (error) {
            console.error(`LocationStore failed to load syndicated locations. ${error.message}`); // eslint-disable-line no-console
            this.isLoading = false;
        }
    });

    updateLocationFromServer = flow(function* (id) { // eslint-disable-line func-names
        this.isLoading = true;
        const locationsJson = yield this.apiService.fetchLocationById(id);
        let location = this.locations.find((loc) => {
            return loc.id === id;
        });

        if (locationsJson.length === 0 && location) {
            // location no longer exists on the server, remove it locally
            yield this.removeLocation(location);
            location = null;
        }
        if (locationsJson.length > 0) {
            if (location) {
                location.updateFromJson(locationsJson[0]);
            }
            else {
                location = new Location(this, locationsJson[0]);
                this.locations.push(location);
            }
        }
        this.isLoading = false;
        return location;
    });

    removeLocation = flow(function* (location) { // eslint-disable-line func-names, require-yield
        this.locations.splice(this.locations.indexOf(location), 1);
    });

    addLocation = flow(function* (location) { // eslint-disable-line func-names, require-yield
        this.locations.push(location);
    });
}
decorate(LocationStore, {
    locations: observable,
    locationsSyndicated: observable,
    locationsSortedByName: computed,
    isLoading: observable,
});

export default LocationStore;
