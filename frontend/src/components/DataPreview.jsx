import React from "react";

function DataPreview({ data }) {
  if (!data) return null;

  const { filename, columns, total_rows, preview } = data;

  return (
    <div className="preview-card">
      <h2>Dataset Preview</h2>
      <p><strong>File:</strong> {filename}</p>
      <p><strong>Total Rows:</strong> {total_rows}</p>

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
            {preview.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {columns.map((column, colIndex) => (
                  <td key={colIndex}>{row[column]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DataPreview;