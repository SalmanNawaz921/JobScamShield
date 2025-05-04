"use client";

import { useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import BotResponse from "./BotResponse";

const BotResponsePDFWrapper = ({ responseData }) => {
  const componentRef = useRef();

  const handleDownloadPDF = async () => {
    const element = componentRef.current;

    const canvas = await html2canvas(element, {
      scale: 2,
      backgroundColor: null,
      useCORS: true,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("job-scam-analysis.pdf");
  };

  return (
    <div className="relative">
      <div ref={componentRef} className="botresponse-bg">
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
