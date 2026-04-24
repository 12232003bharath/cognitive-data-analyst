import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

function isNumeric(value) {
  return typeof value === "number" && !Number.isNaN(value);
}

function ResultChart({ resultData }) {
  if (!resultData || !Array.isArray(resultData.result) || resultData.result.length === 0) {
    return null;
  }

  const rows = resultData.result;
  const columns = Object.keys(rows[0]);

  if (columns.length !== 2) {
    return null;
  }

  const [col1, col2] = columns;

  const firstRow = rows[0];
  const col1Numeric = isNumeric(firstRow[col1]);
  const col2Numeric = isNumeric(firstRow[col2]);

  let xKey = null;
  let yKey = null;

  if (!col1Numeric && col2Numeric) {
    xKey = col1;
    yKey = col2;
  } else if (!col2Numeric && col1Numeric) {
    xKey = col2;
    yKey = col1;
  } else {
    return null;
  }

  return (
    <div className="chart-card">
      <div className="section-head">
        <h2>Chart View</h2>
        <p>Auto-generated chart based on the query result.</p>
      </div>

      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height={360}>
          <BarChart data={rows} margin={{ top: 10, right: 20, left: 10, bottom: 40 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey={xKey}
              angle={-20}
              textAnchor="end"
              interval={0}
              height={70}
            />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey={yKey} radius={[8, 8, 0, 0]} fill="#9370DB" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default ResultChart;