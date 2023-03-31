import {
    decorate, computed, comparer,
} from "mobx";

class User {
    store = null;
    id = null;
    email = null;
    encryptedPassword= null;
    currentSignInAt = null;
    createdAt = null;
    updatedAt = null;
    settlementId = null;
    settlementName = null;
    isAdmin = null;
    isSurvey = null;
    isServiceProvider = null;
    lastSignInAt = null;

    constructor(store, json) {
        this.store = store;

        if (json) {
            this.id = json.id;
            this.updateFromJson(json);
        }
    }


    updateFromJson(json) {
        this.email = json.email;
        this.encryptedPassword = json.encrypted_password;
        this.currentSignInAt = json.current_sign_in_at;
        this.createdAt = json.created_at;
        this.updatedAt = json.updated_at;
        this.settlementId = json.settlement_id;
        this.settlementName = json.settlement_name;
        this.isAdmin = json.is_admin;
        this.isSurvey = json.is_survey;
        this.isServiceProvider = json.is_service_provider;
        this.lastSignInAt = json.last_sign_in_at;
    }

    get asJson() {
        return {
            email: this.email,
            encrypted_password: this.encryptedPassword,
            current_sign_in_at: this.currentSignInAt,
            created_at: this.createdAt,
            updated_at: this.updatedAt,
            settlement_id: this.settlementId,
            is_admin: this.isAdmin,
            is_survey: this.isSurvey,
            is_service_provider: this.isServiceProvider,
            last_sign_in_at: this.lastSignInAt,
        };
    }

    async delete() {
        if (!this.id) {
            return;
        }
        await this.store.apiService.deleteUser(this.id);
        await this.store.removeUser(this);
    }

    async save() {
        const json = this.asJson;
        if (this.id) {
            await this.store.apiService.updateUser(this.id, json);
        }
        else {
            const responseData = await this.store.apiService.createUser(json);
            this.id = responseData.id;
            await this.store.addUser(this);
        }
    }
}

decorate(User, {
    asJson: computed({ equals: comparer.shallow }),
});

export default User;
