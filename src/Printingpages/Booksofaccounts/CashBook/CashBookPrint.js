// import React, { useEffect, useState } from "react";
// import { Box, Typography, Divider } from "@mui/material";

// export default function BankBookPrint() {

//   const [formData, setFormData] = useState(null);

//   useEffect(() => {
//     const stored = JSON.parse(localStorage.getItem("bankBookFormData"));
//     setFormData(stored);
//   }, []);

//   return (
//     <Box sx={{ p: 4, bgcolor: "#f4f6f9", minHeight: "100vh" }}>

//       <Box
//         sx={{
//           maxWidth: 1000,
//           mx: "auto",
//           bgcolor: "#fff",
//           p: 5,
//           borderRadius: 2,
//           boxShadow: "0 10px 30px rgba(0,0,0,0.1)"
//         }}
//       >

//         {/* HEADER */}
//         <Typography align="center" fontWeight={700} fontSize={20}>
//           PHADKE PRAKASHAN, KOLHAPUR
//         </Typography>

//         <Typography align="center" mt={1} fontWeight={600}>
//           CASH / BANK BOOK
//         </Typography>

//         <Typography align="center" mt={1}>
//           From {formData?.startDate} To {formData?.endDate}
//         </Typography>

//         <Divider sx={{ my: 3 }} />

//         {/* COLUMN HEADER */}
//         <Box
//           sx={{
//             display: "grid",
//             gridTemplateColumns:
//               "120px 1.2fr 1.2fr 120px 120px 140px",
//             fontWeight: 700,
//             pb: 1
//           }}
//         >
//           <div>Date</div>
//           <div>Account</div>
//           <div>Particulars</div>
//           <div style={{ textAlign: "right" }}>Debit</div>
//           <div style={{ textAlign: "right" }}>Credit</div>
//           <div style={{ textAlign: "right" }}>Balance</div>
//         </Box>

//         <Divider sx={{ mb: 2 }} />

//         {/* EMPTY STRUCTURE */}
//         <Box py={5} textAlign="center" color="#607d8b">
//           Transaction rows will appear here after API integration
//         </Box>

//       </Box>

//     </Box>
//   );
// }




import React, { useEffect, useState } from "react";
import { Box, Typography, Divider } from "@mui/material";


export default function CashBookPrint({ printing }) {

  const [formData, setFormData] = useState(null);

  useEffect(() => {

    const stored = localStorage.getItem("bankBookFormData");

    if (stored) {
      setFormData(JSON.parse(stored));
    }

  }, [printing]);

  if (!formData) return null;

  const rows = Array.isArray(formData.rows) ? formData.rows : [];
  const totals = Array.isArray(formData.totals) ? formData.totals : [];

  /* ===============================
     GROUP ROWS BY DATE
  =============================== */

  const groupedRows = rows.reduce((acc, row) => {

    const date = row?.Date || "Unknown";

    if (!acc[date]) acc[date] = [];

    acc[date].push(row);

    return acc;

  }, {});

  /* ===============================
     SORT DATES
  =============================== */

  const sortedDates = Object.keys(groupedRows).sort((a, b) => {

    if (a === "Unknown") return 1;
    if (b === "Unknown") return -1;

    const [da, ma, ya] = a.split("-");
    const [db, mb, yb] = b.split("-");

    const d1 = new Date(`${ya}-${ma}-${da}`);
    const d2 = new Date(`${yb}-${mb}-${db}`);

    return d1 - d2;

  });

  /* ===============================
     FORMAT DATE
  =============================== */

  const formatFullDate = (dateStr) => {

    if (!dateStr || dateStr === "Unknown") return dateStr;

    const [d, m, y] = dateStr.split("-");

    const date = new Date(`${y}-${m}-${d}`);

    if (isNaN(date)) return dateStr;

    return date.toLocaleDateString("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric"
    });

  };

  return (

    <Box
      sx={{
        p: 4,
        bgcolor: "#fff",
        width: "210mm",
        minHeight: "297mm",
        fontSize: 14
      }}
    >

      {/* ================= HEADER ================= */}

      {!printing && (
        <>
          <Typography align="center" fontWeight={700} fontSize={22}>
            PHADKE PRAKASHAN, KOLHAPUR
          </Typography>

          <Typography align="center" mt={1} fontWeight={600} fontSize={18}>
            CASH / BANK BOOK
          </Typography>

          <Typography align="center" mt={1}>
            From {formData.startDate} To {formData.endDate}
          </Typography>

          <Divider sx={{ my: 3 }} />
        </>
      )}

      {/* ACCOUNT NAME */}

      <Typography fontWeight={700} mb={2}>
        {formData.accountName || rows[0]?.Account || ""}
      </Typography>

      {/* ================= TABLE HEADER ================= */}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "80px 1.4fr 1.6fr 120px 120px 120px 140px",
          borderBottom: "2px solid black",
          fontWeight: 700,
          pb: 1,
          mb: 2
        }}
      >
        <div>Entry No</div>
        <div>Account Name</div>
        <div>Particulars</div>
        <div>Chq. No</div>
        <div style={{ textAlign: "right" }}>Debit</div>
        <div style={{ textAlign: "right" }}>Credit</div>
        <div style={{ textAlign: "right" }}>Balance</div>
      </Box>

      {/* ================= ROW DATA ================= */}

      {sortedDates.map((date) => (

        <Box key={date} mb={3}>

          <Typography align="center" fontWeight={700} mb={1}>
            {formatFullDate(date)}
          </Typography>

          {groupedRows[date].map((row, index) => (

            <Box
              key={`${date}-${index}`}
              sx={{
                display: "grid",
                gridTemplateColumns:
                  "80px 1.4fr 1.6fr 120px 120px 120px 140px",
                py: 0.7
              }}
            >

              <div>{row?.["Entry No."] || ""}</div>

              <div>{row?.Account || ""}</div>

              <div>{row?.Particulars || ""}</div>

              <div>{row?.["Chq.No."] || ""}</div>

              <div style={{ textAlign: "right" }}>
                {row?.Debit || "0.00"}
              </div>

              <div style={{ textAlign: "right" }}>
                {row?.Credit || "0.00"}
              </div>

              <div style={{ textAlign: "right" }}>
                {row?.Balance || "0.00"}
              </div>

            </Box>

          ))}

          {/* ================= DAILY TOTAL ================= */}

          {totals
            .filter((t) => t?.Date === date)
            .map((t, i) => (

              <Box
                key={`total-${date}-${i}`}
                sx={{
                  display: "grid",
                  gridTemplateColumns:
                    "80px 1.4fr 1.6fr 120px 120px 120px 140px",
                  fontWeight: 700,
                  borderTop: "1px solid black",
                  pt: 1
                }}
              >

                <div></div>

                <div>Daily Total</div>

                <div></div>

                <div></div>

                <div style={{ textAlign: "right" }}>
                  {t?.Debit || "0.00"}
                </div>

                <div style={{ textAlign: "right" }}>
                  {t?.Credit || "0.00"}
                </div>

                <div style={{ textAlign: "right" }}>
                  {t?.Balance || "0.00"}
                </div>

              </Box>

            ))}

        </Box>

      ))}

    </Box>

  );

}