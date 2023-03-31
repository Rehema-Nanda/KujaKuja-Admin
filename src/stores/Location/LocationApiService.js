import ApiService from "../ApiService";

export default class LocationApiService extends ApiService {
    fetchAllLocations = async (config) => {
        const locationsResponse = await this.makeHttpCall("locations/paginator", "post", config);
        return locationsResponse.data; // TODO: change data structure returned by API
    };

    fetchSyndicatedLocations = async () => {
        const locationsResponse = await this.makeHttpCall("locations");
        return locationsResponse.data.data; // TODO: change data structure returned by API
    };

    fetchLocationById = async (id) => {
        const locationResponse = await this.makeHttpCall(`locations/${id}`);
        return locationResponse.data.data; // TODO: change data structure returned by API
    }

    deleteLocation = async (id) => {
        const deleteLocationResponse = await this.makeHttpCall(`locations/${id}`, "delete");
        // TODO: POST/PUT/DELETE endpoints should return string ID to be consistent with GET
        deleteLocationResponse.data.id = deleteLocationResponse.data.id.toString();
        return deleteLocationResponse.data;
    };

    createLocation = async (locationJson) => {
        const config = { data: locationJson };
        const createLocationResponse = await this.makeHttpCall("locations", "post", config);
        // TODO: POST/PUT/DELETE endpoints should return string ID to be consistent with GET
        createLocationResponse.data.id = createLocationResponse.data.id.toString();
        return createLocationResponse.data;
    };

    updateLocation = async (id, locationJson) => {
        const config = { data: locationJson };
        const updateLocationResponse = await this.makeHttpCall(`locations/${id}`, "put", config);
        // TODO: POST/PUT/DELETE endpoints should return string ID to be consistent with GET
        updateLocationResponse.data.id = updateLocationResponse.data.id.toString();
        return updateLocationResponse.data;
    }
}
