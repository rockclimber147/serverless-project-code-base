export class BaseServiceWithAuth {
    static readonly API_BASE =
        "https://ardhu7a4ye.execute-api.us-west-2.amazonaws.com/prod/";

    static getAuthHeader() {
        return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this._checkAuth()}`,
      }
    }

    static _checkAuth() {
        const token = localStorage.getItem("idToken");
        if (!token) {
            throw new Error("No auth token found in localStorage");
        }
        return token;
    }
}