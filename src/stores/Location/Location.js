import {
    decorate, computed, observable, comparer,
} from "mobx";
import lineToPolygon from "@turf/line-to-polygon";
import circle from "@turf/circle";
import _ from "lodash";

class Location {
    store = null;
    id = null;
    name = null;
    geojson = null;
    lat = null;
    lng = null;
    createdAt = null;
    updatedAt = null;
    countryId = null;
    countryName = null;

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
            geojson: JSON.stringify(this.geojson),
            lat: this.lat,
            lng: this.lng,
            created_at: this.createdAt,
            updated_at: this.updatedAt,
            country_id: this.countryId,
        };
    }

    updateFromJson(json) {
        this.name = json.name;
        this.geojson = json.geojson;
        this.lat = json.lat;
        this.lng = json.lng;
        this.createdAt = json.created_at;
        this.updatedAt = json.updated_at;
        this.countryId = json.country_id;
        this.countryName = json.country_name;

        this.fixGeoJson();
    }

    fixGeoJson() {
        // TODO: https://trello.com/c/wxv8WY0m/426-frontend-and-admin-backend-are-both-doing-linestring-to-polygon-conversion-but-differently-json-parsing
        if (this.geojson && typeof this.geojson === "string") {
            this.geojson = JSON.parse(this.geojson);
        }
        if (this.geojson && this.geojson.geometry.type === "LineString") {
            this.geojson = lineToPolygon(this.geojson);
        }

        // TODO: https://trello.com/c/9pBBU3hU/962-some-locations-are-missing-geometry
        // if no geometry, draw a 5km radius circle around coords
        if (this.geojson && _.isEmpty(this.geojson.geometry)) {
            const locationCoords = [this.lng, this.lat];
            const radius = 5;
            const options = { units: "kilometers" };
            this.geojson = circle(locationCoords, radius, options);
        }
    }

    async delete() {
        if (!this.id) {
            return;
        }
        await this.store.apiService.deleteLocation(this.id);
        await this.store.removeLocation(this);
    }

    async save() {
        const json = this.asJson;
        if (this.id) {
            await this.store.apiService.updateLocation(this.id, json);
        }
        else {
            const responseData = await this.store.apiService.createLocation(json);
            this.id = responseData.id;
            await this.store.addLocation(this);
        }
    }
}

decorate(Location, {
    lat: observable,
    lng: observable,
    asJson: computed({ equals: comparer.shallow }),
});

export default Location;
