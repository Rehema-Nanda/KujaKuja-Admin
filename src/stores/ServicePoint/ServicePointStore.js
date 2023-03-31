import {
    flow, decorate, observable, computed,
} from "mobx";
import ServicePoint from "./ServicePoint";
import ServicePointApiService from "./ServicePointApiService";
import AppConfig from "../../AppConfig";

class ServicePointStore {
    servicePoints = [];
    servicePointsSyndicated = [];
    isLoading = false;
    count = 0;

    constructor(rootStore) {
        this.rootStore = rootStore;
        this.apiService = new ServicePointApiService(AppConfig.API_URL);

        this.loadServicePoints();
        this.loadSyndicatedServicePoints();
    }

    get servicePointsSortedByName() {
        return this.servicePoints.slice().sort((a, b) => {
            if (a.name < b.name) {
                return -1;
            }
            else if (a.name > b.name) {
                return 1;
            }
            return 0;
        });
    }

    loadServicePoints = flow(function* (config) { // eslint-disable-line func-names
        this.isLoading = true;
        try {
            const servicePointsJson = yield this.apiService.fetchAllServicePoints(config);
            this.servicePoints.replace(servicePointsJson.data.map((servicePointJson) => {
                return new ServicePoint(this, servicePointJson);
            }));
            this.count = servicePointsJson.count;
            this.isLoading = false;
        }
        catch (error) {
            console.error(`ServicePointStore failed to load service points. ${error.message}`); // eslint-disable-line no-console
            this.isLoading = false;
        }
    });

    loadSyndicatedServicePoints = flow(function* () { // eslint-disable-line func-names
        this.isLoading = true;
        try {
            const servicePointsJson = yield this.apiService.fetchSyndicatedServicePoints();
            this.servicePointsSyndicated.replace(servicePointsJson.map((servicePointJson) => {
                return new ServicePoint(this, servicePointJson);
            }));
            this.isLoading = false;
        }
        catch (error) {
            console.error(`ServicePointStore failed to load syndicated service points. ${error.message}`); // eslint-disable-line no-console
            this.isLoading = false;
        }
    });

    updateServicePointFromServer = flow(function* (id) { // eslint-disable-line func-names
        this.isLoading = true;
        const servicePointsJson = yield this.apiService.fetchServicePointById(id);
        let servicePoint = this.servicePoints.find((sp) => {
            return sp.id === id;
        });

        if (servicePointsJson.length === 0 && servicePoint) {
            // service point no longer exists on the server, remove it locally
            yield this.removeCountry(servicePoint);
            servicePoint = null;
        }
        if (servicePointsJson.length > 0) {
            if (servicePoint) {
                servicePoint.updateFromJson(servicePointsJson[0]);
            }
            else {
                servicePoint = new ServicePoint(this, servicePointsJson[0]);
                this.servicePoints.push(servicePoint);
            }
        }
        this.isLoading = false;
        return servicePoint;
    });

    removeServicePoint = flow(function* (servicePoint) { // eslint-disable-line func-names, require-yield
        this.servicePoints.splice(this.servicePoints.indexOf(servicePoint), 1);
    });

    addServicePoint = flow(function* (servicePoint) { // eslint-disable-line func-names, require-yield
        this.servicePoints.push(servicePoint);
    });
}

decorate(ServicePointStore, {
    servicePoints: observable,
    servicePointsSyndicated: observable,
    servicePointsSortedByName: computed,
    isLoading: observable,
});

export default ServicePointStore;
