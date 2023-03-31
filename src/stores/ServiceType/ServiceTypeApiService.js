import ApiService from "../ApiService";

export default class ServiceTypeApiService extends ApiService {
    fetchAllServiceTypes = async (config) => {
        const serviceTypesResponse = await this.makeHttpCall("service_types/paginator", "post", config);
        return serviceTypesResponse.data; // TODO: change data structure returned by API
    };

    fetchServiceTypeById = async (id) => {
        const serviceTypeResponse = await this.makeHttpCall(`service_types/${id}`);
        return serviceTypeResponse.data.data; // TODO: change data structure returned by API
    };

    deleteServiceType = async (id) => {
        const deleteServiceTypeResponse = await this.makeHttpCall(`service_types/${id}`, "delete");
        // TODO: POST/PUT/DELETE endpoints should return string ID to be consistent with GET
        deleteServiceTypeResponse.data.id = deleteServiceTypeResponse.data.id.toString();
        return deleteServiceTypeResponse.data;
    };

    createServiceType = async (serviceTypeJson) => {
        const config = { data: serviceTypeJson };
        const createServiceTypeResponse = await this.makeHttpCall("service_types", "post", config);
        // TODO: POST/PUT/DELETE endpoints should return string ID to be consistent with GET
        createServiceTypeResponse.data.id = createServiceTypeResponse.data.id.toString();
        return createServiceTypeResponse.data;
    };

    updateServiceType = async (id, serviceTypeJson) => {
        const config = { data: serviceTypeJson };
        const updateServiceTypeResponse = await this.makeHttpCall(`service_types/${id}`, "put", config);
        // TODO: POST/PUT/DELETE endpoints should return string ID to be consistent with GET
        updateServiceTypeResponse.data.id = updateServiceTypeResponse.data.id.toString();
        return updateServiceTypeResponse.data;
    };
}
