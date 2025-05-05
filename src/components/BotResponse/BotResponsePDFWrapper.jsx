"use client";

import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import BotResponse from "./BotResponse";

pdfMake.vfs = pdfFonts?.pdfMake?.vfs;

const BotResponsePDFWrapper = ({ responseData }) => {
  const formatContentForPDF = (data) => {
    if (!Array.isArray(data)) return [];

    return data.map((item) => {
      switch (item.type) {
        case "header":
          return {
            text: item.content.toUpperCase(),
            style: "header",
            margin: [0, 10, 0, 5],
          };
        case "section":
          return {
            text: `• ${item.content}`,
            style: "section",
            margin: [0, 2],
          };
        case "summary":
          return {
            text: `Summary:\n${item.content}`,
            style: "summary",
            margin: [0, 10, 0, 5],
          };
        case "advice":
          return {
            text: `Advice:\n${item.content}`,
            style: "advice",
            margin: [0, 10, 0, 5],
          };
        case "footer":
          return { text: item.content, style: "footer", margin: [0, 10, 0, 5] };
        default:
          return { text: item.content, margin: [0, 2] };
      }
    });
  };

  const handleDownloadPDF = () => {
    const docDefinition = {
      content: [
        { text: "Job Scam Analysis Report", style: "title" },
        ...formatContentForPDF(responseData),
      ],
      styles: {
        title: { fontSize: 18, bold: true, margin: [0, 0, 0, 10] },
        header: { fontSize: 14, bold: true },
        section: { fontSize: 12 },
        summary: { fontSize: 12, italics: true },
        advice: { fontSize: 12, italics: true },
        footer: { fontSize: 10, alignment: "center" },
      },
    };

    pdfMake.createPdf(docDefinition).download("job-scam-analysis.pdf");
  };

  return (
    <div className="relative">
      <div>
        <BotResponse responseData={responseData} />
      </div>

      <button
        onClick={handleDownloadPDF}
        className="mt-6 px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
      >
        📄 Download PDF
      </button>
    </div>
  );
};

export default BotResponsePDFWrapper;
