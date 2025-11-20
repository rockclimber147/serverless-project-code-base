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

    static async fetchAPI(url: string, method: "GET" | "POST" | "PATCH" | "DELETE", hasAuthHeader: boolean, errorMessage: string, body?: any) {
        const res = await fetch(url, {
            method: method,
            headers: hasAuthHeader ? this.getAuthHeader() : undefined,
            body: body ? JSON.stringify(body) : undefined
        });

        let json;

        try {
            json = await res.json();
        } catch (err) {
            throw new Error(`${errorMessage}: Invalid JSON response`);
        }

        if (!res.ok) {
            const error = json?.error || json?.message || "Unknown error";
            throw new Error(`${errorMessage}: ${error}`);
        }
        return json.data;
    }
}