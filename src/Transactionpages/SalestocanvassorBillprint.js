import React, { useRef, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Grid,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import axios from "axios";
import "./Salestocanvassorbillprint.css";

function Convassorbillprint() {
  const { id } = useParams();
  console.log(id, "id from sales canvassor");
  const [loading, setLoading] = useState(true);

  const [canvassordata, setCanvassordata] = useState([]);
  const [isPrinting, setIsPrinting] = useState(false);
  const [isButtonsVisible, setIsButtonsVisible] = useState(true);
  const componentRef = useRef();

  useEffect(() => {
    const fetchConvdata = async () => {
      try {
        const response = await axios.get(
          `https://publication.microtechsolutions.net.in/php/getsellscanvassorprint.php?Id=${id}`
        );
        setCanvassordata(response.data);
        console.log(canvassordata, "canvassor data");
      } catch (error) {
        console.error("Error fetching Canv data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchConvdata();
  }, [id]);

  const handlePrint = async () => {
    if (!componentRef.current) {
      alert("Nothing to print! Please try again.");
      return;
    }

    const input = componentRef.current;
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
  const navigate = useNavigate("");
  const handleCancel = () => {
    navigate("/transaction/salestoconvassor");
  };

  if (canvassordata.length === 0) {
    return (
      <div
        style={{
          textAlign: "center",
          marginTop: "50px",
          fontSize: "18px",
          color: "red",
        }}>
        🚫 No data available for this ID.
        <div style={{ marginTop: "20px" }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/transaction/salestoconvassor")}>
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  let totalCopies = 0;
  let totalAmount = 0;
  let totalDiscAmount = 0;
  let totalFreight = 0;
  let packing = 0;

  canvassordata.forEach((item) => {
    totalCopies += parseFloat(item.Copies) || 0;
    totalAmount += parseFloat(item.Amount) || 0;
    totalDiscAmount += parseFloat(item.DiscountAmount) || 0;
  });

  totalFreight = canvassordata[0]?.Freight || 0;
  packing = canvassordata[0]?.Packing || 0;

  console.log(totalDiscAmount, "total disc amount");

  return (
    <>
      <div
        style={{
          // border: "1px solid red",
          marginTop: "5mm",
        }}
        className="salesconvassorprint-container">
        <div
          ref={componentRef}
          style={{
            width: "223mm",
            height: "297mm",
            marginRight: "8mm",
            marginLeft: "18mm",
            marginTop: "11mm",
            marginBottom: "8mm",
            // border: "1px solid black",
            // background: "silver",
          }}>
          <header
            style={{
              // marginTop: "16mm",
              height: "58mm",
              // marginLeft: "5mm",
              display: "flex",
              // border: "1px solid black",
            }}>
            {/* First Column - Account Information */}
            <div
              style={{
                position: "relative",
                // border: "1px solid black",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                width: "113mm",
                height: "35mm",
                overflow: "hidden",
                wordWrap: "break-word",
                marginLeft: "4mm",
                marginTop: "20mm",
              }}>
              <h6
                style={{
                  margin: "0px",
                  fontSize: "15px",
                  fontWeight: "bold",
                  whiteSpace: "nowrap",
                }}>
                {/* {invoiceData[0]?.AccountName} */}
              </h6>

              <p style={{ fontSize: "15px" }}>
                {[
                  canvassordata[0]?.Address1,
                  canvassordata[0]?.Address2,
                  canvassordata[0]?.Address3,
                  canvassordata[0]?.StateName,
                  `Dist: ${canvassordata[0]?.CityName}`,
                ]
                  .filter(Boolean)
                  .join(", ")}
              </p>

              <p style={{ fontSize: "13px", whiteSpace: "nowrap" }}>
                {canvassordata[0]?.GSTNo}
              </p>
            </div>

            {/* Second Column - Invoice Details */}
            <div
              style={{
                position: "relative",
                // border: "1px solid black",
                display: "flex",
                flexDirection: "column",
                // justifyContent: "space-between", // Distribute items evenly
                alignItems: "left", // Align text to the right
                width: "50mm",
                overflow: "hidden",
                wordWrap: "break-word",

                marginTop: "21mm",
                marginLeft: "3mm",
              }}>
              Debit advice
              <b style={{ marginTop: "9mm", marginLeft: "12mm" }}>
                <strong>{/* Invoice Date:  */}</strong>{" "}
                {canvassordata[0]?.InvoiceDate
                  ? new Date(canvassordata[0]?.InvoiceDate)
                      .toLocaleDateString("en-GB")
                      .replace(/\//g, "-")
                  : ""}
              </b>
              <b style={{ marginTop: "3mm", marginLeft: "22mm" }}>
                {" "}
                <strong>{/* Challan No: */}</strong>{" "}
                {canvassordata[0]?.InvoiceNo}
              </b>
            </div>
          </header>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              // border: "1px solid black",
              height: "22mm",
              width: "223mm",
              fontSize: "15px",
              fontWeight: "bold",
              padding: "10px",
              boxSizing: "border-box",
            }}>
            {/* Row 1 - 3 values */}
            <div style={{ display: "flex", gap: "8px" }}>
              <span style={{ marginLeft: "32mm" }}>
                {canvassordata[0]?.OrderNo}
              </span>
              <span style={{ marginLeft: "35mm" }}>
                {" "}
                {canvassordata[0]?.OrderDate
                  ? new Date(canvassordata[0]?.OrderDate).toLocaleDateString(
                      "en-GB"
                    )
                  : ""}
              </span>
              <span style={{ marginLeft: "43mm" }}>
                {canvassordata[0]?.DispatchModeName}
              </span>
            </div>

            {/* Row 2 - 5 values */}
            <div style={{ display: "flex", gap: "8px", marginTop: "3px" }}>
              <span style={{ marginLeft: "27mm" }}>
                {canvassordata[0]?.ReceiptNo}
              </span>
              <span style={{ marginLeft: "38mm" }}>
                {" "}
                {canvassordata[0]?.ReceiptDate
                  ? new Date(canvassordata[0]?.OrderDate).toLocaleDateString(
                      "en-GB"
                    )
                  : ""}
              </span>
              <span style={{ marginLeft: "26mm" }}>
                {canvassordata[0]?.Bundles}
              </span>
              <span style={{ marginLeft: "40mm" }}>
                {canvassordata[0]?.Weight}
              </span>
              <span style={{ marginLeft: "25mm" }}>
                {canvassordata[0]?.Freight}
              </span>
            </div>

            {/* Row 3 - 1 value */}
            <div style={{ marginTop: "4px" }}>
              <span style={{ marginLeft: "43mm" }}>
                {canvassordata[0]?.ReceivedThrough.substring(0, 10)}
              </span>
            </div>
          </div>
          {/* <div style={{ marginTop: "9mm" }}></div> */}

          <table
            style={{
              display: "block",
              minHeight: "157mm",
              marginRight: "11mm",
              width: "223mm",
              marginTop: "9mm",
              // border: "1px solid black",
            }}>
            <thead>
              {/* <tr style={{ fontSize: "14px" }}>
                <th style={{ border: "1px solid black" }}>No</th>
                <th style={{ border: "1px solid black" }}>Title Code No</th>
                <th style={{ border: "1px solid black" }}>Class</th>
                <th style={{ border: "1px solid black" }}>TITLE</th>
                <th style={{ border: "1px solid black" }}>Copies</th>
                <th style={{ border: "1px solid black" }}>Price</th>
                <th style={{ border: "1px solid black" }}>Amount (Rs. Ps)</th>
                <th style={{ border: "1px solid black" }}>Amount (Rs. Ps)</th>
              </tr> */}
            </thead>

            <tbody>
              {canvassordata.length > 0 ? (
                canvassordata.map((item, index) => (
                  <tr
                    key={index}
                    style={{
                      fontSize: "15px",
                      // color: "rebeccapurple",
                      // border: "1px solid black",
                    }}>
                    <td
                      align="left"
                      style={{
                        width: "10mm",
                        // border: "1px solid black",
                      }}>
                      {index + 1}
                    </td>
                    <td
                      align="left"
                      style={{
                        width: "22mm",
                        // border: "1px solid black",
                      }}>
                      {item.BookCode}
                    </td>
                    <td
                      align="left"
                      style={{
                        width: "22mm",
                        // border: "1px solid black",
                      }}>
                      {item.StandardName}
                    </td>
                    <td
                      style={{
                        textAlign: "left",
                        wordBreak: "break-word",
                        whiteSpace: "normal",
                        width: "84mm",
                        // border: "1px solid black",
                      }}>
                      {item.BookNameMarathi || item.BookName}
                    </td>
                    <td
                      align="center"
                      style={{
                        width: "15mm",
                        // border: "1px solid black",
                      }}>
                      {item.Copies}
                    </td>
                    <td
                      align="right"
                      style={{
                        width: "15mm",
                        // border: "1px solid black",
                      }}>
                      {item.Rate}
                    </td>
                    <td
                      align="right"
                      style={{
                        width: "20mm",
                        // border: "1px solid black",
                      }}>
                      {item.Amount}
                    </td>
                    <td
                      align="right"
                      style={{
                        width: "11mm",
                        // border: "1px solid black",
                      }}>
                      {item.DiscountPercentage || 0}
                    </td>

                    <td
                      align="right"
                      style={{
                        width: "20mm",
                        // border: "1px solid black",
                      }}>
                      {item.DiscountAmount || 0}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="9"
                    style={{
                      textAlign: "center",
                      padding: "10px",
                      fontSize: "14px",
                      fontWeight: "bold",
                    }}>
                    No Data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Totals Section - Now using divs instead of table */}
          <div
            style={{
              width: "223mm",
              display: "flex",
              flexDirection: "column",
              // border: "1px solid black",
            }}>
            {/* Row 1 - Total Copies and Total Discount Amount */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontWeight: "bold",
                fontSize: "14px",
              }}>
              <div
                style={{
                  width: "120mm",
                  // border: "1px solid black",
                }}></div>{" "}
              {/* Empty space to align Total Copies */}
              <div
                style={{
                  width: "10mm",
                  textAlign: "center",
                  marginLeft: "11mm",
                  // marginTop: "1mm",
                  height: "5mm",
                  // border: "1px solid red",
                }}>
                {totalCopies}
              </div>{" "}
              {/* Discount Amount */}
              <div
                style={{
                  // border: "1px solid green",
                  flexGrow: 1,
                  textAlign: "right",
                  marginBottom: "5mm",
                  // marginTop: "2mm",
                  marginRight: "1mm",
                }}>
                {totalDiscAmount.toFixed(2)}
              </div>{" "}
            </div>

            {/* Row 2 - Freight Charges */}
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                fontWeight: "bold",
                marginRight: "1mm",

                fontSize: "14px",
              }}>
              <div
                style={{
                  width: "35mm",
                  marginBottom: "1mm",
                  marginRight: "10mm",
                }}>
                Add Freight(1/2)
              </div>
              <div style={{ textAlign: "right" }}>
                {(totalFreight / 2).toFixed(2)}
              </div>
            </div>

            {/* Row 3 - Packing Charges */}
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                fontWeight: "bold",
                fontSize: "14px",
                marginRight: "1mm",
              }}>
              <div style={{ width: "22mm", marginRight: "10mm" }}>
                Add P & F
              </div>
              <div style={{ textAlign: "right" }}>
                {parseFloat(packing).toFixed(2)}
              </div>
            </div>

            {/* Row 4 - Final Total */}
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                fontWeight: "bold",
                fontSize: "14px",
                marginTop: "5mm",
                marginRight: "1mm",
                // marginLeft: "14mm",
              }}>
              {/* <div
                style={{
                  width: "10mm",
                  marginTop: "2mm",
                }}></div> */}
              <div style={{ textAlign: "right" }}>
                {(
                  Number(totalDiscAmount) +
                  Number(totalFreight) +
                  Number(packing)
                ).toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="salesinvoiceprint-btn-container"
        style={{ marginTop: "20mm" }}>
        <Button
          onClick={handlePrint}
          variant="contained"
          style={{ background: "#0a60bd", color: "white", marginRight: "5px" }}>
          Print
        </Button>

        <Button
          onClick={handleCancel}
          variant="contained"
          style={{ background: "red", color: "white" }}>
          Cancel
        </Button>
      </div>
    </>
  );
}

export default Convassorbillprint;
