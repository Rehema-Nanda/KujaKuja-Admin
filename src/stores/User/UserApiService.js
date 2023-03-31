import ApiService from "../ApiService";

export default class UserApiService extends ApiService {
    fetchAllUsers = async (config) => {
        const usersResponse = await this.makeHttpCall("users/paginator", "post", config);
        return usersResponse.data; // TODO: change data structure returned by API
    }

    fetchSyndicatedUsers = async () => {
        const usersResponse = await this.makeHttpCall("users");
        return usersResponse.data.data; // TODO: change data structure returned by API
    }

    fetchUserById = async (id) => {
        const userResponse = await this.makeHttpCall(`users/${id}`);
        return userResponse.data.data; // TODO: change data structure returned by API
    }

    deleteUser = async (id) => {
        const deleteUserResponse = await this.makeHttpCall(`users/${id}`, "delete");
        // TODO: POST/PUT/DELETE endpoints should return string ID to be consistent with GET
        deleteUserResponse.data.id = deleteUserResponse.data.id.toString();
        return deleteUserResponse.data;
    };

    createUser = async (userJson) => {
        const config = { data: userJson };
        const createUserResponse = await this.makeHttpCall("users", "post", config);
        // TODO: POST/PUT/DELETE endpoints should return string ID to be consistent with GET
        createUserResponse.data.id = createUserResponse.data.id.toString();
        return createUserResponse.data;
    };

    updateUser = async (id, userJson) => {
        const config = { data: userJson };
        const updateUserResponse = await this.makeHttpCall(`users/${id}`, "put", config);
        // TODO: POST/PUT/DELETE endpoints should return string ID to be consistent with GET
        updateUserResponse.data.id = updateUserResponse.data.id.toString();
        return updateUserResponse.data;
    }
}
