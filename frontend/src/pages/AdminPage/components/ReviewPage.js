import 'bootstrap/dist/css/bootstrap.min.css';
import ReviewTable from './ReviewTable';
import { useReviewsList } from "../../../hooks/useReviewsList";

export default function ReviewsPage() {
  const reviews = useReviewsList();
  const activeReviews = reviews.filter(r => !r.deleted);
  
  return (
    <div className="p-4">
      <h2>All Reviews</h2>
      <p>Here you can view, edit, or delete user reviews.</p>
      <div className="review-table mt-3">
        <ReviewTable reviews={(activeReviews)} />
      </div>
    </div>
  );
}