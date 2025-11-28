import { BaseServiceWithAuth } from "./baseAuthApi";

export class ReviewsCRUDAPIService extends BaseServiceWithAuth {
    private static readonly API = this.API_BASE + "reviews/add-review";

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
                ReviewsCRUDAPIService.API,
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
}
