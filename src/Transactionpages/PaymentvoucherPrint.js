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
import "./Receiptvoucherprint.css";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { RiHome6Fill } from "react-icons/ri";
import { toWords } from "number-to-words";
import { Payment } from "@mui/icons-material";

function PaymentvoucherPrint() {
  const { id } = useParams();
  console.log("ID from URL:", id); // ← check this

  const [receiptdata, setReceiptdata] = useState([]);
  const navigate = useNavigate();
  const componentRef = useRef(null);

  useEffect(() => {
    console.log("ID value:", id); // <--- Add this line
    if (!id) return; // If id is falsy (undefined, null, 0), fetch won't run

    const fetchReceiptData = async () => {
      try {
        const response = await axios.get(
          `https://publication.microtechsolutions.net.in/php/getreceitprint.php?Id=${id}`
        );
        console.log("Receipt data:", response.data);
        setReceiptdata(response.data);
      } catch (error) {
        console.error("Error fetching receipt data:", error);
      }
    };

    fetchReceiptData();
  }, [id]);

  useEffect(() => {
    console.log("📌 Component Ref after data loads:", componentRef.current);
  }, [receiptdata]);
  const [isPrinting, setIsPrinting] = useState(false);
  const [isButtonsVisible, setIsButtonsVisible] = useState(true);

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

    try {
      const pageDiv = document.createElement("div");
      pageDiv.style.width = "210mm";
      pageDiv.style.minHeight = "297mm"; // A4 height
      pageDiv.style.position = "absolute";
      pageDiv.style.background = "white";
      pageDiv.style.padding = "10mm"; // Optional: padding to look nice
      pageDiv.style.zIndex = -1; // keep it out of sight
      pageDiv.style.overflow = "hidden";

      const clonedContent = input.cloneNode(true);
      pageDiv.appendChild(clonedContent);
      document.body.appendChild(pageDiv);

      const canvas = await html2canvas(pageDiv, {
        scale: 2,
        useCORS: true,
      });

      const imgData = canvas.toDataURL("image/png");
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      const pageHeight = pdf.internal.pageSize.getHeight();
      let heightLeft = pdfHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
        heightLeft -= pageHeight;
      }

      document.body.removeChild(pageDiv);

      // Preview in new tab (NOT download)
      const pdfBlobUrl = pdf.output("bloburl");
      window.open(pdfBlobUrl, "_blank");
    } catch (error) {
      console.error("Error generating receipt PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    }
  };

  const handleCancel = () => {
    navigate("/transaction/paymentvoucher");
  };

  const amountInWords = receiptdata[0]?.Amount
    ? toWords(Number(receiptdata[0].Amount)).replace(/\b\w/g, (c) =>
        c.toUpperCase()
      )
    : "";

  return (
    <div className="receiptvoucherprint-container">
      <div
        style={{
          // border: "1px solid black",
          width: "210mm",
          height: "148.5mm",
        }}>
        <div
          ref={componentRef}
          style={{
            // border: "1px solid black",
            width: "171mm",
            height: "118mm",
            marginLeft: "22mm",
            marginRight: "13mm",
            marginTop: "17mm",
            marginBottom: "14mm",
            overflow: "hidden",
          }}>
          {/* <div
          style={{
            border: "1px solid red",
            width: "170mm",
            marginLeft: "20mm",
            marginRight: "14mm",
            marginTop: "15mm",
          }}> */}
          <div
            style={{
              // border: "1px solid black",
              width: "163mm",
              height: "26mm",
              marginTop: "8mm",
              marginLeft: "6mm",
              marginRight: "17mm",
              display: "flex",
              justifyContent: "center",
              overflow: "hidden",
              wordWrap: "break-word",
            }}>
            {/* logo Div */}
            <div
              style={{
                width: "124mm",
                height: "26mm",
                // border: "1px solid black",
              }}>
              {" "}
              LOGo
            </div>
            {/* no and date div */}
            <div
              style={{
                // border: "1px solid black",
                width: "39mm",
                height: "26mm",
                // padding: "4px",
                fontSize: "14px",
                fontWeight: "bold",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}>
              <span style={{ marginBottom: "4mm", marginLeft: "7mm" }}>
                {receiptdata[0]?.VoucherNo}
              </span>
              <span style={{ marginLeft: "10mm", marginBottom: "1mm" }}>
                {receiptdata[0]?.VoucherDate}
              </span>
              <span style={{ marginLeft: "7mm" }}>
                {receiptdata[0]?.Amount}{" "}
              </span>
            </div>
          </div>

          <div
            style={{
              width: "165mm",
              marginTop: "3mm",
              marginLeft: "3mm",
              marginRight: "2mm",
              marginBottom: "5mm",
              height: "44mm",
              fontSize: "14px",
              fontWeight: "bold",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              // border: "1px solid black",
            }}>
            <span style={{ marginTop: "5mm", marginLeft: "54mm" }}>
              {/* Received with thanks from */}
              {receiptdata[1]?.AccountName}
            </span>
            <span style={{ marginTop: "5mm", marginLeft: "34mm" }}>
              {/* the sum of Rupees */}
              {amountInWords} only
            </span>
            <span
              style={{
                marginTop: "5mm",
                marginLeft: "10mm",
              }}>
              {/* by */}
              {receiptdata[0]?.ChequeNo} &nbsp;&nbsp;&nbsp;&nbsp;
              {receiptdata[0]?.ChequeDate}
            </span>
            <span style={{ marginTop: "5mm", marginLeft: "20mm" }}>
              {/* towards */}
              {receiptdata[0]?.Towards}
            </span>
          </div>
          <div
            style={{
              // border: "1px solid black",
              marginTop: "5mm",
              width: "75mm",
              height: "20mm",
              marginLeft: "3mm",
              marginBottom: "8mm",
              fontSize: "14px",
              fontWeight: "bold",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}>
            <span style={{ marginTop: "8mm", marginLeft: "12mm" }}>
              {/* No */}
              {receiptdata[0]?.KachiPavatiNo}
            </span>
            <span style={{ marginTop: "1mm", marginLeft: "17mm" }}>
              {receiptdata[0]?.KachiPavatiDate}
            </span>
          </div>
          {/* </div> */}
        </div>
      </div>

      {/* Buttons */}
      {isButtonsVisible && (
        <div
          className="receiptvoucherprint-btn-container"
          style={{ marginTop: "20px", textAlign: "center" }}>
          <Button
            onClick={handlePrint}
            style={{
              backgroundColor: "#0a60bd",
              color: "#fff",
              marginRight: "10px",
            }}>
            Print
          </Button>
          <Button
            onClick={handleCancel}
            style={{ backgroundColor: "red", color: "#fff" }}>
            Cancel
          </Button>
        </div>
      )}
    </div>
  );
}

export default PaymentvoucherPrint;
