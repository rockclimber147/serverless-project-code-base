import { Listing } from "@/models/listing";

export class ListingAPIService {
  private static readonly API_BASE =
    "https://ardhu7a4ye.execute-api.us-west-2.amazonaws.com/prod/public/";
  private static readonly SEARCH_API = this.API_BASE + `search`;
  private static readonly GET_LISTING_BY_ID_API = this.API_BASE + `listing`;

  static async searchListings(query?: string) {
    const url = query
      ? `${this.SEARCH_API}?name=${encodeURIComponent(query)}`
      : this.SEARCH_API;
    const res = await fetch(url);
    if (!res.ok) {
      console.log(res);
      throw new Error(`Failed to fetch listings: ${res.status}`);
    }

    const rawListings = await res.json();
    const listings: Listing[] = rawListings.map((item) =>
      this.castToListingObject(item)
    );
    return listings;
  }

  static async getListingById(id: string) {
    const url = `${this.GET_LISTING_BY_ID_API}?id=${encodeURIComponent(id)}`;
    const res = await fetch(url);
    if (!res.ok) {
      console.log(res);
      throw new Error(`Failed to fetch listing: ${res.status}`);
    }

    const rawListing = await res.json();
    return this.castToListingObject(rawListing);
  }

  private static castToListingObject(item: any) {
    return {
      listing_id: item.listing_id,
      user_id: item.user_id,
      item_name: item.item_name,
      price: item.price,
      details: item.details,
      is_sold: item.is_sold,
      location: item.location,
      latitude: item.latitude,
      longitude: item.longitude,
      image: item.image,
      created_at: new Date(item.created_at * 1000),
    } as Listing;
  }
}
