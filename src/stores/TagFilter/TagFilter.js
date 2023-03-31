import {
    decorate, computed, comparer,
} from "mobx";

class TagFilter {
    store = null;
    id = null;
    tagText = null;
    searchText = null;
    startDate = null;
    endDate = null;
    createdAt = null;
    updatedAt = null;
    status = null;
    locations = null;

    constructor(store, json = null) {
        this.store = store;

        if (json) {
            this.id = json.id;
            this.updateFromJson(json);
        }
    }

    get asJson() {
        return {
            tag_text: this.tagText,
            search_text: this.searchText,
            start_date: this.startDate,
            end_date: this.endDate,
            created_at: this.createdAt,
            updated_at: this.updatedAt,
            status: this.status,
            locations: this.locations,
        };
    }

    updateFromJson(json) {
        this.tagText = json.tag_text;
        this.searchText = json.search_text;
        this.startDate = json.start_date;
        this.endDate = json.end_date;
        this.createdAt = json.created_at;
        this.updatedAt = json.updated_at;
        this.status = json.status;
        this.locations = json.locations;
    }

    async save() {
        const json = this.asJson;
        if (this.id) {
            await this.store.apiService.updateTagFilter(this.id, json);
        }
        else {
            const responseData = await this.store.apiService.createTagFilter(json);
            this.id = parseInt(responseData.id, 10);
            this.status = this.status || "EDITING";
            this.createdAt = this.createdAt || new Date();
            await this.store.createTagFilter(this);
        }
    }

    async delete() {
        if (!this.id) {
            return;
        }

        await this.store.apiService.deleteTagFilter(this.id);
        await this.store.removeTagFilter(this);
    }
}

decorate(TagFilter, {
    asJson: computed({ equals: comparer.shallow }),
});

export default TagFilter;
