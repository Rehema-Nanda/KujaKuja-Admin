import ApiService from "../ApiService";

export default class MyDataApiService extends ApiService {
    fetchMyData = async (config) => {
        let reqBody;

        const defaultConfig = {
            data: {
                limit: 100,
                page: 1,
            },
        };

        if (config) {
            reqBody = config;
        }
        else {
            reqBody = defaultConfig;
        }

        const myData = await this.makeHttpCall("responses/admin/my_data", "post", reqBody);
        return myData.data;
    }

    fetchAllTags = async () => {
        const tags = await this.makeHttpCall("tags");
        return tags.data.data;
    }

    updateResponses = async (config) => {
        const reponses = await this.makeHttpCall("responses/admin/update", "patch", config);
        return reponses.data;
    }

    tagResponses = async (config) => {
        const res = await this.makeHttpCall("tags", "post", config);
        return res.data;
    }

    deleteTag = async (responseId, tag) => {
        const config = {
            data: {
                tag: tag,
            },
        };
        const res = await this.makeHttpCall(`tags/${responseId}`, "delete", config);
        return res.data;
    }
}
