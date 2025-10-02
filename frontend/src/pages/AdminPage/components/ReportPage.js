import 'bootstrap/dist/css/bootstrap.min.css';
import ReportTable from './ReportTable';
import { useReportsList } from "../../../hooks/useReportsList";

export default function ReportPage() {
  const reports = useReportsList();
  
  return (
    <div className="p-4">
      <h2>All Reports</h2>
      <p>Here you can review and either accept or reject user reports.</p>
      <div className="review-table mt-3">
        <ReportTable reports={reports}/>
      </div>
    </div>
  );
}