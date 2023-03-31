export default class Config {
    store = null;
    faviconUrl = null;
    highlightColour = null;
    logoUrl = null;
    titleText = null;
    logoFile = null
    faviconFile = null;

    constructor(store, json = null) {
        this.store = store;

        if (json) {
            this.updateFromJson(json);
        }
    }

    get asJson() {
        return {
            favicon_url: this.faviconUrl,
            highlight_colour: this.highlightColour,
            iso_two_letter_code: this.isoTwoLetterCode,
            logo_url: this.logoUrl,
            title_text: this.titleText,
            logo_file: this.logoFile,
            favicon_file: this.faviconFile,
        };
    }

    updateFromJson(json) {
        this.faviconUrl = json.favicon_url;
        this.highlightColour = json.highlight_colour;
        this.logoUrl = json.logo_url;
        this.titleText = json.title_text;
        this.logoFile = null;
        this.faviconFile = null;
    }

    async save() {
        const json = this.asJson;
        await this.store.apiService.putMultipathData(json);
    }
}
