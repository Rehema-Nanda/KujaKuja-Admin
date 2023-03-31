import { flow, decorate, observable } from "mobx";
import FeaturedIdea from "./FeaturedIdea";
import FeaturedIdeaApiService from "./FeaturedIdeaApiService";
import AppConfig from "../../AppConfig";

class FeaturedIdeaStore {
    featuredIdeas = [];
    lastFeaturedIdea = [];
    isLoading = false;
    count = 0;

    constructor(rootStore) {
        this.rootStore = rootStore;
        this.apiService = new FeaturedIdeaApiService(AppConfig.API_URL);

        this.loadFeaturedIdeas();
        this.loadLastFeaturedIdea();
    }

    loadFeaturedIdeas = flow(function* (config) { // eslint-disable-line func-names
        this.isLoading = true;

        try {
            const featuredIdeasJson = yield this.apiService.fetchAllFeaturedIdeas(config);

            this.featuredIdeas.replace(featuredIdeasJson.data.map((featuredIdeaJson) => {
                return new FeaturedIdea(
                    this,
                    featuredIdeaJson,
                );
            }));
            this.count = featuredIdeasJson.count;
            this.isLoading = false;
        }
        catch (error) {
            console.error(`FeaturedIdeaStore failed to load featured ideas. ${error.message}`); // eslint-disable-line no-console
            this.isLoading = false;
        }
    });

    loadLastFeaturedIdea = flow(function* () { // eslint-disable-line func-names
        this.isLoading = true;
        try {
            const lastIdeaJson = yield this.apiService.fetchFeaturedIdeaLastResponse();
            this.lastFeaturedIdea.replace(lastIdeaJson.map((ideaJson) => {
                return new FeaturedIdea(
                    this,
                    ideaJson,
                );
            }));
            this.isLoading = false;
        }
        catch (error) {
            console.error(`DashBoardStore failed to load last fearured idea. ${error.message}`); // eslint-disable-line no-console
            this.isLoading = false;
        }
    });

    updateFeaturedIdeaFromServer = flow(function* (id) { // eslint-disable-line func-names
        this.isLoading = true;
        const featuredIdeasJson = yield this.apiService.fetchFeaturedIdeaById(id);
        let featuredIdea = this.featuredIdeas.find((fi) => {
            return fi.id === id;
        });

        if (featuredIdeasJson.length === 0 && featuredIdea) {
            // featured idea no longer exists on the server, remove it locally
            yield this.removeFeaturedIdea(featuredIdea);
            featuredIdea = null;
        }
        if (featuredIdeasJson.length > 0) {
            if (featuredIdea) {
                featuredIdea.updateFromJson(featuredIdeasJson[0]);
            }
            else {
                featuredIdea = new FeaturedIdea(this, featuredIdeasJson[0]);
                this.featuredIdeas.push(featuredIdea);
            }
        }
        this.isLoading = false;
        return featuredIdea;
    });

    removeFeaturedIdea = flow(function* (idea) { // eslint-disable-line func-names, require-yield
        this.featuredIdeas.splice(this.featuredIdeas.indexOf(idea), 1);
    });

    addFeaturedIdea = flow(function* (idea) { // eslint-disable-line func-names, require-yield
        this.featuredIdeas.push(idea);
    });
}

decorate(FeaturedIdeaStore, {
    featuredIdeas: observable,
    lastFeaturedIdea: observable,
    isLoading: observable,
});

export default FeaturedIdeaStore;
