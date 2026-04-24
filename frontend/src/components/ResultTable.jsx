import React from "react";

function ResultTable({ resultData }) {
  if (!resultData) return null;

  const {
    error,
    mode,
    question,
    plan,
    sql,
    result,
    available_columns,
    numeric_columns,
  } = resultData;

  if (error) {
    return (
      <div className="result-card">
        <div className="section-head">
          <h2>Query Result</h2>
          <p>The system could not complete this request.</p>
        </div>

        <div className="info-row">
          <div className="info-chip error-chip">Error</div>
          {mode && <div className="info-chip neutral-chip">{mode}</div>}
        </div>

        <div className="error-box">
          <p>{error}</p>

          {available_columns && available_columns.length > 0 && (
            <>
              <h4>Available Columns</h4>
              <div className="chip-wrap">
                {available_columns.map((col, index) => (
                  <span key={index} className="mini-chip">
                    {col}
                  </span>
                ))}
              </div>
            </>
          )}

          {numeric_columns && numeric_columns.length > 0 && (
            <>
              <h4>Numeric Columns</h4>
              <div className="chip-wrap">
                {numeric_columns.map((col, index) => (
                  <span key={index} className="mini-chip secondary-chip">
                    {col}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  const rows = Array.isArray(result) ? result : [];
  const columns = rows.length > 0 ? Object.keys(rows[0]) : [];

  return (
    <div className="result-card">
      <div className="section-head">
        <h2>AI Query Output</h2>
        <p>Review the mode, AI plan, generated SQL, and output data.</p>
      </div>

      <div className="info-row">
        {mode === "planner" && <div className="info-chip planner-chip">AI Planner</div>}
        {mode === "fallback_rule" && (
          <div className="info-chip fallback-chip">Fallback Rule</div>
        )}
        {question && <div className="info-chip neutral-chip">Question: {question}</div>}
      </div>

      {plan && (
        <div className="panel-block">
          <h3>AI Query Plan</h3>
          <pre>{JSON.stringify(plan, null, 2)}</pre>
        </div>
      )}

      {sql && (
        <div className="panel-block">
          <h3>Generated SQL</h3>
          <pre>{sql}</pre>
        </div>
      )}

      <div className="panel-block">
        <h3>Result Table</h3>

        {rows.length === 0 ? (
          <div className="empty-state">No rows returned for this query.</div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  {columns.map((column, index) => (
                    <th key={index}>{column}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {columns.map((column, colIndex) => (
                      <td key={colIndex}>{String(row[column] ?? "")}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default ResultTable;