import { useNavigate } from "react-router-dom";

export default function ReviewTable({ reviews }) {
  const navigate = useNavigate();

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
            <td>{r.comment}</td>
            <td>{r.date}</td>
            <td>
              <button
                className="btn btn-sm btn-primary me-2"
                onClick={() => navigate(`/admin/review/${r.id}`)}
              >
                Edit
              </button>
              <button
                className="btn btn-sm btn-danger"
                onClick={() => console.log("Delete review", r.id)}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
