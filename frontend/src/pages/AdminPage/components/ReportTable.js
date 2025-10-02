import { useState, useEffect } from "react";
import axios from "axios";

export default function ReportTable({ reports: initialReports }) {
  const [reports, setReports] = useState([]);
  const [rejectingId, setRejectingId] = useState(null);
  const [rejectReason, setRejectReason] = useState("");

  useEffect(() => {
    setReports(initialReports);
  }, [initialReports]);

  const handleAcceptClick = async (reportId, reportedUserId) => {
    try {
      const response = await axios.patch(
        `http://localhost:8080/WebShopAppREST/rest/report/${reportId}/accept`,
        { reportedUserId: reportedUserId },
        { headers: { "Content-Type": "application/json" } }
      );

      setReports((prev) => prev.map((r) => r.id === reportId ? { ...r, status: "ACCEPTED" } : r)
      );
    } catch (err) {
      console.error("Error accepting report", err);
      alert("Failed to accept report.");
    }
  };

  const handleRejectClick = (reportId) => {
    setRejectingId(reportId);
    setRejectReason("");
  };

  const handleSubmitReject = async (reportId) => {
    if (!rejectReason.trim()) {
      alert("Please provide a rejection reason.");
      return;
    }

    try {
      await axios.patch(
        `http://localhost:8080/WebShopAppREST/rest/report/${reportId}/reject`,
        { rejectionReason: rejectReason },
        { headers: { "Content-Type": "application/json" } }
      );

      setReports((prev) => prev.map((r) => r.id === reportId ? { ...r, status: "REJECTED", reason: rejectReason } : r)
      );

      setRejectingId(null);
      setRejectReason("");
    } catch (err) {
      console.error("Error rejecting report", err);
      alert("Failed to reject report.");
    }
  };

  const handleCancelReject = () => {
    setRejectingId(null);
    setRejectReason("");
  };

  if (!reports || reports.length === 0) {
    return <div>No reports found.</div>;
  }

  return (
    <table className="table table-bordered">
      <thead>
        <tr>
          <th>Submitted By</th>
          <th>Reported User</th>
          <th>Reason</th>
          <th>Date</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {reports.map((r) => (
          <tr key={r.id}>
            <td>{r.submittedByUserId}</td>
            <td>{r.reportedUserId}</td>
            <td>{r.reportReason}</td>
            <td>{r.submissionDate}</td>
            <td>{r.status}</td>
            <td>
              {r.status === "SUBMITTED" && (
                <>
                  <button className="btn btn-sm btn-success me-2" onClick={() => handleAcceptClick(r.id, r.reportedUserId)}>
                    Accept
                  </button>

                  {rejectingId === r.id ? (
                    <>
                      <textarea
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        placeholder="Reason for rejection"
                        className="form-control mb-2"
                      />
                      <button className="btn btn-sm btn-danger me-2" onClick={() => handleSubmitReject(r.id)}>
                        Submit Reject
                      </button>
                      <button className="btn btn-sm btn-secondary" onClick={handleCancelReject}>
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button className="btn btn-sm btn-warning" onClick={() => handleRejectClick(r.id)}>
                      Reject
                    </button>
                  )}
                </>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}