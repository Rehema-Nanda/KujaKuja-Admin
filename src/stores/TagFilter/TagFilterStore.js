import {
    flow, decorate, observable, computed, onBecomeObserved,
} from "mobx";
import openSocket from "socket.io-client";
import TagFilter from "./TagFilter";
import TagFilterApiService from "./TagFilterApiService";
import AppConfig from "../../AppConfig";

class TagFilterStore {
    tagFilters = [];
    isLoading = false;

    constructor(rootStore) {
        this.rootStore = rootStore;
        this.apiService = new TagFilterApiService(AppConfig.API_URL);

        this.loadTagFilters();

        const socket = openSocket(AppConfig.ROOT_API_URL, { transports: ["polling"] });

        socket.on("connected", () => {
            socket.emit("listening for tag filter change", {});
        });

        const openStream = () => {
            socket.on("tagFilterTableChanged", () => {
                this.loadTagFilters();
            });
        };
        onBecomeObserved(this, "tagFilters", openStream);
    }

    get tagFiltersSortedByTagText() {
        return this.tagFilters.sort((a, b) => {
            if (a.tagText < b.tagText) {
                return -1;
            }
            else if (a.tagText > b.tagText) {
                return 1;
            }
            return 0;
        });
    }

    loadTagFilters = flow(function* () { // eslint-disable-line func-names
        this.isLoading = true;

        try {
            const tagFiltersJson = yield this.apiService.fetchAllTagFilters();

            this.tagFilters.replace(tagFiltersJson.map((tagFilterJson) => {
                return new TagFilter(
                    this,
                    tagFilterJson,
                );
            }));
            this.isLoading = false;
        }
        catch (error) {
            console.error(`TagFilterStore failed to load tags. ${error.message}`); // eslint-disable-line no-console
            this.isLoading = false;
        }
    });

    updateTagFromServer = flow(function* (id) { // eslint-disable-line func-names
        const tagFilterId = parseInt(id, 10);
        this.isLoading = true;
        const tagsJson = yield this.apiService.fetchTagFilterById(id);
        let tagFilter = this.tagFilters.find((t) => {
            return t.id === tagFilterId;
        });

        if (!tagsJson && tagFilter) {
            // tag no longer exists on the server, remove it locally
            yield this.removeTagFilter(tagFilter);
            tagFilter = null;
        }
        if (tagsJson) {
            if (tagFilter) {
                tagFilter.updateFromJson(tagsJson);
            }
            else {
                tagFilter = new TagFilter(this, tagsJson);
                this.tagFilters.push(tagFilter);
            }
        }
        this.isLoading = false;
        return tagFilter;
    });

    removeTagFilter = flow(function* (tagFilter) { // eslint-disable-line func-names, require-yield
        this.tagFilters.splice(this.tagFilters.indexOf(tagFilter), 1);
    });

    createTagFilter = flow(function* (tagFilter) { // eslint-disable-line func-names, require-yield
        this.tagFilters.push(tagFilter);
    });
}

decorate(TagFilterStore, {
    tagFilters: observable,
    tagFiltersSortedByTagText: computed,
    isLoading: observable,
});

export default TagFilterStore;
