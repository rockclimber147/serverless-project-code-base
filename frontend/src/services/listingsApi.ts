import { Listing } from "@/models/listing";
import { Review } from "@/models/review";

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
    const stored = sessionStorage.getItem("favourites");
    const favourites: string[] = stored ? JSON.parse(stored) : [];

    const listings: Listing[] = rawListings.map((item: Listing) => {
      const is_favourite: boolean = favourites.some(
        (f) => f === item.listing_id
      );
      return this.castToListingObject(item, is_favourite);
    });

    return listings;
  }

  //TODO: update and link my listings
  static async getMyListings(userId: string) {
    const url = `${this.SEARCH_API}?name=${encodeURIComponent(userId)}`;
    const res = await fetch(url);
    if (!res.ok) {
      console.log(res);
      throw new Error(`Failed to fetch My Listings: ${res.status}`);
    }

    const rawListings = await res.json();
    const listings: Listing[] = rawListings.map((item: Listing) =>
      this.castToListingObject(item)
    );

    return listings;
  }

  //TODO: update and link to reviews
  static async getMyReviews() {
    const url = this.SEARCH_API;
    const res = await fetch(url);
    if (!res.ok) {
      console.log(res);
      throw new Error(`Failed to fetch favorite listings: ${res.status}`);
    }

    const rawListings = await res.json();
    const listings: Review[] = rawListings.map((item: Review) =>
      this.castToListingObject(item)
    );

    return listings;
  }

  //TODO: update and link to favorites
  static async getFavoriteListings() {
    const url = this.SEARCH_API;
    const res = await fetch(url);
    if (!res.ok) {
      console.log(res);
      throw new Error(`Failed to fetch favorite listings: ${res.status}`);
    }

    const rawListings = await res.json();
    const listings: Listing[] = rawListings.map((item: Listing) =>
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

static castToListingObject(item: any, is_favourite?: boolean) {
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
      image: item.image
        ? item.image
        : "https://media.istockphoto.com/id/1980276924/vector/no-photo-thumbnail-graphic-element-no-found-or-available-image-in-the-gallery-or-album-flat.jpg?s=1024x1024&w=is&k=20&c=qToocb5EafYO6QXp9aI01a72r5jcQccjgxbs_6Ae8eQ=",
      created_at: new Date(item.created_at * 1000),
      is_favourite: is_favourite,
    } as Listing;
  }
  private static castToReviewObject(review: any) {
    return {
      review_id: review.review_id,
      reviewer_id: review.reviewer_id,
      reviewer_name: review.reviewer_name,
      comment: review.comment,
      rating: review.rating,
      created_at: new Date(review.created_at * 1000),
    } as Review;
  }
}
