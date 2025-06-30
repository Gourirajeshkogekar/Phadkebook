import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

function BookPrint() {
  const location = useLocation(); // Access the passed data

  const [bookCode, setBookCode] = useState("");
  const [bookName, setBookName] = useState("");
  const [bookNameMarathi, setBookNameMarathi] = useState("");
  const [bookGroupId, setBookGroupId] = useState("");
  const [bookStandardId, setBookStandardId] = useState("");
  const [publicationId, setPublicationId] = useState("");
  const [isPrinting, setIsPrinting] = useState(false);

  const printRef = useRef(null);

  useEffect(() => {
    if (location.state && location.state.bookData) {
      const { bookData } = location.state;
      setBookCode(bookData.BookCode || "");
      setBookName(bookData.BookName || "");
      setBookNameMarathi(bookData.BookNameMarathi || "");
      setBookGroupId(bookData.BookGroupId || "");
      setBookStandardId(bookData.BookStandardId || "");
      setPublicationId(bookData.PublicationId || "");
    }
  }, [location]);

  const handlePrint = () => {
    setIsPrinting(true); // Hide buttons before printing

    setTimeout(() => {
      const modalContent = printRef.current;
      if (!modalContent) {
        console.error("Printing content not found!");
        return;
      }

      html2canvas(modalContent, {
        scale: 2,
        useCORS: true,
        dpi: 300,
      }).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "A4");
        const imgWidth = 190;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
        const pdfFileName = "BookPrint.pdf";

        pdf.save(pdfFileName); // Download the PDF

        setTimeout(() => {
          const link = document.createElement("a");
          link.href = pdfFileName;
          link.download = pdfFileName;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }, 500);

        setIsPrinting(false); // Show buttons after printing
      });
    }, 500);
  };

  return (
    <div className="print-container">
      <h2>Book Print</h2>

      <div className="input-container">
        <label>Book Code:</label>
        <input type="text" value={bookCode} readOnly />

        <label>Book Name:</label>
        <input type="text" value={bookName} readOnly />

        <label>Book Name (Marathi):</label>
        <input
          type="text"
          value={bookNameMarathi}
          readOnly
          className="marathi-text"
          placeholder="पुस्तकाचे नाव प्रविष्ट करा"
        />

        <label>Book Group:</label>
        <input
          type="text"
          value={bookGroupId}
          readOnly
          placeholder="Enter Book Group"
        />

        <label>Book Standard:</label>
        <input
          type="text"
          value={bookStandardId}
          readOnly
          placeholder="Enter Book Standard"
        />

        <label>Publication:</label>
        <input
          type="text"
          value={publicationId}
          readOnly
          placeholder="Enter Publication"
        />
      </div>

      {!isPrinting && <button onClick={handlePrint}>Print</button>} {/* Hide button when printing */}

      <div className="print-area" ref={printRef}>
        <h3>Sales Challan</h3>
        <p><strong>Book Code:</strong> {bookCode}</p>
        <p><strong>Book Name:</strong> {bookName}</p>
        <p className="marathi-text"><strong>Book Name (Marathi):</strong> {bookNameMarathi}</p>
        <p><strong>Book Group:</strong> {bookGroupId}</p>
        <p><strong>Book Standard:</strong> {bookStandardId}</p>
        <p><strong>Publication:</strong> {publicationId}</p>
      </div>

      <style>
        {`
          @media print {
            body {
              font-family: Arial, sans-serif;
            }
            .print-container {
              width: 21cm;
              height: 29.7cm;
              padding: 20px;
              margin: auto;
            }
            .print-area {
              border: 1px solid black;
              padding: 20px;
              font-size: 18px;
            }
          }
          .marathi-text {
            font-family: 'Noto Sans Devanagari', sans-serif;
          }
        `}
      </style>
    </div>
  );
}

export default BookPrint;
