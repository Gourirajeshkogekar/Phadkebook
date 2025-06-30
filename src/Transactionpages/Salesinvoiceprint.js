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
import "./Salesinvoiceprint.css";

function Salesinvoiceprint() {
  const { id } = useParams();
  console.log(id, "id from sales invoice");
  const [loading, setLoading] = useState(true);

  const [invoiceData, setInvoiceData] = useState([]);
  const [isPrinting, setIsPrinting] = useState(false);
  const [isButtonsVisible, setIsButtonsVisible] = useState(true);
  const componentRef = useRef();

  useEffect(() => {
    const fetchInvoicedata = async () => {
      try {
        const response = await axios.get(
          `https://publication.microtechsolutions.net.in/php/getsellsinvoiceprintbyid.php?Id=${id}`
        );
        setInvoiceData(response.data);
        console.log(invoiceData, "invoiceData");
      } catch (error) {
        console.error("Error fetching invoice data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInvoicedata();
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
    navigate("/transaction/salesinvoice");
  };
  if (invoiceData.length === 0) {
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
            onClick={() => navigate("/transaction/salesinvoice")}>
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

  invoiceData.forEach((item) => {
    totalCopies += parseFloat(item.Copies) || 0;
    totalAmount += parseFloat(item.Amount) || 0;
    totalDiscAmount += parseFloat(item.DiscountAmount) || 0;
  });

  totalFreight = invoiceData[0].Freight || 0;
  packing = invoiceData[0].Packing || 0;

  console.log(totalDiscAmount, "total disc amount");

  return (
    <>
      <div
        style={{
          // border: "1px solid red",
          marginTop: "5mm",
        }}
        className="salesinvoiceprint-container">
        <div
          ref={componentRef}
          style={{
            width: "223mm",
            height: "297mm",
            marginRight: "15mm",
            marginLeft: "21mm",
            marginTop: "28mm",
            marginBottom: "15mm",
            // border: "1px solid black",
            // background: "silver",
          }}>
          <header
            style={{
              marginTop: "16mm",
              height: "36mm",
              marginLeft: "5mm",
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
                width: "130mm",
                overflow: "hidden",
                wordWrap: "break-word",
                marginLeft: "11mm",
                marginTop: "5mm",
              }}>
              <h6
                style={{
                  margin: "0px",
                  fontSize: "15px",
                  fontWeight: "bold",
                  whiteSpace: "nowrap",
                }}>
                {invoiceData[0]?.AccountName}
              </h6>

              <p style={{ fontSize: "15px" }}>
                {[
                  invoiceData[0]?.Address1,
                  invoiceData[0]?.Address2,
                  invoiceData[0]?.Address3,
                  invoiceData[0]?.StateName,
                  `Dist: ${invoiceData[0]?.CityName}`,
                ]
                  .filter(Boolean)
                  .join(", ")}
              </p>

              <p style={{ fontSize: "13px", whiteSpace: "nowrap" }}>
                {invoiceData[0]?.GSTNo}
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
                marginLeft: "21mm",
                padding: "5mm", // Adjust spacing
              }}>
              <b
                style={{
                  fontSize: "15px",
                  whiteSpace: "nowrap",
                  // marginTop: "14px",
                  marginTop: "8mm",
                  marginRight: "40mm",
                }}>
                <strong> Credit Memo No: </strong> {invoiceData[0]?.InvoiceNo}
              </b>
              <b
                style={{
                  fontSize: "15px",
                  whiteSpace: "nowrap",
                  // marginLeft: "2mm",
                  marginTop: "2mm",
                }}>
                <strong>{/* Invoice Date:  */}</strong>{" "}
                {invoiceData[0]?.InvoiceDate
                  ? new Date(invoiceData[0]?.InvoiceDate)
                      .toLocaleDateString("en-GB")
                      .replace(/\//g, "-")
                  : ""}
              </b>
              <b
                style={{
                  fontSize: "15px",
                  whiteSpace: "nowrap",
                  marginLeft: "15mm",
                  marginTop: "3mm",
                }}>
                <strong>{/* Challan No: */}</strong> {invoiceData[0]?.ChallanNo}
              </b>
            </div>
          </header>
          <div style={{ marginTop: "13mm" }}></div>

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
              padding: "10px", // optional, for breathing room
              boxSizing: "border-box",
            }}>
            {/* Row 1 - 3 values */}
            <div style={{ display: "flex", gap: "8px" }}>
              <span style={{ marginLeft: "32mm" }}>
                {invoiceData[0]?.OrderNo}
              </span>
              <span style={{ marginLeft: "35mm" }}>
                {" "}
                {invoiceData[0]?.OrderDate
                  ? new Date(invoiceData[0]?.OrderDate).toLocaleDateString(
                      "en-GB"
                    )
                  : ""}
              </span>
              <span style={{ marginLeft: "43mm" }}>
                {invoiceData[0]?.ParcelSendThrough}
              </span>
            </div>

            {/* Row 2 - 5 values */}
            <div style={{ display: "flex", gap: "8px", marginTop: "3px" }}>
              <span style={{ marginLeft: "27mm" }}>
                {invoiceData[0]?.ReceiptNo}
              </span>
              <span style={{ marginLeft: "38mm" }}>
                {" "}
                {invoiceData[0]?.ReceiptDate
                  ? new Date(invoiceData[0]?.OrderDate).toLocaleDateString(
                      "en-GB"
                    )
                  : ""}
              </span>
              <span style={{ marginLeft: "26mm" }}>
                {invoiceData[0]?.Bundles}
              </span>
              <span style={{ marginLeft: "40mm" }}>
                {invoiceData[0]?.Weight}
              </span>
              <span style={{ marginLeft: "25mm" }}>
                {invoiceData[0]?.Freight}
              </span>
            </div>

            {/* Row 3 - 1 value */}
            <div style={{ marginTop: "4px" }}>
              <span style={{ marginLeft: "43mm" }}>
                {invoiceData[0]?.ReceiptSendThrough.substring(0, 10)}
              </span>
            </div>
          </div>

          {/* Table with minHeight to ensure space is reserved even if empty */}
          <table
            style={{
              display: "block",
              minHeight: "175mm",
              marginRight: "11mm",
              // width: "223mm",
              marginTop: "10mm",
              // border: "1px solid black",
            }}>
            <thead>
              {/* Uncomment if needed */}
              {/* <tr style={{ fontSize: '14px', }}>
        <th>No</th>
        <th>Title Code No</th>
        <th>Class</th>
        <th>TITLE</th>
        <th>Copies</th>
        <th>Price</th>
        <th>Amount (Rs. Ps)</th>
        <th>Disc(%)</th>
        <th>Amount (Rs. Ps)</th>
      </tr> */}
            </thead>

            <tbody>
              {invoiceData.length > 0 ? (
                invoiceData.map((item, index) => (
                  <tr
                    key={index}
                    style={{
                      fontSize: "15px",
                      // color: "rebeccapurple",
                      // border: "1px solid black"
                    }}>
                    <td
                      align="left"
                      style={{
                        width: "10mm",
                        // style: "1px solid black"
                      }}>
                      {index + 1}
                    </td>
                    <td
                      align="left"
                      style={{
                        width: "22mm",
                        //  border: "1px solid black"
                      }}>
                      {item.BookCode}
                    </td>
                    <td
                      align="left"
                      style={{
                        width: "22mm",
                        //  border: "1px solid black"
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
                        //  border: "1px solid black"
                      }}>
                      {item.Copies}
                    </td>
                    <td
                      align="right"
                      style={{
                        width: "15mm",
                        //  border: "1px solid black"
                      }}>
                      {item.Price}
                    </td>
                    <td
                      align="right"
                      style={{
                        width: "20mm",
                        //  border: "1px solid black"
                      }}>
                      {item.Amount}
                    </td>
                    <td
                      align="right"
                      style={{
                        width: "11mm",
                        //  border: "1px solid black"
                      }}>
                      {item.DiscountPercentage || 0}
                    </td>
                    <td
                      align="right"
                      style={{
                        width: "20mm",
                        //  border: "1px solid black"
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
                  marginLeft: "13mm",
                  marginTop: "1mm",
                  height: "3mm",
                  // border: "1px solid black",
                }}>
                {totalCopies}
              </div>{" "}
              {/* Discount Amount */}
              <div
                style={{
                  // border: "1px solid red",
                  flexGrow: 1,
                  textAlign: "right",
                  marginBottom: "5mm",
                  marginTop: "2mm",
                  marginRight: "10mm",
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
                marginRight: "10mm",

                fontSize: "14px",
              }}>
              <div
                style={{
                  width: "35mm",
                  marginBottom: "1mm",
                  marginRight: "13mm",
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
                marginRight: "10mm",
              }}>
              <div style={{ width: "22mm", marginRight: "18mm" }}>
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
                marginRight: "10mm",
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

export default Salesinvoiceprint;
