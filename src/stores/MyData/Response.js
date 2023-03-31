export default class Response {
    store = null;
    id = null;
    idea = null;
    satisfied = null;
    isStarred = null;
    ideaLanguage = null;
    serviceType = null;
    location = null;
    servicePoint = null;
    userLocation = null
    user = null;
    tags = null;
    createdAt = null;
    uploadedAt = null;

    constructor(store, json = null) {
        this.store = store;

        if (json) {
            this.id = json.id;
            this.updateFromJson(json);
        }
    }

    updateFromJson(json) {
        this.idea = json.idea;
        this.satisfied = json.satisfied;
        this.isStarred = json.is_starred;
        this.ideaLanguage = json.idea_language;
        this.serviceType = json.service_type;
        this.location = json.location;
        this.servicePoint = json.service_point;
        this.userLocation = json.user_location;
        this.user = json.user;
        this.tags = json.tags;
        this.createdAt = json.created_at;
        this.uploadedAt = json.uploaded_at;
    }
}
