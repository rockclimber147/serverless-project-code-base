import { Listing } from "../models/listing";
import { BaseServiceWithAuth } from "./baseAuthApi";
export class ListingCRUDAPIService extends BaseServiceWithAuth {
  private static readonly API = this.API_BASE + "user/listings";

  static async createListing(listingData: Listing) {
    const res = await fetch(ListingCRUDAPIService.API, {
      method: "POST",
      headers: this.getAuthHeader(),
      body: JSON.stringify(listingData),
    });

    if (!res.ok) {
      throw new Error(`Failed to create listing: ${res.status}`);
    }

    const data = await res.json();
    return data;
  }

  static async updateListing(listingId: string, updatedListingFields: any) {
    const res = await fetch(ListingCRUDAPIService.API, {
      method: "PATCH",
      headers: this.getAuthHeader(),
      body: JSON.stringify({
        listing_id: String(listingId),
        ...updatedListingFields,
      }),
    });

    if (!res.ok) {
      throw new Error(`Failed to update listing: ${res.status}`);
    }

    const data = await res.json();
    return data;
  }

  static async deleteListing(listingId: number) {
    const res = await fetch(ListingCRUDAPIService.API, {
      method: "DELETE",
      headers: this.getAuthHeader(),
      body: JSON.stringify({ listing_id: String(listingId) }),
    });

    if (!res.ok) {
      throw new Error(`Failed to delete listing: ${res.status}`);
    }

    const data = await res.json();
    return data;
  }

  static async getUploadLink(listingId: string) {
    const res = await fetch(ListingCRUDAPIService.API + "/photo", {
      method: "POST",
      headers: this.getAuthHeader(),
      body: JSON.stringify({ listing_id: String(listingId) }),
    });

    if (!res.ok) {
      throw new Error(`Failed to get upload link: ${res.status}`);
    }

    return res.json(); // returns { upload_url, public_url }
  }

  static async uploadToS3(uploadUrl: string, file: File) {
    const res = await fetch(uploadUrl, {
      method: "PUT",
      body: file,
    });
    if (!res.ok) throw new Error("Failed to upload image to S3");
  }
}
