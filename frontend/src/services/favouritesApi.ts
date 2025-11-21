import { BaseServiceWithAuth } from "./baseAuthApi";

export class FavouritesAPIService extends BaseServiceWithAuth {
    private static API = this.API_BASE + "user/favourites";

    static async getAllFavourites() {
        // get all user favourites
        const hasAuthHeader = true;
        const errorMessage = "Error getting user favourites";
        try {
            const res = await this.fetchAPI(
                this.API,
                "GET",
                hasAuthHeader,
                errorMessage
            );
            const favourites = res.map((fav) => fav.listing_id);
            sessionStorage.setItem("favourites", JSON.stringify(favourites));
            return favourites;
        } catch (e) {
            console.log(e);
            return [];
        }
    }

    static async addFavourite(listing_id: string) {
        const hasAuthHeader = true;
        const body = { listing_id: listing_id };
        const errorMessage = "Error adding favourite listing";
        try {
            await this.fetchAPI(this.API, "POST", hasAuthHeader, errorMessage, body);
        } catch (e) {
            console.log(e);
        }
    }

    static async deleteFavourite(listing_id: string) {
        const hasAuthHeader = true;
        const body = { listing_id: listing_id };
        const errorMessage = "Error deleting favourite listing";
        try {
            await this.fetchAPI(
                this.API,
                "DELETE",
                hasAuthHeader,
                errorMessage,
                body
            );
        } catch (e) {
            console.log(e);
        }
    }

    static async getFavourite(listing_id: string): Promise<boolean | void> {
        const hasAuthHeader = true;
        const errorMessage = "Error getting favourite";
        const url = `${this.API}?listing_id=${encodeURIComponent(listing_id)}`;
        try {
            return await this.fetchAPI(url, "GET", hasAuthHeader, errorMessage);
        } catch (e) {
            console.log(e);
        }
    }
}
