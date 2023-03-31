export default class ResponseCount {
    store = null;
    satisfied = null;
    count = null

    constructor(store, json = null) {
        this.store = store;

        if (json) {
            this.updateFromJson(json);
        }
    }

    updateFromJson(json) {
        this.satisfied = json.satisfied;
        this.count = json.cnt;
    }
}
