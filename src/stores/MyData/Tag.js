export default class Tag {
    store = null;
    name = null;

    constructor(store, json = null) {
        this.store = store;

        if (json) {
            this.updateFromJson(json);
        }
    }

    updateFromJson(json) {
        this.name = json.name;
    }
}
