import { BaseServiceWithAuth } from "./baseAuthApi";

export class FavouritesAPIService extends BaseServiceWithAuth {
    private static API = this.API_BASE + "user/favourites";

    static async get_all_favourites() {
        // get all user favourites
        const hasAuthHeader = true;
        const errorMessage = "Error getting user favourites";
        try {
            const res = await this.fetchAPI(this.API, "GET", hasAuthHeader, errorMessage);
            if (res.success == true) {
                console.log("Successfully favourited listing");
                console.log(res);
                const favourites = res.favourites.map(fav => fav.listing_id);
                sessionStorage.setItem("favourites", JSON.stringify(favourites))
            } 
        } catch (e) {
            console.log(e);
        }
    }

    static async add_favourite(listing_id: string) {
        const hasAuthHeader = true;
        const body = JSON.stringify({ listing_id: String(listing_id) })
        const errorMessage = "Error adding favourite listing";
        try {
            const res = await this.fetchAPI(this.API, "POST", hasAuthHeader, errorMessage, body);
            if (res.success == true) {
                console.log("Successfully favourited listing");
            } 
        } catch (e) {
            console.log(e);
        }
    }

    static async delete_favourite(listing_id: string) {
        const hasAuthHeader = true;
        const body = JSON.stringify({ listing_id: String(listing_id) })
        const errorMessage = "Error deleting favourite listing";
        try {
            const res = await this.fetchAPI(this.API, "DELETE", hasAuthHeader, errorMessage, body);

            if (res.success == true) {
                console.log("Successfully deleted listing");
            } 
        } catch (e) {
            console.log(e);
        }
    }

    static get_favourite() {

    }
}