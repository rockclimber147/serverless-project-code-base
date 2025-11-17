export interface Review {
  review_id: string;
  reviewer_id: string;
  reviewer_name: string,
  rating: number,
  comment: string,
  created_at: Date;
}
