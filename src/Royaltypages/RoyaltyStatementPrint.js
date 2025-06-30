import React, { useRef } from "react";
import { Button } from "@mui/material";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

function RoyaltyStatementprint() {
  const printRef = useRef();

  const handlePrint = async () => {
    if (!printRef.current) {
      alert("Nothing to print! Please try again.");
      return;
    }

    const input = printRef.current;
    const pdf = new jsPDF({
      orientation: "portrait",
      pageSize: "a4",
      unit: "mm",
      format: [223, 297], // Width (shorter side) × Height (longer side)
    });

    const tbody = input.querySelector("tbody");
    if (!tbody) {
      alert("No table body found!");
      return;
    }

    const rows = Array.from(tbody.querySelectorAll("tr"));
    const rowsPerPage = 9; // ✅ 4 rows per page
    const pages = [];

    for (let i = 0; i < rows.length; i += rowsPerPage) {
      pages.push(rows.slice(i, i + rowsPerPage));
    }

    try {
      for (let i = 0; i < pages.length; i++) {
        const pageDiv = document.createElement("div");
        pageDiv.style.position = "absolute";
        pageDiv.style.background = "white";
        pageDiv.style.overflow = "hidden"; // Ensure no content is clipped

        const tableClone = input.cloneNode(true);
        tableClone.querySelector("tbody").innerHTML = "";

        pages[i].forEach((row) =>
          tableClone.querySelector("tbody").appendChild(row.cloneNode(true))
        );

        pageDiv.appendChild(tableClone);
        document.body.appendChild(pageDiv);

        // ✅ Adjust html2canvas capture for landscape
        const canvas = await html2canvas(pageDiv, {
          scale: 2, // ✅ Higher scale for better clarity
          // width: 210,
          // height: 148,
          useCORS: true,
        });

        const imgData = canvas.toDataURL("image/png");

        // ✅ Ensure correct image scaling
        const pageWidth = pdf.internal.pageSize.getWidth(); // 210 mm (landscape)
        const pageHeight = pdf.internal.pageSize.getHeight(); // 148 mm (landscape)

        const leftMargin = 5; // Customize your left margin here
        const topMargin = 3;

        const availableWidth = pageWidth - leftMargin * 1;
        const availableheight = pageHeight - topMargin * 1;

        // const imgProps = pdf.getImageProperties(imgData);
        // const imgWidth = imgProps.width;
        // const imgHeight = imgProps.height;
        // const ratio = imgHeight / imgWidth;

        let imgScaledWidth = availableWidth;
        let imgScaledHeight = availableheight;

        // // Adjust if image height exceeds page height
        // if (imgScaledHeight > maxHeight) {
        //   const scale = maxHeight / imgScaledHeight;
        //   imgScaledHeight = maxHeight;
        //   imgScaledWidth *= scale;
        // }

        pdf.addImage(
          imgData,
          "PNG",
          leftMargin,
          topMargin,
          imgScaledWidth,
          imgScaledHeight
        );

        // ✅ Add page number at bottom
        pdf.setFontSize(10);
        // pdf.text(`Page ${i + 1}`, pageWidth - 10, 200, { align: "right" });

        document.body.removeChild(pageDiv);

        // ✅ Add a new page if needed
        if (i < pages.length - 1) {
          pdf.addPage();
        }
      }

      // ✅ Show print preview before saving
      window.open(pdf.output("bloburl"), "_blank");
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    }
  };

  return (
    <div
      style={{
        width: "210mm",
        minHeight: "285mm",
        border: "1px solid teal",
      }}>
      <div
        ref={printRef}
        style={{
          marginLeft: "13mm",
          marginRight: "13mm",
          marginTop: "11mm",
          marginBottom: "10mm",
          height: "265mm",
          width: "184mm",
          border: "1px solid black",
        }}>
        <div
          style={{
            width: "184mm",
            height: "16mm",
            marginBottom: "2mm",
            border: "1px solid black",
          }}>
          Logo{" "}
        </div>
        <div
          style={{
            display: "flex",
            marginLeft: "3mm",
            marginRight: "2mm",
            height: "15mm",
            marginBottom: "40mm",
            border: "1px solid black",
          }}>
          {/* Div 1: Left Box with 2 Rows */}
          <div
            style={{
              width: "37mm",
              borderRight: "1px solid black",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}>
            <div style={{ height: "50%", borderBottom: "1px solid black" }}>
              1A
            </div>
            <div style={{ height: "50%" }}>1B</div>
          </div>

          {/* Div 2: Stretch middle content */}
          <div style={{ flex: 1, borderRight: "1px solid black" }}>2</div>

          {/* Div 3: Right Box with 2 Rows */}
          <div
            style={{
              width: "37mm",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}>
            <div style={{ height: "50%", borderBottom: "1px solid black" }}>
              3A
            </div>
            <div style={{ height: "50%" }}>3B</div>
          </div>
        </div>
        <span style={{ marginBottom: "2mm" }}>
          Following Statement is showing Royalty payable to you for the period
          from ...............upto ........
        </span>

        <table
          style={{
            border: "1px solid red",
            width: "184mm",
            height: "112mm",
            // marginTop: "15mm",
            borderCollapse: "collapse",
            fontSize: "12px",
            textAlign: "center",
          }}>
          <thead>
            <tr style={{ height: "15mm" }}>
              {/* <th style={{ border: "1px solid black" }}>Sr.No</th>
              <th style={{ border: "1px solid black" }}>Title code No.</th>
              <th style={{ border: "1px solid black" }}>Class</th>
              <th style={{ border: "1px solid black" }}>Name of the Book</th>
              <th style={{ border: "1px solid black" }}>Edn.</th>
              <th style={{ border: "1px solid black" }}>
                Month and year of publication
              </th>
              <th style={{ border: "1px solid black" }}>Price Rs.</th>
              <th style={{ border: "1px solid black" }}>Copies sold</th>
              <th style={{ border: "1px solid black" }}>Total Face Value</th> */}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 9 }).map((_, index) => (
              <tr key={index}>
                <td style={{ border: "1px solid black", width: "7mm" }}>
                  {index + 1}
                </td>
                <td style={{ border: "1px solid black", width: "19mm" }}></td>
                <td style={{ border: "1px solid black", width: "20mm" }}></td>
                <td style={{ border: "1px solid black", width: "59mm" }}></td>
                <td style={{ border: "1px solid black", width: "8mm" }}></td>
                <td style={{ border: "1px solid black", width: "16mm" }}></td>
                <td style={{ border: "1px solid black", width: "19mm" }}></td>
                <td style={{ border: "1px solid black", width: "18mm" }}></td>
                <td style={{ border: "1px solid black", width: "24mm" }}>-</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ display: "flex" }}>
          <div
            style={{
              width: "105mm",
              height: "63mm",
              border: "1px solid black",
            }}></div>
          <div
            style={{
              width: "80mm",
              height: "63mm",
              border: "1px solid black",
            }}></div>
        </div>
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

export default RoyaltyStatementprint;
