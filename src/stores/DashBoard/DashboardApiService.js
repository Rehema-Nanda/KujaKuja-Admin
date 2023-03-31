import ApiService from "../ApiService";

export default class DashboardApiService extends ApiService {
    fetchResponsesCount = async () => {
        const responsesCount = await this.makeHttpCall("responses/count");
        return responsesCount.data;
    }
}
