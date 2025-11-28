import { BaseServiceWithAuth } from "./baseAuthApi";

export class ReviewsCRUDAPIService extends BaseServiceWithAuth {
    private static readonly addAPI = this.API_BASE + "reviews/add-review";
    private static readonly getAPI = this.API_BASE + "reviews/getReviews";

    static async addReview(review: {
        listing_id: string;
        seller: string;
        buyer: string;
        rating: number;
    }): Promise<boolean> {
        const hasAuthHeader = true;
        const errorMessage = "Error adding/updating review";
        try {
            const data = await this.fetchAPI(
                ReviewsCRUDAPIService.addAPI,
                "POST",
                hasAuthHeader,
                errorMessage,
                review
            );
            return true;
        } catch (e) {
            console.log(e);
            return false;
        }
    }

    static async getReviews(sellerId: string): Promise<any[]> {
        const hasAuthHeader = true;
        const errorMessage = "Error fetching reviews";
        try {
            const url = `${ReviewsCRUDAPIService.getAPI}?seller=${encodeURIComponent(sellerId)}`;
            const data = await this.fetchAPI(
                url,
                "GET",
                hasAuthHeader,
                errorMessage
            );
            return data || [];
        } catch (e) {
            console.log(e);
            return [];
        }
    }
}
