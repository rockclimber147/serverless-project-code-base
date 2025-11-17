import { Listing } from "../models/listing";
export class ListingCRUDAPIService {
  private static readonly API_BASE =
    "https://ardhu7a4ye.execute-api.us-west-2.amazonaws.com/prod/user/listings";

  private static checkAuth() {
    const token = localStorage.getItem("idToken");
    if (!token) {
      throw new Error("No auth token found in localStorage");
    }
    return token;
  }

  static async createListing(listingData: Listing) {
    const token = this.checkAuth();
    const res = await fetch(ListingCRUDAPIService.API_BASE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(listingData),
    });

    if (!res.ok) {
      throw new Error(`Failed to create listing: ${res.status}`);
    }

    const data = await res.json();
    return data;
  }

  static async updateListing(listingId: number, updatedListingFields: any) {
    const token = this.checkAuth();
    const res = await fetch(ListingCRUDAPIService.API_BASE, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        listing_id: listingId,
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
    console.log(listingId);
    const token = this.checkAuth();
    const res = await fetch(ListingCRUDAPIService.API_BASE, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ listing_id: String(listingId) }),
    });

    if (!res.ok) {
      throw new Error(`Failed to delete listing: ${res.status}`);
    }

    const data = await res.json();
    return data;
  }

  static async getUploadLink(listingId: number) {
    const token = this.checkAuth();
    const res = await fetch(ListingCRUDAPIService.API_BASE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ listing_id: listingId }),
    });

    if (!res.ok) {
      throw new Error(`Failed to update listing: ${res.status}`);
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
