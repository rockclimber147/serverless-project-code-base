import { Listing } from "@/models/listing";
import { Review } from "@/models/review";
import { BaseServiceWithAuth } from "./baseAuthApi";
import { FavouritesAPIService } from "./favouritesApi";

export class ListingAPIService extends BaseServiceWithAuth {
  private static readonly SEARCH_API = this.API_BASE + "public/search";
  private static readonly GET_LISTING_BY_ID_API =
    this.API_BASE + "public/listing";
  private static readonly GET_USER_LISTINGS_API =
    this.API_BASE + "public/userListings";
  private static readonly GET_USER_FAVOURITED_LISTINGS_API =
    this.API_BASE + "user/favouritedListings";

  static async searchListings(query?: string) {
    const url = query
      ? `${this.SEARCH_API}?name=${encodeURIComponent(query)}`
      : this.SEARCH_API;
    const hasAuthHeader = false;
    const errorMessage = "Error searching listings";

    try {
      const data = await this.fetchAPI(url, "GET", hasAuthHeader, errorMessage);
      return this._castToListingsArray(data);
    } catch (e) {
      console.log(e);
      return [];
    }
  }

  static async getUserListings(userId: string) {
    const url = `${this.GET_USER_LISTINGS_API}?user_id=${encodeURIComponent(userId)}`;
    try {
      const hasAuthHeader = false;
      const errorMessage = "error fetching user listings";
      const data = await this.fetchAPI(url, "GET", hasAuthHeader, errorMessage);

      return this._castToListingsArray(data);
    } catch (e) {
      console.log(e);
      return [];
    }
  }

  //TODO: update and link to reviews
  static async getMyReviews() {}

  static async getFavoriteListings() {
    const url = this.GET_USER_FAVOURITED_LISTINGS_API;
    const hasAuthHeader = true;
    const errorMessage = "Failed to fetch favourited listings";

    try {
      const data = await this.fetchAPI(url, "GET", hasAuthHeader, errorMessage);
      return this._castToListingsArray(data);
    } catch (e) {
      console.log(e);
      return [];
    }
  }

  static async getListingById(id: string) {
    const url = `${this.GET_LISTING_BY_ID_API}?id=${encodeURIComponent(id)}`;
    const hasAuthHeader = false;
    const errorMessage = "Error fetching listing";
    const userId = localStorage.getItem("userId");

    try {
      const data = this.fetchAPI(url, "GET", hasAuthHeader, errorMessage);
      let isFavourite;
      if (userId) {
        isFavourite = await FavouritesAPIService.getFavourite(id);
      }
      return this.castToListingObject(data, isFavourite);
    } catch (e) {
      console.log(e);
    }
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
      is_favourite: item.is_favourite ?? is_favourite,
    } as Listing;
  }

  private static _castToReviewObject(review: any) {
    return {
      review_id: review.review_id,
      reviewer_id: review.reviewer_id,
      reviewer_name: review.reviewer_name,
      comment: review.comment,
      rating: review.rating,
      created_at: new Date(review.created_at * 1000),
    } as Review;
  }

  private static async _castToListingsArray(data: any[]) {
    const favourites = await FavouritesAPIService.getAllFavourites();
    const listings: Listing[] = data.map((item: Listing) => {
      const is_favourite: boolean = favourites.some(
        (f) => f === item.listing_id
      );
      return this.castToListingObject(item, is_favourite);
    });

    return listings;
  }
}
