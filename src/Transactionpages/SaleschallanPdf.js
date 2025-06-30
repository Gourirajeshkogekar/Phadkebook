import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFDownloadLink,Font 
} from "@react-pdf/renderer";
import './Saleschallanprint.css'

// ✅ Register font with correct path (only .ttf files)
Font.register({
    family: "Roboto",
    src: "/fonts/Roboto-Regular.ttf", // Make sure the path is correct!
  });

  
const styles = StyleSheet.create({
  page: { padding: 5, fontSize: 10 },
  headerSection: { marginBottom: 10,marginTop:20, paddingLeft: 80, fontWeight:'700' },
  headerText: { fontSize: 11, fontWeight: 500},
  normalText: { fontSize: 10, fontWeight:500 },
  row: { flexDirection: "row",  },
  cell: { flex: 1, padding: 3 },
  bold: { fontWeight: "bold" },
  table: { display: "table", width: "100%", marginTop: 25,marginLeft:80 },
  // tableHeader: { backgroundColor: "#e0e0e0", padding: 5 },
  rightAlign: { textAlign: "right", fontWeight: "bold" },
  footer: { marginTop: 10, paddingLeft: 80, fontSize: 10 },

  text: {
    fontFamily: "Roboto", 
    fontSize: 10,
  },
});



const SalesChallanPDF = ({ challanData }) => {
  const recordsPerPage = 10;
  const totalPages = Math.ceil(challanData.length / recordsPerPage);

  // Calculate totals
  let totalCopies = 0;
  let totalRs = 0;
  let totalPs = 0;

  challanData.forEach(item => {
    totalCopies += item.Copies;
    totalRs += Math.floor(item.Amount);
    totalPs += Math.round((item.Amount % 1) * 100);
  });

  // Adjust paisa if it exceeds 100
  if (totalPs >= 100) {
    totalRs += Math.floor(totalPs / 100);
    totalPs = totalPs % 100;
  }

  return (
    <Document>
      {Array.from({ length: totalPages }).map((_, pageIndex) => {
        const start = pageIndex * recordsPerPage;
        const end = start + recordsPerPage;
        const pageData = challanData.slice(start, end);

        return (
          <Page key={pageIndex} size="A5" orientation="landscape" style={styles.page}>
            <View style={styles.headerSection}>
              <Text style={styles.headerText}>{challanData[0].AccountName}</Text>
              <Text style={styles.normalText}>
  {[
    challanData[0].Address1,
    challanData[0].Address2,
    challanData[0].Address3,
    challanData[0].StateName,
    `Dist: ${challanData[0].CityName}`,
  ]
    .filter(Boolean)
    .join(", ")}
</Text>
<Text style={styles.normalText}>{challanData[0].GSTNo}</Text>


            </View>

            <View style={{ flexDirection: "row", justifyContent: "center",marginLeft:220}}>
              <Text style={{ marginRight: 50 }}>{challanData[0].ChallanDate.substring(0, 10)}</Text>
              <Text style={styles.bold}>{challanData[0].ChallanNo}</Text>
            </View>

<View style={styles.table}>
  {pageData.map((item, index) => {
    console.log(item.BookNameMarathi, 'book name marathi')
    const rupees = Math.floor(item.Amount);
    const paisa = String(Math.round((item.Amount % 1) * 100)).padStart(2, "0");

    return (
      <View key={index} style={styles.row}>
        <Text style={[styles.cell,{maxWidth:'15px', } ]}>{start + index + 1}</Text>
        <Text style={[styles.cell,{ maxWidth:'50px'} ]}>{item.BookCode}</Text>
        <Text style={[styles.cell,{maxWidth:'50px' }]}>{item.StandardName}</Text>
        <Text style={[styles.cell, styles.text, { maxWidth: "170px" }]}> 
         {item.BookNameMarathi}
        </Text>
      <Text style={[styles.cell, styles.rightAlign, { maxWidth:'50px', }]}>{item.Copies}</Text>
        <Text style={[styles.cell, styles.rightAlign, { maxWidth:'60px', }]}>{`${rupees}.${paisa}`}</Text>
      </View>
    );
  })}

  {/* Total Copies and Amount Row - Ensure Proper Alignment */}
  {pageIndex === totalPages - 1 && (
    <View style={[styles.row, {marginTop: 5 }]}>
      <Text style={[styles.cell,{maxWidth:'15px', } ]}></Text>
    <Text style={[styles.cell,{maxWidth:'50px', } ]}></Text>
      <Text style={[styles.cell,{maxWidth:'50px', } ]}></Text>
      <Text style={[styles.cell, styles.text, { maxWidth:'170px' ,textAlign: "right" }]}></Text>
      <Text style={[styles.cell, styles.rightAlign, { maxWidth:'50px' }]}>{totalCopies}</Text>
      <Text style={[styles.cell, styles.rightAlign, { maxWidth:'60px' }]}>{`${totalRs}.${totalPs.toString().padStart(2, "0")}`}</Text>
    </View>
  )}
</View>


            {/* Show totals only on the last page */}
            {pageIndex === totalPages - 1 && (
              <>
                <View style={styles.footer}>
                  <Text style={styles.bold}>{challanData[0].Transport}</Text>
                </View>

                
              </>
            )}

            <View style={{ textAlign: "center",marginLeft:300 }}>
              <Text>Page {pageIndex + 1} of {totalPages}</Text>
            </View>
          </Page>
        );
      })}
    </Document>
  );
}; 
export default SalesChallanPDF;