export default class ServiceType {
    store = null;
    id = null;
    name = null;
    createdAt = null;
    updatedAt = null;

    constructor(store, json = null) {
        this.store = store;

        if (json) {
            this.id = json.id;
            this.updateFromJson(json);
        }
    }

    get asJson() {
        return {
            name: this.name,
            created_at: this.createdAt,
            update_at: this.updatedAt,
        };
    }

    updateFromJson(json) {
        this.name = json.name;
        this.createdAt = json.created_at;
        this.updatedAt = json.updated_at;
    }

    async delete() {
        if (!this.id) {
            return;
        }
        await this.store.apiService.deleteServiceType(this.id);
    }

    async save() {
        const json = this.asJson;
        if (this.id) {
            await this.store.apiService.updateServiceType(this.id, json);
        }
        else {
            const responseData = await this.store.apiService.createServiceType(json);
            this.id = responseData.id;
        }
    }
}
