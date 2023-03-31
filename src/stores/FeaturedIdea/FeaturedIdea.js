import { decorate, computed, comparer } from "mobx";

class FeaturedIdea {
    store = null;
    id = null;
    idea = null;
    createdAt = null;
    updatedAt = null;
    settlementId = null;
    settlementName = null;

    constructor(store, json = null) {
        this.store = store;

        if (json) {
            this.id = json.id;
            this.updateFromJson(json);
        }
    }

    get asJson() {
        return {
            idea: this.idea,
            created_at: this.createdAt,
            updated_at: this.updatedAt,
            settlement_id: this.settlementId,
        };
    }

    updateFromJson(json) {
        this.idea = json.idea;
        this.createdAt = json.created_at;
        this.updatedAt = json.updated_at;
        this.settlementId = json.settlement_id;
        this.settlementName = json.settlement_name;
    }

    async delete() {
        if (!this.id) {
            return;
        }

        await this.store.apiService.deleteFeaturedIdea(this.id);
        await this.store.removeFeaturedIdea(this);
    }

    async save() {
        const json = this.asJson;
        if (this.id) {
            await this.store.apiService.updateFeaturedIdea(this.id, json);
        }
        else {
            const responseData = await this.store.apiService.createFeaturedIdea(json);
            this.id = responseData.id;
            await this.store.addFeaturedIdea(this);
        }
    }
}

decorate(FeaturedIdea, {
    asJson: computed({ equals: comparer.shallow }),
});

export default FeaturedIdea;
