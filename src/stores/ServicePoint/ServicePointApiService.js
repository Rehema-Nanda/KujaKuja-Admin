import ApiService from "../ApiService";

export default class ServicePointApiService extends ApiService {
    fetchAllServicePoints = async (config) => {
        const servicePointsResponse = await this.makeHttpCall("service_points/paginator", "post", config);
        return servicePointsResponse.data; // TODO: change data structure returned by API
    };

    fetchSyndicatedServicePoints = async () => {
        const servicePointsResponse = await this.makeHttpCall("service_points");
        return servicePointsResponse.data.data; // TODO: change data structure returned by API
    };

    fetchServicePointById = async (id) => {
        const servicePointResponse = await this.makeHttpCall(`service_points/${id}`);
        return servicePointResponse.data.data; // TODO: change data structure returned by API
    };

    deleteServicePoint = async (id) => {
        const deleteServicePointResponse = await this.makeHttpCall(`service_points/${id}`, "delete");
        // TODO: POST/PUT/DELETE endpoints should return string ID to be consistent with GET
        deleteServicePointResponse.data.id = deleteServicePointResponse.data.id.toString();
        return deleteServicePointResponse.data;
    };

    createServicePoint = async (servicePointJson) => {
        const config = { data: servicePointJson };
        const createServicePointResponse = await this.makeHttpCall("service_points", "post", config);
        // TODO: POST/PUT/DELETE endpoints should return string ID to be consistent with GET
        createServicePointResponse.data.id = createServicePointResponse.data.id.toString();
        return createServicePointResponse.data;
    };

    updateServicePoint = async (id, servicePointJson) => {
        const config = { data: servicePointJson };
        const updateServicePointResponse = await this.makeHttpCall(`service_points/${id}`, "put", config);
        // TODO: POST/PUT/DELETE endpoints should return string ID to be consistent with GET
        updateServicePointResponse.data.id = updateServicePointResponse.data.id.toString();
        return updateServicePointResponse.data;
    };
}