export default class AppConfig {
    static get ROOT_API_URL() {
        // return "http://localhost:8080";
        return "https://api.dev.ccd.kujakuja.com/";
    }

    static get API_URL() {
        return `${this.ROOT_API_URL}/api/v3/`;
    }

    static get SITE_HEADER_DEFAULT_HIGHLIGHT_COLOUR() {
        return "#FFC300";
    }

    static get SITE_HEADER_DEFAULT_TITLE_TEXT() {
        return "Customer feedback";
    }

    static get MAPBOX_GL_ACCESS_TOKEN() {
        return "pk.eyJ1IjoiYmFycnlsYWNoYXBlbGxlIiwiYSI6IkVkT1FZX2MifQ.sSg105ALmN6eQgutNxWTOA";
    }

    static get MAPBOX_GL_MAP_STYLE_URL() {
        return "mapbox://styles/barrylachapelle/cjlwoyk4e3skr2smu4fl2xrjv";
    }

    static get FRONT_END_URL() {
        return "http://localhost:3000/en/";
        // return "https://dev.alight.kujakuja.com/en";
    }
}
