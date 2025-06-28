import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Button,
  Typography,
  Grid,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
} from "@mui/material";
import { useReactToPrint } from "react-to-print";
import axios from "axios";
import "./Saleschallanprint.css";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { RiHome6Fill } from "react-icons/ri";

function Saleschallanprint() {
  const { id } = useParams();
  console.log(id, "id from challan");
  const [challanData, setChallanData] = useState([]);
  const navigate = useNavigate();
  const componentRef = useRef(null); // ✅ Use useRef instead of useState

  useEffect(() => {
    const fetchChallanData = async () => {
      try {
        const response = await axios.get(
          `https://publication.microtechsolutions.net.in/php/getsellschallanprintbyid.php?Id=${id}`
        );
        setChallanData(response.data);
        console.log(response, "✅ Challan data");
      } catch (error) {
        console.error("🚨 Axios error:", error);
        if (error.response) {
          // Server responded with a status other than 2xx
          console.error("❗Response error data:", error.response.data);
          console.error("❗Status code:", error.response.status);
          console.error("❗Headers:", error.response.headers);
        } else if (error.request) {
          // Request was made but no response
          console.error("❗No response received:", error.request);
        } else {
          // Something else happened
          console.error("❗Error message:", error.message);
        }
      }
    };

    fetchChallanData();
  }, [id]);

  useEffect(() => {
    console.log("📌 Component Ref after data loads:", componentRef.current);
  }, [challanData]);

  const handlePrint = async () => {
    if (!componentRef.current) {
      alert("Nothing to print! Please try again.");
      return;
    }

    const input = componentRef.current;
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const table = input.querySelector("table");
    if (!table) {
      alert("No table found!");
      return;
    }

    const tbody = table.querySelector("tbody");
    if (!tbody) {
      alert("No table body found!");
      return;
    }

    const rows = Array.from(tbody.querySelectorAll("tr"));
    const rowsPerPage = 9;
    const pages = [];

    for (let i = 0; i < rows.length; i += rowsPerPage) {
      pages.push(rows.slice(i, i + rowsPerPage));
    }

    try {
      for (let i = 0; i < pages.length; i++) {
        const pageDiv = document.createElement("div");
        pageDiv.style.width = "210mm";
        pageDiv.style.height = "297mm"; // Full A4 height
        pageDiv.style.position = "absolute";
        pageDiv.style.background = "white";
        pageDiv.style.overflow = "hidden";

        const clonedContent = input.cloneNode(true);
        const clonedTable = clonedContent.querySelector("table");
        const clonedTbody = clonedTable.querySelector("tbody");
        clonedTbody.innerHTML = "";

        pages[i].forEach((row) => clonedTbody.appendChild(row.cloneNode(true)));
        pageDiv.appendChild(clonedContent);
        document.body.appendChild(pageDiv);

        const canvas = await html2canvas(pageDiv, {
          scale: 2,
          useCORS: true,
        });

        const imgData = canvas.toDataURL("image/png");
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const pageMarginLeft = 2;
        pdf.addImage(imgData, "PNG", pageMarginLeft, 0, pageWidth, pageHeight);

        //Add Page no
        pdf.setFontSize(10);
        pdf.text(
          `Page ${i + 1} of ${pages.length}`,
          pageWidth - 20,
          pageHeight - 162,
          { align: "right" }
        );

        // Add Transport Value below table (aligned)
        pdf.setFontSize(12);
        pdf.text(
          `${challanData[0].Transport}`,
          pageWidth - 150,
          pageHeight - 170
        );

        if (i === pages.length - 1) {
          pdf.setFontSize(10);
          pdf.text(` ${totalCopies}`, pageWidth - 42, pageHeight - 170);
        }

        // Add Total Amount only on the last page
        if (i === pages.length - 1) {
          pdf.setFontSize(10);
          pdf.text(` ${totalRs}.${totalPs}`, pageWidth - 31, pageHeight - 170);
        }

        document.body.removeChild(pageDiv);

        if (i < pages.length - 1) {
          pdf.addPage();
        }
      }

      window.open(pdf.output("bloburl"), "_blank");
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    }
  };

  const handleCancel = () => {
    navigate("/transaction/saleschallan");
  };
  if (challanData.length === 0) {
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
            onClick={() => navigate("/transaction/saleschallan")}>
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  let totalCopies = 0;
  let totalRs = 0;
  let totalPs = 0;

  challanData.forEach((item) => {
    totalCopies += item.Copies;
    totalRs += Math.floor(item.Amount);
    totalPs += Math.round((item.Amount % 1) * 100);
  });

  if (totalPs >= 100) {
    totalRs += Math.floor(totalPs / 100);
    totalPs = totalPs % 100;
  }

  return (
    <div className="saleschallanprint-container">
      <div
        ref={componentRef}
        style={{
          width: "210mm",
          height: "148.5mm",
          // border: "1px solid black",
          overflow: "hidden",
          // marginTop:'15mm',
          marginRight: "15mm",
        }}>
        {/* Top Left Div (2.8cm height, 11.5cm width) */}

        {/* //1st div */}
        <div
          style={{
            height: "15mm",
            // width: '178mm',
            position: "relative",
            // border: '1px solid red',
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            overflow: "hidden",
            wordWrap: "break-word",
            marginLeft: "23mm",
            marginRight: "15mm",
            marginTop: "13mm",
          }}>
          <h6
            style={{
              margin: "0px",
              fontSize: "12px",
              fontWeight: "bold",
              whiteSpace: "nowrap",
              marginLeft: "10mm",
            }}>
            {challanData[0]?.AccountName}
          </h6>

          <p
            style={{
              margin: "0px",
              fontSize: "12px",
              marginLeft: "10mm",
            }}>
            {[
              challanData[0]?.Address1,
              challanData[0]?.Address2,
              challanData[0]?.Address3,
              challanData[0]?.StateName,
              `Dist: ${challanData[0]?.CityName}`,
            ]
              .filter(Boolean)
              .join(", ")}
          </p>

          <p
            style={{
              margin: "2px",
              fontSize: "12px",
              whiteSpace: "nowrap",
              marginLeft: "10mm",
            }}>
            {challanData[0]?.GSTNo}
          </p>
        </div>

        {/* // 2nd div */}

        <div
          style={{
            display: "flex",
            // border: "1px solid green",
            justifyContent: "flex-end",
            // width: '178mm',
            height: "5mm",
            marginRight: "25mm",
            marginTop: "7mm",
            // marginLeft: '15mm',
          }}>
          {/* Delivery Challan Heading */}
          {/* Challan Date (10mm from Heading) */}
          <div style={{ fontSize: "12px", fontWeight: "bold" }}>
            {new Date(challanData[0]?.ChallanDate).toLocaleDateString("en-GB")}
          </div>
          {/* Challan No (50mm from Heading) */}
          <div
            style={{
              fontSize: "12px",
              fontWeight: "bold",
              marginLeft: "21mm",
              marginRight: "14mm",
            }}>
            {challanData[0]?.ChallanNo}
          </div>
        </div>

        {/* Table starts after 1mm */}
        {/* <table className="saleschallanprint-table" style={{  
  width: '178mm', 
  height: '65mm',
  // fontSize:'8px',
 border:'1px solid black',
 marginRight:'5mm',
 marginLeft:'30mm',   marginTop:'1mm' }}> */}
        <div
        // style={{ border: "1px solid black" }}
        >
          <table
            style={{
              display: "block",
              // position:'fixed',
              width: "173mm",
              marginRight: "5mm",
              minHeight: "71mm",
              marginLeft: "23mm",
              marginTop: "12mm",
              // marginTop:'3mm'
              // border: "1px solid black",
            }}>
            <thead>
              <tr>
                {/* <th >No</th>
      <th >Code No</th>
      <th >Class</th>
      <th >Title</th>
      <th >Copies</th>
      <th align='right'>Rs</th>
      <th align='left'>Ps</th> */}
              </tr>
            </thead>

            <tbody>
              {challanData.map((item, index) => {
                const rupees = Math.floor(item.Amount);
                const paisa = String(
                  Math.round((item.Amount % 1) * 100)
                ).padStart(2, "0");

                const isLastRecord = index === challanData.length - 1;
                const isPageBreak = index > 0 && (index + 1) % 10 === 0;

                return (
                  <React.Fragment key={index}>
                    {isPageBreak && !isLastRecord && (
                      <tr className="page-break">
                        <td colSpan={7}></td>
                      </tr>
                    )}

                    {/* <tr
        //  style={{ fontSize: '15px', }}
         >
          <td align="center" style={{ fontSize:'14px'}} >{index + 1}</td>
          <td align="center" style={{fontSize:'14px', border:'1px solid red', maxWidth:'50vw'}}>{item.BookCode}</td>
          <td align="center" style={{fontSize:'14px' }}>{item.StandardName}</td>
          <td style={{ textAlign: "left", wordBreak: 'break-word', whiteSpace: 'normal',fontSize:'14px'  }}>
            {item.BookNameMarathi}
          </td>
          <td align="left" style={{ fontSize: '13px', fontFamily: 'monospace' }}>{item.Copies}</td> 
        <td align="right" style={{ fontSize: '14px', fontFamily: 'monospace' }}>{rupees}<span>.</span></td>
         <td align="left" style={{ fontSize: '14px', fontFamily: 'monospace' }}>{paisa}</td>
        </tr> */}

                    <tr>
                      <td
                        align="center"
                        style={{
                          fontSize: "14px",
                          width: "15mm",
                          // border: "1px solid black",
                        }}>
                        {index + 1}
                      </td>
                      <td
                        align="center"
                        style={{
                          fontSize: "14px",
                          width: "28mm",
                          // border: "1px solid black",
                        }}>
                        {item.BookCode}
                      </td>
                      <td
                        align="center"
                        style={{
                          fontSize: "14px",
                          width: "28mm",
                          // border: "1px solid black",
                        }}>
                        {item.StandardName}
                      </td>
                      <td
                        style={{
                          textAlign: "left",
                          wordBreak: "break-word",
                          whiteSpace: "normal",
                          fontSize: "14px",
                          width: "115mm",
                          // border: "1px solid black",
                        }}>
                        {item.BookNameMarathi}
                      </td>
                      <td
                        align="center"
                        style={{
                          fontSize: "13px",
                          fontFamily: "monospace",
                          width: "15mm",
                          // border: "1px solid black",
                        }}>
                        {item.Copies}
                      </td>
                      <td
                        align="right"
                        style={{
                          fontSize: "14px",
                          fontFamily: "monospace",
                          width: "15mm",
                          // border: "1px solid black",
                        }}>
                        {rupees}
                        <span
                          style={{
                            display: "inline-block",
                            marginLeft: "-2px",
                            marginRight: "-2px",
                          }}>
                          .
                        </span>
                      </td>
                      <td
                        align="left"
                        style={{
                          fontSize: "14px",
                          fontFamily: "monospace",
                          // border: "1px solid black",
                        }}>
                        {paisa}
                      </td>
                    </tr>

                    {/* {(isPageBreak || isLastRecord) && (
          <tr>
            <td  className="page-number" style={{ textAlign: 'right' }}>
              Page {Math.floor(index / 9) + 1}
            </td>
          </tr>
        )} */}

                    {(isPageBreak || isLastRecord) && (
                      <div
                        className="page-number"
                        style={{
                          position: "absolute",
                          bottom: "10mm", // Adjust as needed
                          right: "10mm", // Push to the right edge
                          fontSize: "12px",
                          fontWeight: "bold",
                          textAlign: "right",
                        }}>
                        Page {Math.floor(index / 10) + 1}
                      </div>
                    )}

                    {/* Print Total on Last Page (Instead of Pushing to a New Page) */}
                    {/* {isLastRecord && (
          <tr style={{ fontWeight: 'bold',
          //  fontSize:'6px',
            }}>
            <td></td>
            <td></td>
            <td></td>
            <td align="right"></td>
            <td align="right" style={{ fontSize: '10px', fontFamily: 'monospace' }}>{totalCopies}</td> 
                                        <td align="right" style={{ fontSize: '10px', fontFamily: 'monospace' }}>{totalRs}<span>.</span></td> 
                                        <td align="left" style={{ fontSize: '10px', fontFamily: 'monospace' }}>{String(totalPs).padStart(2, '0')}</td> 
          </tr>
        )} */}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
        {/* Space below table (0.5cm) */}
        {/* <div >
        <p style={{ marginLeft: '45mm', fontSize:'13px',fontWeight:'bold', marginTop:'0.1mm' }}>{challanData[0]?.Transport}</p>
      </div> */}
      </div>

      {/* //Btn container */}

      <div className="saleschallan-btn-container" style={{ marginTop: "20mm" }}>
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
    </div>
  );
}

export default Saleschallanprint;
