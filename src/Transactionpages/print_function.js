const handlePrint1 = async () => {
  if (!componentRef.current) {
    alert("Nothing to print! Please try again.");
    return;
  }

  const input = componentRef.current;
  const pdf = new jsPDF({
    // orientation: "landscape",
    orientation: "portrait",

    unit: "mm",
    pageSize:'A5'
    // format: [230, 125],
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
      pageDiv.style.width = "100mm"; // ✅ A5 width in landscape
      pageDiv.style.height = "80mm"; // ✅ A5 height in landscape
      pageDiv.style.position = "absolute";
      // pageDiv.style.left = "-9999px";
      pageDiv.style.background = "white";
      pageDiv.style.overflow = "hidden"; // Ensure no content is clipped

      const tableClone = input.cloneNode(true);
      tableClone.querySelector("tbody").innerHTML = "";

      pages[i].forEach(row => tableClone.querySelector("tbody").appendChild(row.cloneNode(true)));

      pageDiv.appendChild(tableClone);
      document.body.appendChild(pageDiv);

      // ✅ Adjust html2canvas capture for landscape
      const canvas = await html2canvas(pageDiv, {
        scale: 4,  // ✅ Higher scale for better clarity
        // width: 210, 
        // height: 148,
        useCORS: true,
      });

      const imgData = canvas.toDataURL("image/png");

      // ✅ Ensure correct image scaling
      const pageWidth = pdf.internal.pageSize.getWidth(); // 210 mm (landscape)
      const pageHeight = pdf.internal.pageSize.getHeight(); // 148 mm (landscape)

      pdf.addImage(imgData, "PNG", 0, 0, pageWidth, pageHeight);

      // ✅ Add page number at bottom
      pdf.setFontSize(10);
      pdf.text(`Page ${i + 1}`, pageWidth - 10, 140, { align: "right" });

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



const handlePrint2 = async () => {
  if (!componentRef.current) {
    alert("Nothing to print! Please try again.");
    return;
  }

  const input = componentRef.current;
  const pdf = new jsPDF({
    orientation: "portrait", // ✅ A4 Portrait
    unit: "mm",
    format: "a4", // ✅ Ensure A4 format
  });

  try {
    // ✅ Capture only the required portion (Half of A4 height)
    const canvas = await html2canvas(input, {
      scale: 4, 
      useCORS: true,
      width: 210, // A4 width
      height: 148.5, // Half of A4 height
    });

    const imgData = canvas.toDataURL("image/png");

    // ✅ Add the captured portion to the A4 page at the top
    pdf.addImage(imgData, "PNG", 0, 0, 210, 148.5);

    // ✅ Open print preview
    window.open(pdf.output("bloburl"), "_blank");

  } catch (error) {
    console.error("Error generating PDF:", error);
    alert("Failed to generate PDF. Please try again.");
  }
};




const handlePrint = async () => {
  if (!componentRef.current) {
    alert("Nothing to print! Please try again.");
    return;
  }

  const input = componentRef.current;
  const pdf = new jsPDF({
    orientation: "portrait", // ✅ A4 Portrait
    unit: "mm",
    format: [210, 148.5], // ✅ A4 Width (210mm) × Half of A4 Height (148.5mm)
    
  });

  const tbody = input.querySelector("tbody");
  if (!tbody) {
    alert("No table body found!");
    return;
  }

  const rows = Array.from(tbody.querySelectorAll("tr"));
  const rowsPerPage = 10; // ✅ Adjust based on A4 size
  const pages = [];

  for (let i = 0; i < rows.length; i += rowsPerPage) {
    pages.push(rows.slice(i, i + rowsPerPage));
  }

  try {
    for (let i = 0; i < pages.length; i++) {
      const pageDiv = document.createElement("div");
      pageDiv.style.width = "210mm"; // ✅ A4 width
      pageDiv.style.height = "148.5mm"; // ✅ A4 height
      pageDiv.style.position = "absolute";
      pageDiv.style.background = "white";
      pageDiv.style.overflow = "hidden"; // Prevents content from being clipped

      const tableClone = input.cloneNode(true);
      tableClone.querySelector("tbody").innerHTML = "";

      pages[i].forEach(row => tableClone.querySelector("tbody").appendChild(row.cloneNode(true)));

      pageDiv.appendChild(tableClone);
      document.body.appendChild(pageDiv);

      // ✅ Capture the page as an image
      const canvas = await html2canvas(pageDiv, {
        scale: 3, // ✅ High-quality output
        useCORS: true,
      });

      const imgData = canvas.toDataURL("image/png");

      // ✅ Get PDF page dimensions
      const pageWidth = pdf.internal.pageSize.getWidth(); // 210 mm
      const pageHeight = pdf.internal.pageSize.getHeight(); // 297 mm

      pdf.addImage(imgData, "PNG", 0, 0, pageWidth, pageHeight);

      // ✅ Add Page Number at Bottom
      pdf.setFontSize(10);
      // pdf.text(`Page ${i + 1}`, pageWidth - 15, pageHeight - 10, { align: "right" });

      document.body.removeChild(pageDiv);

      // ✅ Add new page if needed
      if (i < pages.length - 1) {
        pdf.addPage();
      }
    }

    // ✅ Open Print Preview
    window.open(pdf.output("bloburl"), "_blank");

  } catch (error) {
    console.error("Error generating PDF:", error);
    alert("Failed to generate PDF. Please try again.");
  }
};



  // const handlePrint = async () => {

  //     if (!componentRef.current) {
    
  //       alert("Nothing to print! Please try again.");
    
  //       return;
    
  //     }
    
    
    
  //     const input = componentRef.current;
    
  //     const pdf = new jsPDF({
    
  //       orientation: "portrait", // ✅ Ensure Portrait A4
    
  //       unit: "mm",
    
  //       format: "a4", // ✅ Full A4 Page
    
  //     });
    
    
    
  //     // Ensure full page width
    
  //     input.style.width = "210mm";
    
  //     input.style.height = "148.5mm";
    
  //     input.style.overflow = "hidden";
    
    
    
  //     try {
    
  //       // ✅ Capture the page as an image
    
  //       const canvas = await html2canvas(input, {
    
  //         scale: 2, // ✅ High-Quality Scaling
    
  //         useCORS: true,
    
  //       });
    
    
    
  //       const imgData = canvas.toDataURL("image/png");
    
    
    
  //       // ✅ Get PDF page dimensions
    
  //       const pageWidth = pdf.internal.pageSize.getWidth();  // 210 mm
    
  //       const pageHeight = pdf.internal.pageSize.getHeight(); // 297 mm
    
    
    
  //       pdf.addImage(imgData, "PNG", 0, 0, pageWidth, pageHeight);
    
  //       
    
  //       // ✅ Open Print Preview
    
  //       window.open(pdf.output("bloburl"), "_blank");
    
    
    
  //     } catch (error) {
    
  //       console.error("Error generating PDF:", error);
    
  //       alert("Failed to generate PDF. Please try again.");
    
  //     }
    
  //   }; 




//   const handlePrint = async () => {
//     if (!componentRef.current) {
//         alert("Nothing to print! Please try again.");
//         return;
//     }

//     const input = componentRef.current;
//     const pdf = new jsPDF({
//         orientation: "portrait",
//         unit: "mm",
//         format: "a4",
//     });

//     const table = input.querySelector("table");
//     if (!table) {
//         alert("No table found!");
//         return;
//     }

//     const thead = table.querySelector("thead");
//     const tbody = table.querySelector("tbody");
//     const tfoot = table.querySelector("tfoot");

//     if (!tbody) {
//         alert("No table body found!");
//         return;
//     }

//     const rows = Array.from(tbody.querySelectorAll("tr"));
//     const rowsPerPage = 9;
//     const pages = [];

//     for (let i = 0; i < rows.length; i += rowsPerPage) {
//         pages.push(rows.slice(i, i + rowsPerPage));
//     }

//     try {
//         for (let i = 0; i < pages.length; i++) {
//             const pageDiv = document.createElement("div");
//             pageDiv.style.width = "210mm";
//             pageDiv.style.height = "148.5mm";
//             pageDiv.style.position = "absolute";
//             pageDiv.style.background = "white";
//             pageDiv.style.overflow = "hidden";

//             // Clone the entire component content for each page
//             const clonedContent = input.cloneNode(true);
//             const clonedTable = clonedContent.querySelector("table");
//             const clonedTbody = clonedTable.querySelector("tbody");
//             clonedTbody.innerHTML = ""; // Clear existing table rows

//             pages[i].forEach((row) => clonedTbody.appendChild(row.cloneNode(true)));
//             pageDiv.appendChild(clonedContent);
//             document.body.appendChild(pageDiv);

//             const canvas = await html2canvas(pageDiv, {
//                 scale: 2,
//                 useCORS: true,
//             });

//             const imgData = canvas.toDataURL("image/png");
//             const pageWidth = pdf.internal.pageSize.getWidth();
//             const pageHeight = pdf.internal.pageSize.getHeight();
//             const pageNumberText = `Page ${i + 1} of ${pages.length}`;
// const pageNumberTextHeight = pdf.getTextDimensions(pageNumberText).h;
//             const pageNumberY = pageHeight - 150 - pageNumberTextHeight; // 20mm margin

//             pdf.addImage(imgData, "PNG", 0, 0, pageWidth, pageHeight);

//             pdf.setFontSize(10);
//             pdf.text(pageNumberText, pageWidth - 20, pageNumberY, { align: "right" });

//             document.body.removeChild(pageDiv);

//             if (i < pages.length - 1) {
//                 pdf.addPage();
//             } else if (tfoot) {
//                 const footerDiv = document.createElement("div");
//                 footerDiv.style.width = "210mm";
//                 footerDiv.style.height = "148.5mm";
//                 footerDiv.style.position = "absolute";
//                 footerDiv.style.background = "white";
//                 footerDiv.style.overflow = "hidden";

//                 const footerTable = document.createElement("table");
//                 footerTable.style.width = "100%";
//                 footerTable.appendChild(tfoot.cloneNode(true));
//                 footerDiv.appendChild(footerTable);

//                 document.body.appendChild(footerDiv);

//                 const footerCanvas = await html2canvas(footerDiv, {
//                     scale: 2,
//                     useCORS: true,
//                 });

//                 const footerImgData = footerCanvas.toDataURL("image/png");
//                 pdf.addPage();
//                 pdf.addImage(footerImgData, "PNG", 0, 0, pageWidth, pageHeight);
//                 pdf.setFontSize(10);
//                 pdf.text(pageNumberText, pageWidth - 20, pageNumberY, { align: "right" });
//                 document.body.removeChild(footerDiv);
//             }
//         }

//         window.open(pdf.output("bloburl"), "_blank");
//     } catch (error) {
//         console.error("Error generating PDF:", error);
//         alert("Failed to generate PDF. Please try again.");
//     }
// };