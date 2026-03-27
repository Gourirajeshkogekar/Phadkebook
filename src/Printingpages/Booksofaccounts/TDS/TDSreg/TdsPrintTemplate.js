// import React, { forwardRef } from "react";

// const TDSPrintTemplate = forwardRef(({ data }, ref) => {
//   const { dates, selectedParty } = data;

//   return (
//     <div ref={ref} className="print-page" style={{
//       padding: "15mm",
//       fontFamily: "'Times New Roman', serif",
//       color: "#000",
//       backgroundColor: "#fff"
//     }}>
//       <style>
//         {`
//           @media print {
//             .print-page { width: 210mm; min-height: 297mm; }
//             table { width: 100%; border-collapse: collapse; font-size: 10pt; }
//             th { border-bottom: 1px dashed #000; border-top: 1px dashed #000; padding: 5px 2px; text-align: left; }
//             td { padding: 4px 2px; }
//           }
//         `}
//       </style>

//       {/* HEADER */}
//       <div style={{ textAlign: "center" }}>
//         <h2 style={{ margin: 0 }}>Phadke Prakashan, Kolhapur.</h2>
//         <div style={{ fontSize: "14pt", fontWeight: "bold", margin: "5px 0" }}>TDS Register</div>
//         <div>Period: {dates.start} To {dates.end}</div>
//       </div>

//       <div style={{ textAlign: "right", marginTop: "-20px" }}>Page: 1</div>

//       {/* TABLE */}
//       <table style={{ marginTop: "20px" }}>
//         <thead>
//           <tr>
//             <th>Trans Date</th>
//             <th>Entry #</th>
//             <th>Ref No.</th>
//             <th>Trans Cd.</th>
//             <th style={{ textAlign: "right" }}>Amount</th>
//             <th style={{ textAlign: "right" }}>Rate</th>
//             <th style={{ textAlign: "right" }}>TDS Amt</th>
//             <th style={{ textAlign: "right" }}>Total TDS</th>
//             <th>Bank Name</th>
//             <th>Cert #</th>
//           </tr>
//         </thead>
//         <tbody>
//           {/* Mapping would happen here */}
//           <tr>
//              <td colSpan={10} style={{ paddingTop: '20px', fontWeight: 'bold' }}>
//                PARTY: {selectedParty?.AccountName || "ALL PARTIES"}
//              </td>
//           </tr>
//           {/* Dummy Row for visual check */}
//           <tr>
//             <td>01/04/2025</td>
//             <td>E001</td>
//             <td>REF/101</td>
//             <td>TDS-94J</td>
//             <td style={{ textAlign: "right" }}>10,000.00</td>
//             <td style={{ textAlign: "right" }}>10%</td>
//             <td style={{ textAlign: "right" }}>1,000.00</td>
//             <td style={{ textAlign: "right" }}>1,000.00</td>
//             <td>HDFC BANK</td>
//             <td>C-882</td>
//           </tr>
//         </tbody>
//       </table>

//       {/* FOOTER AREA */}
//       <div style={{ marginTop: "30px", borderTop: "1px solid #000", paddingTop: "10px" }}>
//         <div style={{ fontWeight: "bold" }}>PAN NO: {selectedParty?.PanNo || "N/A"}</div>
//         <div style={{ marginTop: "10px", textAlign: "right", fontWeight: "bold" }}>
//           SUB TOTAL: 1,000.00
//         </div>
//       </div>
//     </div>
//   );
// });

// export default TDSPrintTemplate;



import React, { forwardRef } from "react";

const ROWS_PER_PAGE = 30;

const TDSPrintTemplate = forwardRef(({ data }, ref) => {

  const { dates, rows = [] } = data;

  const toNumber = (v) =>
    Number(String(v || "").replace(/,/g, "")) || 0;

  const grouped = rows.reduce((acc, row) => {

    const key = row["PressName"] || "Unknown";

    if (!acc[key]) acc[key] = [];

    acc[key].push(row);

    return acc;

  }, {});

  const groups = Object.entries(grouped);

  const flatRows = [];

  groups.forEach(([pressName, pressRows]) => {

    const pan = pressRows[0]["PAN No"] || "";
    const city = pressRows[0]["CityName"] || "";

    flatRows.push({
      type: "group",
      pressName,
      pan,
      city
    });

    pressRows.forEach(r => flatRows.push({ type: "row", data: r }));

    const subtotal = pressRows.reduce(
      (sum, r) => sum + toNumber(r["Amount Rate"]), 0
    );

    flatRows.push({
      type: "subtotal",
      value: subtotal
    });

  });

  const pages = [];

  for (let i = 0; i < flatRows.length; i += ROWS_PER_PAGE) {
    pages.push(flatRows.slice(i, i + ROWS_PER_PAGE));
  }

  return (

<div ref={ref} className="report">

<style>{`

.report{
 width:210mm;
 font-family:"Times New Roman";
 font-size:10px;
 background:#fff;
 color:#000;
}

.page{
 width:210mm;
 min-height:297mm;
 padding:15mm;
 box-sizing:border-box;
}

.header{
 text-align:center;
 margin-bottom:5px;
}

.title{
 font-size:16px;
 font-weight:bold;
}

.subtitle{
 font-size:13px;
 font-weight:bold;
}

.date{
 font-size:11px;
}

.pageLine{
 display:flex;
 justify-content:space-between;
 margin-top:3px;
}

table{
 width:100%;
 border-collapse:collapse;
 margin-top:8px;
}

th{
 border-top:1px dashed #000;
 border-bottom:1px dashed #000;
 padding:4px;
 text-align:left;
}

td{
 padding:3px;
}

.right{
 text-align:right;
}

.group{
 font-weight:bold;
 padding-top:6px;
}

.subtotal td{
 border-top:1px dashed #000;
 font-weight:bold;
}

`}</style>


{pages.map((pageRows, pageIndex) => (

<div className="page" key={pageIndex}>

{/* HEADER */}

<div className="header">

<div className="title">
Phadke Prakashan, Kolhapur.
</div>

<div className="subtitle">
TDS Register
</div>

<div className="date">
From {dates.start} to {dates.end}
</div>

</div>

<div className="pageLine">

<div></div>
<div>Page {pageIndex + 1}</div>

</div>


{/* TABLE */}

<table>

<thead>

<tr>

<th>Trans Date</th>
<th>Entry #</th>
<th>Ref No</th>
<th>Trans Cd</th>
<th className="right">Amount Rate</th>
<th className="right">TDS Surcharge</th>
<th className="right">H.Edu Cess</th>
<th className="right">Total TDS</th>
<th>Dt of Dep</th>
<th>Bank Name</th>
<th>Cert</th>

</tr>

</thead>

<tbody>

{pageRows.map((item, i) => {

if (item.type === "group") {

return (

<React.Fragment key={i}>

<tr className="group">

<td colSpan="11">
{item.pressName} &nbsp;&nbsp; PAN NO : {item.pan}
</td>

</tr>

<tr>

<td colSpan="11">
{item.city}
</td>

</tr>

</React.Fragment>

);

}

if (item.type === "row") {

const row = item.data;

return (

<tr key={i}>

<td>{row["Trans. Date"]}</td>
<td>{row["Entry/Ref.no."]}</td>
<td>{row["Entry/Ref.no."]}</td>
<td>{row["Trans. Cd."]}</td>

<td className="right">{row["Amount Rate"]}</td>
<td className="right">{row["TDS Surcharge Amount"]}</td>
<td className="right">{row["H. Edu. Cess"]}</td>
<td className="right">{row["Total TDS"]}</td>

<td>{row["Dt of Dep."]}</td>
<td>{row["Bank Name"]}</td>
<td>{row["Cert"]}</td>

</tr>

);

}

if (item.type === "subtotal") {

return (

<tr className="subtotal" key={i}>

<td></td>
<td></td>
<td></td>
<td></td>

<td className="right">
{item.value.toLocaleString()}
</td>

<td></td>
<td></td>

<td className="right">
{item.value.toLocaleString()}
</td>

<td></td>
<td></td>
<td></td>

</tr>

);

}

return null;

})}

</tbody>

</table>

</div>

))}

</div>

  );

});

export default TDSPrintTemplate;