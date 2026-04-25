import React from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

function PdfReportButton({ csvData, queryResult }) {
  if (!csvData || !queryResult || queryResult.error) {
    return null;
  }

  const rows = Array.isArray(queryResult.result) ? queryResult.result : [];
  const columns = rows.length > 0 ? Object.keys(rows[0]) : [];

  const formatValue = (value) => {
    if (value === null || value === undefined) return "";
    if (typeof value === "object") return JSON.stringify(value);
    return String(value);
  };

  const isNumeric = (value) => typeof value === "number" && !Number.isNaN(value);

  const getChartConfig = () => {
    if (rows.length === 0 || columns.length !== 2) return null;

    const [col1, col2] = columns;
    const firstRow = rows[0];
    const col1Numeric = isNumeric(firstRow[col1]);
    const col2Numeric = isNumeric(firstRow[col2]);

    if (!col1Numeric && col2Numeric) {
      return { xKey: col1, yKey: col2 };
    }

    if (!col2Numeric && col1Numeric) {
      return { xKey: col2, yKey: col1 };
    }

    return null;
  };

  const addInfoBox = (doc, title, value, y, pageWidth) => {
    autoTable(doc, {
      startY: y,
      theme: "grid",
      head: [[title]],
      body: [[value || "Not available"]],
      styles: {
        fontSize: 10,
        cellPadding: 3.5,
        overflow: "linebreak",
      },
      headStyles: {
        fillColor: [147, 112, 219],
        textColor: 255,
        fontStyle: "bold",
      },
      bodyStyles: {
        fillColor: [252, 251, 255],
        textColor: [47, 32, 87],
      },
      margin: { left: 14, right: 14 },
      tableWidth: pageWidth - 28,
    });

    return doc.lastAutoTable.finalY + 8;
  };

  const addChartSection = (doc, chartConfig, y, pageWidth, pageHeight) => {
    if (!chartConfig) return y;

    const chartRows = rows
      .map((row) => ({
        label: formatValue(row[chartConfig.xKey]),
        value: Number(row[chartConfig.yKey]),
      }))
      .filter((row) => Number.isFinite(row.value));

    const maxValue = Math.max(...chartRows.map((row) => row.value), 0);

    if (chartRows.length === 0 || maxValue <= 0) return y;

    const visibleRows = chartRows.slice(0, 10);
    const sectionHeight = 95;

    if (y > pageHeight - sectionHeight - 18) {
      doc.addPage();
      y = 18;
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(47, 32, 87);
    doc.text("Chart View", 14, y);

    const cardX = 14;
    const cardY = y + 7;
    const cardWidth = pageWidth - 28;
    const cardHeight = sectionHeight - 10;

    doc.setDrawColor(236, 230, 251);
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(cardX, cardY, cardWidth, cardHeight, 4, 4, "FD");

    const plotX = cardX + 14;
    const plotY = cardY + 12;
    const plotWidth = cardWidth - 24;
    const plotHeight = 48;
    const baseY = plotY + plotHeight;

    doc.setDrawColor(226, 218, 247);
    doc.setTextColor(110, 94, 145);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);

    for (let i = 0; i <= 4; i += 1) {
      const gridY = plotY + (plotHeight / 4) * i;
      const tickValue = Math.round(maxValue - (maxValue / 4) * i);
      doc.line(plotX, gridY, plotX + plotWidth, gridY);
      doc.text(formatValue(tickValue), plotX - 3, gridY + 2, { align: "right" });
    }

    const gap = 3;
    const barWidth = Math.max(5, (plotWidth - gap * (visibleRows.length - 1)) / visibleRows.length);

    visibleRows.forEach((row, index) => {
      const barHeight = (row.value / maxValue) * plotHeight;
      const barX = plotX + index * (barWidth + gap);
      const barY = baseY - barHeight;
      const label = row.label.length > 12 ? `${row.label.slice(0, 11)}.` : row.label;

      doc.setFillColor(147, 112, 219);
      doc.roundedRect(barX, barY, barWidth, barHeight, 1.5, 1.5, "F");

      doc.setTextColor(47, 32, 87);
      doc.text(formatValue(row.value), barX + barWidth / 2, barY - 2, { align: "center" });
      doc.text(label, barX + barWidth / 2, baseY + 7, {
        align: "center",
        maxWidth: barWidth + 7,
      });
    });

    doc.setFontSize(9);
    doc.setTextColor(102, 102, 102);
    doc.text(`${chartConfig.xKey} by ${chartConfig.yKey}`, cardX + 10, cardY + cardHeight - 8);

    if (chartRows.length > visibleRows.length) {
      doc.text(
        `Showing first ${visibleRows.length} of ${chartRows.length} chart items.`,
        cardX + cardWidth - 10,
        cardY + cardHeight - 8,
        { align: "right" }
      );
    }

    return cardY + cardHeight + 12;
  };

  const buildFileName = () => {
    const datasetName = (csvData.filename || "dataset")
      .replace(/\.csv$/i, "")
      .replace(/[^a-z0-9-_]+/gi, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
      .toLowerCase();

    return `${datasetName || "dataset"}-query-report.pdf`;
  };

  const handleDownload = () => {
    const doc = new jsPDF({
      orientation: columns.length > 6 ? "landscape" : "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const generatedAt = new Date().toLocaleString();

    doc.setProperties({
      title: "Cognitive Data Analyst Report",
      subject: queryResult.question || "CSV query report",
      creator: "Cognitive Data Analyst",
    });

    doc.setFillColor(147, 112, 219);
    doc.rect(0, 0, pageWidth, 28, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Cognitive Data Analyst Report", 14, 18);

    doc.setTextColor(31, 31, 31);
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");

    let y = 40;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text("Dataset Summary", 14, y);
    y += 8;

    autoTable(doc, {
      startY: y,
      theme: "grid",
      head: [["Field", "Value"]],
      body: [
        ["Filename", csvData.filename || "Not available"],
        ["Total rows", formatValue(csvData.total_rows)],
        ["Total columns", formatValue(csvData.columns?.length)],
        ["Generated at", generatedAt],
      ],
      styles: {
        fontSize: 10,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [147, 112, 219],
        textColor: 255,
      },
      columnStyles: {
        0: { fontStyle: "bold", cellWidth: 42 },
      },
      margin: { left: 14, right: 14 },
    });

    y = doc.lastAutoTable.finalY + 12;

    y = addInfoBox(doc, "Question", queryResult.question, y, pageWidth);

    if (queryResult.mode) {
      y = addInfoBox(doc, "Execution Mode", queryResult.mode, y, pageWidth);
    }

    if (queryResult.sql) {
      y = addInfoBox(doc, "Generated SQL", queryResult.sql, y, pageWidth);
    }

    y = addChartSection(doc, getChartConfig(), y, pageWidth, pageHeight);

    if (y > pageHeight - 55) {
      doc.addPage();
      y = 18;
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text("Result Table", 14, y);
    y += 8;

    if (rows.length === 0) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.text("No rows returned for this query.", 14, y);
    } else {
      autoTable(doc, {
        startY: y,
        theme: "striped",
        head: [columns],
        body: rows.map((row) => columns.map((column) => formatValue(row[column]))),
        styles: {
          fontSize: columns.length > 6 ? 8 : 9,
          cellPadding: 2.5,
          overflow: "linebreak",
        },
        headStyles: {
          fillColor: [147, 112, 219],
          textColor: 255,
        },
        alternateRowStyles: {
          fillColor: [248, 246, 255],
        },
        margin: { left: 14, right: 14 },
      });
    }

    const pageCount = doc.internal.getNumberOfPages();

    for (let pageNumber = 1; pageNumber <= pageCount; pageNumber += 1) {
      doc.setPage(pageNumber);
      doc.setFontSize(9);
      doc.setTextColor(110, 110, 110);
      doc.text("Generated by Cognitive Data Analyst", 14, pageHeight - 10);
      doc.text(
        `Page ${pageNumber} of ${pageCount}`,
        pageWidth - 14,
        pageHeight - 10,
        { align: "right" }
      );
    }

    doc.save(buildFileName());
  };

  return (
    <button type="button" className="report-btn" onClick={handleDownload}>
      Download PDF Report
    </button>
  );
}

export default PdfReportButton;
