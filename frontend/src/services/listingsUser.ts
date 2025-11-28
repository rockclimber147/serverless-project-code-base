import { Listing } from "../models/listing";
import { BaseServiceWithAuth } from "./baseAuthApi";
import { ListingAPIService } from "./listingsApi";
export class ListingCRUDAPIService extends BaseServiceWithAuth {
    private static readonly API = this.API_BASE + "user/listings";
    private static readonly UPLOAD_PICTURE_API = ListingCRUDAPIService.API + "/photo"

    static async createListing(listingData: Listing): Promise<string | void> {
        const hasAuthHeader = true;
        const errorMessage = "Error creating listing";
        try {
            const data = await this.fetchAPI(ListingCRUDAPIService.API, "POST", hasAuthHeader, errorMessage, listingData);
            return data.listing_id;
        } catch (e) {
            console.log(e);
        }
    }

    static async updateListing(listingId: string, updatedListingFields: any): Promise<boolean> {
        const hasAuthHeader = true;
        const errorMessage = "Error updating listing";
        const body = {
            listing_id: listingId,
            ...updatedListingFields
        };

        try {
            const data = await this.fetchAPI(ListingCRUDAPIService.API, "PATCH", hasAuthHeader, errorMessage, body);
            return true; //data.success;
        } catch (e) {
            console.log(e);
            return false;
        }
    }

    static async deleteListing(listingId: number): Promise<boolean> {
        const hasAuthHeader = true;
        const errorMessage = "Error deleting listing";
        const body = { listing_id: listingId };

        try {
            const data = await this.fetchAPI(ListingCRUDAPIService.API, "DELETE", hasAuthHeader, errorMessage, body);
            return data.success;
        } catch (e) {
            console.log(e)
            return false;
        }
    }

    static async getUploadLink(listingId: string) {
        const hasAuthHeader = true;
        const errorMessage = "Failed to get image url";
        const body = { listing_id: listingId };

        try {
            const data = await this.fetchAPI(ListingCRUDAPIService.UPLOAD_PICTURE_API, "POST", hasAuthHeader, errorMessage, body);
            console.log(data);
            return data;
        } catch (e) {
            console.log(e);
        }
    }

    static async uploadToS3(uploadUrl: string, file: File): Promise<boolean> {
        try {
            const res = await fetch(uploadUrl, {
                method: "PUT",
                body: file,
            });

            if (res.ok) {
                return true;
            } else {
                console.log("Failed to upload image to S3");
            }
        } catch (e) {
            console.log(e);
        }
        return false;
    }
}
