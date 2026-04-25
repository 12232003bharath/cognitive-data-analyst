import React, { useState } from "react";
import FileUpload from "./components/FileUpload";
import DataPreview from "./components/DataPreview";
import AskBox from "./components/AskBox";
import ResultTable from "./components/ResultTable";
import ResultChart from "./components/ResultChart";
import PdfReportButton from "./components/PdfReportButton";
import "./App.css";

function App() {
  const [csvData, setCsvData] = useState(null);
  const [queryResult, setQueryResult] = useState(null);

  const handleUploadSuccess = (data) => {
    setCsvData(data);
    setQueryResult(null);
  };

  return (
    <div className="page">
      <div className="container">
        <header className="hero">
          <div className="hero-badge">Gen AI CSV Dashboard</div>
          <h1>Cognitive Data Analyst</h1>
          <p>
            Upload your CSV file, preview your dataset, and ask questions in a
            clean analytics workspace.
          </p>
        </header>

        <section className="stats-row">
          <div className="stat-card">
            <span className="stat-label">Dataset</span>
            <h3>{csvData ? csvData.filename : "No file uploaded"}</h3>
          </div>

          <div className="stat-card">
            <span className="stat-label">Rows</span>
            <h3>{csvData ? csvData.total_rows : "--"}</h3>
          </div>

          <div className="stat-card">
            <span className="stat-label">Columns</span>
            <h3>{csvData ? csvData.columns.length : "--"}</h3>
          </div>
        </section>

        <section className="main-grid">
          <div className="card upload-main-card">
            <FileUpload onUploadSuccess={handleUploadSuccess} />
          </div>

          {csvData && (
            <div className="card ask-main-card">
              <AskBox onResult={setQueryResult} />
            </div>
          )}
        </section>

        {csvData && (
          <section className="card section-card">
            <DataPreview data={csvData} />
          </section>
        )}

        {queryResult && (
          <section className="card section-card">
            <div className="result-toolbar">
              <PdfReportButton csvData={csvData} queryResult={queryResult} />
            </div>
            <ResultTable resultData={queryResult} />
          </section>
        )}

        {queryResult && (
          <section className="card section-card">
            <ResultChart resultData={queryResult} />
          </section>
        )}
      </div>
    </div>
  );
}

export default App;
