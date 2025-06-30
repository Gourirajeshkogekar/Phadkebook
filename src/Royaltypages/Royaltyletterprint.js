import React, { useRef } from "react";
import { Button } from "@mui/material";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

function RoyaltyLetterPrint() {
  const printRef = useRef();

  // const handlePrint = async () => {
  //   if (!printRef.current) {
  //     alert("Nothing to print! Please try again.");
  //     return;
  //   }

  //   const input = printRef.current;
  //   const pdf = new jsPDF({
  //     orientation: "portrait",
  //     unit: "mm",
  //     format: "a4",
  //   });

  //   try {
  //     const pageDiv = document.createElement("div");
  //     pageDiv.style.width = "210mm";
  //     pageDiv.style.minHeight = "297mm"; // A4 height
  //     pageDiv.style.position = "absolute";
  //     pageDiv.style.background = "white";
  //     // pageDiv.style.padding = "10mm"; // Optional: padding to look nice
  //     pageDiv.style.zIndex = -1; // keep it out of sight
  //     pageDiv.style.overflow = "hidden";

  //     const clonedContent = input.cloneNode(true);
  //     pageDiv.appendChild(clonedContent);
  //     document.body.appendChild(pageDiv);

  //     const canvas = await html2canvas(pageDiv, {
  //       scale: 2,
  //       useCORS: true,
  //     });

  //     const imgData = canvas.toDataURL("image/png");
  //     const imgProps = pdf.getImageProperties(imgData);
  //     const pdfWidth = pdf.internal.pageSize.getWidth();
  //     const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

  //     const pageHeight = pdf.internal.pageSize.getHeight();
  //     let heightLeft = pdfHeight;
  //     let position = 0;

  //     pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
  //     heightLeft -= pageHeight;

  //     while (heightLeft > 0) {
  //       position = heightLeft - pdfHeight;
  //       pdf.addPage();
  //       pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
  //       heightLeft -= pageHeight;
  //     }

  //     document.body.removeChild(pageDiv);

  //     // Preview in new tab (NOT download)
  //     const pdfBlobUrl = pdf.output("bloburl");
  //     window.open(pdfBlobUrl, "_blank");
  //   } catch (error) {
  //     console.error("Error generating receipt PDF:", error);
  //     alert("Failed to generate PDF. Please try again.");
  //   }
  // };

  const handlePrint = async () => {
    if (!printRef.current) {
      alert("Nothing to print! Please try again.");
      return;
    }

    const input = printRef.current;
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    try {
      const canvas = await html2canvas(input, {
        scale: 2,
        useCORS: true,
      });

      const imgData = canvas.toDataURL("image/png");
      const pageWidth = pdf.internal.pageSize.getWidth(); // 210mm
      const pageHeight = pdf.internal.pageSize.getHeight(); // 297mm

      const imgProps = pdf.getImageProperties(imgData);
      const imgWidth = pageWidth;
      const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

      const yOffset = (pageHeight - imgHeight) / 2; // vertical centering (optional)

      pdf.addImage(imgData, "PNG", 0, yOffset, imgWidth, imgHeight);
      const pdfBlobUrl = pdf.output("bloburl");
      window.open(pdfBlobUrl, "_blank");
    } catch (error) {
      console.error("Error generating receipt PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    }
  };

  return (
    <div
      style={{
        width: "195mm",
        minHeight: "285mm",
        // border: "1px solid red",
      }}>
      <div
        ref={printRef}
        style={{
          marginLeft: "20mm",
          marginRight: "18mm",
          marginTop: "45mm",
          marginBottom: "19mm",
          height: "210mm",
          width: "160mm",
          // border: "1px solid black",
        }}>
        {/* <p>Dear Author,</p>
        <p>
          We are pleased to inform you that your royalty has been calculated
          based on the recent sales of your publication.
        </p>
        <p>
          Thank you for your continued contributions to our publishing house.
        </p>
        <p>Sincerely,</p>
        <p>
          <strong>Your Company Name</strong>
        </p> */}
      </div>
      <div
        style={{
          position: "fixed",
          bottom: "20px",
          left: "85%",
          transform: "translateX(-50%)",
          display: "flex",
          justifyContent: "center",
          zIndex: 999,
        }}>
        <Button
          variant="contained"
          onClick={handlePrint}
          sx={{
            backgroundColor: "green",
            color: "white",
            "&:hover": {
              backgroundColor: "darkgreen",
            },
          }}>
          Print
        </Button>
      </div>
    </div>
  );
}

export default RoyaltyLetterPrint;
