import ApiService from "../ApiService";

export default class FeaturedIdeaApiService extends ApiService {
    fetchAllFeaturedIdeas = async (config) => {
        let reqBody;

        const defaultConfig = {
            data: {
                limit: 25,
                page: 1,
            },
        };

        if (config) {
            reqBody = config;
        }
        else {
            reqBody = defaultConfig;
        }

        const featuredIdeasResponse = await this.makeHttpCall("featured_ideas/paginator", "post", reqBody);
        return featuredIdeasResponse.data; // TODO: change data structure returned by API
    }

    fetchFeaturedIdeaById = async (id) => {
        const featuredIdeaResponse = await this.makeHttpCall(`featured_ideas/${id}`);
        return featuredIdeaResponse.data.data; // TODO: change data structure returned by API
    }

    deleteFeaturedIdea = async (id) => {
        const deleteFeaturedIdeaResponse = await this.makeHttpCall(`featured_ideas/${id}`, "delete");
        // TODO: POST/PUT/DELETE endpoints should return string ID to be consistent with GET
        deleteFeaturedIdeaResponse.data.id = deleteFeaturedIdeaResponse.data.id.toString();
        return deleteFeaturedIdeaResponse.data;
    };

    createFeaturedIdea = async (featuredIdeaJson) => {
        const config = { data: featuredIdeaJson };
        const createFeaturedIdeaResponse = await this.makeHttpCall("featured_ideas", "post", config);
        // TODO: POST/PUT/DELETE endpoints should return string ID to be consistent with GET
        createFeaturedIdeaResponse.data.id = createFeaturedIdeaResponse.data.id.toString();
        return createFeaturedIdeaResponse.data;
    };

    updateFeaturedIdea = async (id, featuredIdeaJson) => {
        const config = { data: featuredIdeaJson };
        const updateFeaturedIdeaResponse = await this.makeHttpCall(`featured_ideas/${id}`, "put", config);
        // TODO: POST/PUT/DELETE endpoints should return string ID to be consistent with GET
        updateFeaturedIdeaResponse.data.id = updateFeaturedIdeaResponse.data.id.toString();
        return updateFeaturedIdeaResponse.data;
    }

    fetchFeaturedIdeaLastResponse = async () => {
        const featuredIdeaLastResponse = await this.makeHttpCall("featured_ideas/last");
        return featuredIdeaLastResponse.data;
    };
}
