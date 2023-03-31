import ApiService from "../ApiService";

export default class ConfigApiService extends ApiService {
    fetchConfig = async () => {
        const config = await this.makeHttpCall("config");
        return config.data.site_header;
    }

    putMultipathData = async (configJson) => {
        const data = new FormData();
        data.append("logo", configJson.logo_file);
        data.append("favicon", configJson.favicon_file);
        data.append("title_text", configJson.title_text);
        data.append("highlight_colour", configJson.highlight_colour);
        const config = {
            headers: {
                "Content-Type": "multipart/form-data",
                Accept: "application/json",
            },
            data: data,
        };
        const updateConfigResponse = await this.makeHttpCall("config/site_header", "put", config);
        return updateConfigResponse.data;
    }
}
