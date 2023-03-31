import {
    flow, decorate, observable, computed,
} from "mobx";
import ServiceType from "./ServiceType";
import ServiceTypeApiService from "./ServiceTypeApiService";
import AppConfig from "../../AppConfig";

class ServiceTypeStore {
    serviceTypes = [];
    isLoading = false;
    count = 0;

    constructor(rootStore) {
        this.rootStore = rootStore;
        this.apiService = new ServiceTypeApiService(AppConfig.API_URL);
        this.loadServiceTypes();
    }

    get serviceTypesSortedByName() {
        return this.serviceTypes.sort((a, b) => {
            if (a.name < b.name) {
                return -1;
            }
            else if (a.name > b.name) {
                return 1;
            }
            return 0;
        });
    }

    loadServiceTypes = flow(function* (config) { // eslint-disable-line func-names
        this.isLoading = true;
        try {
            const serviceTypesJson = yield this.apiService.fetchAllServiceTypes(config);
            this.serviceTypes.replace(serviceTypesJson.data.map((serviceTypeJson) => {
                return new ServiceType(
                    this,
                    serviceTypeJson,
                );
            }));
            this.count = serviceTypesJson.count;
            this.isLoading = false;
        }
        catch (error) {
            console.error(`ServiceTypeStore failed to load service types. ${error.message}`); // eslint-disable-line no-console
            this.isLoading = false;
        }
    });

    updateServiceTypeFromServer = flow(function* (id) { // eslint-disable-line func-names
        this.isLoading = true;
        const serviceTypesJson = yield this.apiService.fetchServiceTypeById(id);
        let serviceType = this.serviceTypes.find((st) => {
            return st.id === id;
        });

        if (serviceTypesJson.length === 0 && serviceType) {
            // service type no longer exists on the server, remove it locally
            yield this.removeServiceType(serviceType);
            serviceType = null;
        }
        if (serviceTypesJson.length > 0) {
            if (serviceType) {
                serviceType.updateFromJson(serviceTypesJson[0]);
            }
            else {
                serviceType = new ServiceType(this, serviceTypesJson[0]);
                this.serviceTypes.push(serviceType);
            }
        }
        this.isLoading = false;
        return serviceType;
    });

    removeServiceType = flow(function* (serviceType) { // eslint-disable-line func-names, require-yield
        this.serviceTypes.splice(this.serviceTypes.indexOf(serviceType), 1);
    });

    addServiceType = flow(function* (serviceType) { // eslint-disable-line func-names, require-yield
        this.serviceTypes.push(serviceType);
    });
}
decorate(ServiceTypeStore, {
    serviceTypes: observable,
    serviceTypesSortedByName: computed,
    isLoading: observable,
});

export default ServiceTypeStore;
