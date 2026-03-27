// import React, { forwardRef } from "react";
// import { Box, Typography } from "@mui/material";

// const ReceiptPrint = forwardRef(({ data }, ref) => {
//   // If data isn't ready, show nothing
//   if (!data) return null;

//   return (
//     <Box
//       ref={ref}
//       sx={{
//         width: "210mm",
//         height: "297mm",
//         bgcolor: "white",
//         p: "20mm",
//         color: "black",
//         fontFamily: "'Courier New', Courier, monospace", // Dot matrix style
//         position: 'relative'
//       }}
//     >
//       {/* Top Right Header Block */}
//       <Box sx={{ position: 'absolute', top: '35mm', right: '45mm', textAlign: 'left' }}>
//         <Typography sx={{ fontWeight: 'bold', fontSize: '1.2rem', mb: 1, pl: 5 }}>
//           {data.serialNo}
//         </Typography>
//         <Typography sx={{ fontSize: '1rem', mb: 1 }}>
//           {data.date}
//         </Typography>
//         <Typography sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
//           {data.amount}
//         </Typography>
//       </Box>

//       {/* Main Body Content */}
//       <Box sx={{ mt: '85mm', width: '100%', pl: '20mm' }}>
//         {/* Bank Line */}
//         <Typography sx={{ fontSize: '1rem', mb: 4 }}>
//           {data.bankDetails}
//         </Typography>

//         {/* Amount Words */}
//         <Typography sx={{ fontSize: '1rem', mb: 2, textAlign: 'center', pl: '20mm' }}>
//           {data.amountInWords}
//         </Typography>

//         {/* Particulars */}
//         <Typography sx={{ fontSize: '1rem', mb: 2, textAlign: 'center', pr: '20mm' }}>
//           {data.particulars}
//         </Typography>

//         {/* Payment Mode */}
//         <Typography sx={{ fontSize: '1.1rem', fontWeight: 'bold', mt: 5 }}>
//           {data.paymentMode}
//         </Typography>
//       </Box>
//     </Box>
//   );
// });

// export default ReceiptPrint;


import React, { forwardRef } from "react";
import { Box, Typography } from "@mui/material";

const ReceiptPrint = forwardRef(({ data = [] }, ref) => {

  return (

    <Box ref={ref} sx={{ width: "210mm", bgcolor: "white" }}>

      {data.map((item, index) => (

        <Box
          key={index}
          sx={{
            width: "210mm",
            height: "297mm",
            p: "25mm",
            boxSizing: "border-box",
            pageBreakAfter: "always",
            fontFamily: "Courier New",
            position: "relative"
          }}
        >

          {/* ===== TOP RIGHT RECEIPT DETAILS ===== */}

          <Box
            sx={{
              position: "absolute",
              top: "40mm",
              right: "35mm",
              textAlign: "right"
            }}
          >
            <Typography fontWeight="bold" fontSize="20px">
              {item.serialNo}
            </Typography>

            <Typography fontSize="16px">
              {item.date}
            </Typography>

            <Typography fontWeight="bold" fontSize="18px">
              {item.amount}
            </Typography>
          </Box>


          {/* ===== BANK DETAILS ===== */}

          <Box
            sx={{
              position: "absolute",
              top: "120mm",
              left: "30mm",
              width: "140mm"
            }}
          >
            <Typography sx={{ whiteSpace: "pre-line", fontSize: "16px" }}>
              {item.bankDetails}
            </Typography>
          </Box>


          {/* ===== GRAND TOTAL ===== */}

          <Box
            sx={{
              position: "absolute",
              top: "170mm",
              width: "100%",
              textAlign: "center"
            }}
          >
            <Typography fontSize="18px">
              {item.amountInWords}
            </Typography>
          </Box>


          {/* ===== PARTICULARS ===== */}

          <Box
            sx={{
              position: "absolute",
              top: "200mm",
              width: "100%",
              textAlign: "center"
            }}
          >
            <Typography fontSize="16px">
              {item.particulars}
            </Typography>
          </Box>


          {/* ===== COPY TYPE ===== */}

          <Box
            sx={{
              position: "absolute",
              top: "240mm",
              left: "30mm"
            }}
          >
            <Typography fontWeight="bold" fontSize="18px">
              {item.paymentMode}
            </Typography>
          </Box>

        </Box>

      ))}

    </Box>

  );

});

export default ReceiptPrint;