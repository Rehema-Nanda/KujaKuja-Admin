import {
    decorate, computed, observable, comparer,
} from "mobx";
import lineToPolygon from "@turf/line-to-polygon";

class Country {
    store = null;
    id = null;
    enabled = null;
    name = null;
    isoTwoLetterCode = null;
    geojson = null;
    lat = null;
    lng = null;
    createdAt = null;
    updatedAt = null;

    constructor(store, json = null) {
        this.store = store;

        if (json) {
            this.id = json.id;
            this.updateFromJson(json);
        }
    }

    get asJson() {
        return {
            enabled: this.enabled,
            name: this.name,
            iso_two_letter_code: this.isoTwoLetterCode,
            geojson: JSON.stringify(this.geojson),
            lat: this.lat,
            lng: this.lng,
            created_at: this.createdAt,
            updated_at: this.updatedAt,
        };
    }

    updateFromJson(json) {
        this.enabled = json.enabled;
        this.name = json.name;
        this.isoTwoLetterCode = json.iso_two_letter_code;
        this.geojson = json.geojson;
        this.lat = json.lat;
        this.lng = json.lng;
        this.createdAt = json.created_at;
        this.updatedAt = json.updated_at;

        this.fixGeoJson();
    }

    fixGeoJson() {
        // TODO: https://trello.com/c/wxv8WY0m/426-frontend-and-admin-backend-are-both-doing-linestring-to-polygon-conversion-but-differently-json-parsing
        if (this.geojson && this.geojson.geometry.type === "LineString") {
            this.geojson = lineToPolygon(this.geojson);
        }
    }

    async delete() {
        if (!this.id) {
            return;
        }
        await this.store.apiService.deleteCountry(this.id);
        await this.store.removeCountry(this);
    }

    async save() {
        const json = this.asJson;
        if (this.id) {
            await this.store.apiService.updateCountry(this.id, json);
        }
        else {
            const responseData = await this.store.apiService.createCountry(json);
            this.id = responseData.id;
            await this.store.addCountry(this);
        }
    }
}
decorate(Country, {
    lat: observable,
    lng: observable,
    asJson: computed({ equals: comparer.shallow }),
});

export default Country;
