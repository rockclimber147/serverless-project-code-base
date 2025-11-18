import { BaseServiceWithAuth } from "./baseAuthApi";

export class FavouritesAPIService extends BaseServiceWithAuth {
    private static API = this.API_BASE + "user/favourites/";

    static get_all_favourites() {
        // get all user favourites
    }

    static add_favourite() {
        
    }

    static delete_favourite() {

    }

    static get_favourite() {
        
    }
}