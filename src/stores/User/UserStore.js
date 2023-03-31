import {
    flow, decorate, observable, computed,
} from "mobx";
import User from "./User";
import UserApiService from "./UserApiService";
import AppConfig from "../../AppConfig";

class UserStore {
    users = [];
    usersSyndicated = [];
    userInfo = [];
    isLoading = false;
    count = 0;

    constructor(rootStore) {
        this.rootStore = rootStore;
        this.apiService = new UserApiService(AppConfig.API_URL);

        this.loadUsers();
        this.loadSyndicatedUsers();
        this.loadUserInfo();
    }

    get usersSortedByEmail() {
        return this.users.sort((a, b) => {
            if (a.email.toLowerCase() < b.email.toLowerCase()) {
                return -1;
            }
            else if (a.email.toLowerCase() > b.email.toLowerCase()) {
                return 1;
            }
            return 0;
        });
    }

    loadUsers = flow(function* (config) { // eslint-disable-line func-names
        this.isLoading = true;
        try {
            const usersJson = yield this.apiService.fetchAllUsers(config);
            this.users.replace(usersJson.data.map((userJson) => {
                return new User(
                    this,
                    userJson,
                );
            }));
            this.count = usersJson.count;
            this.isLoading = false;
        }
        catch (error) {
            console.error(`UserStore failed to load users. ${error.message}`); // eslint-disable-line no-console
            this.isLoading = false;
        }
    });

    loadSyndicatedUsers = flow(function* (config) { // eslint-disable-line func-names
        this.isLoading = true;
        try {
            const usersJson = yield this.apiService.fetchSyndicatedUsers(config);
            this.usersSyndicated.replace(usersJson.map((userJson) => {
                return new User(
                    this,
                    userJson,
                );
            }));
            this.isLoading = false;
        }
        catch (error) {
            console.error(`UserStore failed to load syndicated users. ${error.message}`); // eslint-disable-line no-console
            this.isLoading = false;
        }
    });

    loadUserInfo = flow(function* () { // eslint-disable-line func-names
        this.isLoading = true;
        try {
            const user = yield this.apiService.getProfile();
            const userJson = yield this.apiService.fetchUserById(user.id);

            this.userInfo.replace(userJson.map((loggedUser)=> {
                return new User(
                    this,
                    loggedUser,
                );
            }));
            this.isLoading = false;
        }
        catch (error) {
            console.error(`UserStore failed to load user info. ${error.message}`); // eslint-disable-line no-console
            this.isLoading = false;
        }
    });

    updateUserFromServer = flow(function* (id) { // eslint-disable-line func-names
        this.isLoading = true;
        const usersJson = yield this.apiService.fetchUserById(id);
        let user = this.users.find((u) => {
            return u.id === id;
        });

        if (usersJson.length === 0 && user) {
            // user no longer exists on the server, remove it locally
            yield this.removeUser(user);
            user = null;
        }
        if (usersJson.length > 0) {
            if (user) {
                user.updateFromJson(usersJson[0]);
            }
            else {
                user = new User(this, usersJson[0]);
                this.users.push(user);
            }
        }
        this.isLoading = false;
        return user;
    });

    removeUser = flow(function* (user) { // eslint-disable-line func-names, require-yield
        this.users.splice(this.users.indexOf(user), 1);
    });

    addUser = flow(function* (user) { // eslint-disable-line func-names, require-yield
        this.users.push(user);
    });
}
decorate(UserStore, {
    users: observable,
    usersSyndicated: observable,
    usersSortedByEmail: computed,
    isLoading: observable,
    userInfo: observable,
});

export default UserStore;
