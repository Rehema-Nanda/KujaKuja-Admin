import ApiService from "../ApiService";

export default class CountryApiService extends ApiService {
    fetchAllCountries = async (config) => {
        const countriesResponse = await this.makeHttpCall("countries/paginator", "post", config);
        return countriesResponse.data; // TODO: change data structure returned by API
    };

    fetchEnabledCountries = async () => {
        const enabledCountriesResponse = await this.makeHttpCall("countries/enabled");
        return enabledCountriesResponse.data.data; // TODO: change data structure returned by API
    };

    fetchCountryById = async (id) => {
        const countryResponse = await this.makeHttpCall(`countries/${id}`);
        return countryResponse.data.data; // TODO: change data structure returned by API
    };

    deleteCountry = async (id) => {
        const deleteCountryResponse = await this.makeHttpCall(`countries/${id}`, "delete");
        // TODO: POST/PUT/DELETE endpoints should return string ID to be consistent with GET
        deleteCountryResponse.data.id = deleteCountryResponse.data.id.toString();
        return deleteCountryResponse.data;
    };

    createCountry = async (countryJson) => {
        const config = { data: countryJson };
        const createCountryResponse = await this.makeHttpCall("countries", "post", config);
        // TODO: POST/PUT/DELETE endpoints should return string ID to be consistent with GET
        createCountryResponse.data.id = createCountryResponse.data.id.toString();
        return createCountryResponse.data;
    };

    updateCountry = async (id, countryJson) => {
        const config = { data: countryJson };
        const updateCountryResponse = await this.makeHttpCall(`countries/${id}`, "put", config);
        // TODO: POST/PUT/DELETE endpoints should return string ID to be consistent with GET
        updateCountryResponse.data.id = updateCountryResponse.data.id.toString();
        return updateCountryResponse.data;
    };
}