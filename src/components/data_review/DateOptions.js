export default class DateOptions {
    static get CREATED_AT() {
        return "Created At";
    }

    static get UPLOADED_AT() {
        return "Uploaded At";
    }

    static get ALL_OPTIONS() {
        return [this.CREATED_AT, this.UPLOADED_AT];
    }
}
