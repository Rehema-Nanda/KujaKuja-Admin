import {
    decorate, computed, observable, comparer,
} from "mobx";

class ServicePoint {
    store = null;
    id = null;
    name = null;
    lat = null;
    lng = null;
    createdAt = null;
    updatedAt = null;
    serviceTypeId = null;
    serviceTypeName = null;
    settlementId = null;
    settlementName = null;

    constructor(store, json = null) {
        this.store = store;

        if (json) {
            this.id = json.id;
            this.updateFromJson(json);
        }
    }

    get asJson() {
        return {
            name: this.name,
            lat: this.lat,
            lng: this.lng,
            created_at: this.createdAt,
            updated_at: this.updatedAt,
            service_type_id: this.serviceTypeId,
            settlement_id: this.settlementId,
        };
    }

    updateFromJson(json) {
        this.name = json.name;
        this.lat = json.lat;
        this.lng = json.lng;
        this.createdAt = json.created_at;
        this.updatedAt = json.updated_at;
        this.serviceTypeId = json.service_type_id;
        this.serviceTypeName = json.service_type_name;
        this.settlementId = json.settlement_id;
        this.settlementName = json.settlement_name;
    }

    async delete() {
        if (!this.id) {
            return;
        }
        await this.store.apiService.deleteServicePoint(this.id);
        await this.store.removeServicePoint(this);
    }

    async save() {
        const json = this.asJson;
        if (this.id) {
            await this.store.apiService.updateServicePoint(this.id, json);
        }
        else {
            const responseData = await this.store.apiService.createServicePoint(json);
            this.id = responseData.id;
            await this.store.addServicePoint(this);
        }
    }
}

decorate(ServicePoint, {
    lat: observable,
    lng: observable,
    asJson: computed({ equals: comparer.shallow }),
});

export default ServicePoint;
