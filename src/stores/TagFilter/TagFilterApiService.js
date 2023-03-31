import ApiService from "../ApiService";

export default class TagFilterApiService extends ApiService {
    fetchAllTagFilters = async () => {
        const tagFiltersResponse = await this.makeHttpCall("tags/tag_filters");
        return tagFiltersResponse.data.data; // TODO: change data structure returned by API
    };

    runAllTagFilters = async () => {
        const tagFilters = await this.makeHttpCall("tags/bulk_tag");
        return tagFilters.data.data;
    };

    runTagFilterById = async (id) => {
        const tagResponse = await this.makeHttpCall(`tags/bulk_tag/${id}`);
        return tagResponse.data.data;
    };

    updateTagFilter = async (id, tagJson) => {
        const config = { data: tagJson };
        const updateTagFilterResponse = await this.makeHttpCall(`tags/tag_filters/${id}`, "put", config);
        return updateTagFilterResponse.data;
    };

    createTagFilter = async (tagJson) => {
        const config = { data: tagJson };
        const createTagFilterResponse = await this.makeHttpCall(`tags/tag_filters`, "post", config);
        createTagFilterResponse.data.id = createTagFilterResponse.data.id.toString();
        return createTagFilterResponse.data;
    }

    deleteTagFilter = async (id) => {
        const deleteTagFilterResponse = await this.makeHttpCall(`tags/tag_filters/${id}`, "delete");
        deleteTagFilterResponse.data.id = deleteTagFilterResponse.data.id.toString();
        return deleteTagFilterResponse.data;
    };

    fetchTagFilterById = async (id) => {
        const tagResponse = await this.makeHttpCall(`tags/tag_filters/${id}`);
        return tagResponse.data.data; // TODO: change data structure returned by API
    };

    undoTagFilterBulkTagById = async (id) => {
        const tagResponse = await this.makeHttpCall(`tags/bulk_tag/undo/${id}`);
        return tagResponse.data.data;
    }
}
