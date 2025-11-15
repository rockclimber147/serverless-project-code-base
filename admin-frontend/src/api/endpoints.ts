export const API_BASE_URL =
  "https://i94mrsytqk.execute-api.us-west-2.amazonaws.com/prod";

export const API_ENDPOINTS = {
  reportedListings: `${API_BASE_URL}/admin/reported-listings`,
  deletedListings: `${API_BASE_URL}/admin/deleted-listings`, //not implemented yet for MVP
  viewListing: `${API_BASE_URL}/public/listing?id=`
};
