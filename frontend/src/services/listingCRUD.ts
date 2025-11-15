import { Listing } from "../models/listing";
export class ListingCRUDAPIService {
  private static readonly API_BASE =
    "https://ardhu7a4ye.execute-api.us-west-2.amazonaws.com/prod/user/listings";

  static async createListing(listingData: Listing) {
    const token = localStorage.getItem("idToken");

    const res = await fetch(ListingCRUDAPIService.API_BASE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
      body: JSON.stringify(listingData),
    });

    console.log(res);
    if (!res.ok) {
      console.log(res);

      throw new Error(`Failed to create listing: ${res.status}`);
    }

    const data = await res.json();
    if (data?.success == true) {
      return data;
    }
    return null;
  }
}
