import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

export default function ReviewTable({ reviews: initialReviews }) {
  const [reviews, setReviews] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedComment, setEditedComment] = useState("");

  useEffect(() => {
    setReviews(initialReviews);
  }, [initialReviews]);

  const handleEditClick = (review) => {
    setEditingId(review.id);
    setEditedComment(review.comment);
  };

  const handleCancelClick = () => {
    setEditingId(null);
    setEditedComment("");
  };

  const handleSubmitClick = async (reviewId) => {
    try {
      const response = await axios.patch(
        `http://localhost:8080/WebShopAppREST/rest/reviews/${reviewId}`,
        { comment: editedComment },
        { headers: { "Content-Type": "application/json" } }
      );

      setReviews((prevReviews) =>
        prevReviews.map((r) =>
          r.id === reviewId ? { ...r, comment: response.data.comment } : r
        )
      );

      setEditingId(null);
      setEditedComment("");
    } catch (err) {
      console.error("Error updating review", err);
    }
  };

  const handleDeleteClick = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;

    try {
      await axios.delete(`http://localhost:8080/WebShopAppREST/rest/reviews/${reviewId}`);
      
      setReviews((prevReviews) => prevReviews.filter((r) => r.id !== reviewId));
    } catch (err) {
      console.error("Error deleting review", err);
      alert("Failed to delete review.");
    }
  };

  if (!reviews || reviews.length === 0) {
    return <div>No reviews found.</div>;
  }

  return (
    <table className="table table-bordered">
      <thead>
        <tr>
          <th>Reviewer</th>
          <th>Reviewed User</th>
          <th>Rating</th>
          <th>Comment</th>
          <th>Date</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {reviews.map((r) => (
          <tr key={r.id}>
            <td>{r.reviewerUsername || r.reviewerId}</td>
            <td>{r.reviewedUserId}</td>
            <td>{r.rating}</td>
            <td>
              {editingId === r.id ? (
                <textarea
                  value={editedComment}
                  onChange={(e) => setEditedComment(e.target.value)}
                  className="form-control"
                />
              ) : (
                r.comment
              )}
            </td>
            <td>{r.date}</td>
             <td>
              {editingId === r.id ? (
                <>
                  <button className="btn btn-sm btn-success me-2" onClick={() => handleSubmitClick(r.id)}>
                    Submit
                  </button>
                  <button className="btn btn-sm btn-secondary" onClick={handleCancelClick}>
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button className="btn btn-sm btn-primary me-2" onClick={() => handleEditClick(r)}>
                    Edit
                  </button>
              <button className="btn btn-sm btn-danger" onClick={() => handleDeleteClick(r.id)}>
                Delete
              </button>
                </>
              )}
              </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
