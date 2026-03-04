import React, { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";

function BankRecoReport() {
  const [rows, setRows] = useState([]);
  const params = new URLSearchParams(window.location.search);

  const StartDate = params.get("StartDate");
  const EndDate = params.get("EndDate");
  const AccountId = params.get("AccountId");

  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async () => {
    const res = await axios.get(
      "https://publication.microtechsolutions.net.in/php/get/getBankReconcilationReport.php",
      {
        params: {
          StartDate,
          EndDate,
          AccounId: AccountId,
        },
      }
    );

    setRows(res.data.data || []);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ padding: "20px" }}>
      {/* 🔹 PRINT BUTTON */}
      <div style={{ textAlign: "right", marginBottom: "10px" }}>
        <button onClick={handlePrint} style={{ padding: "6px 12px" }}>
          Print
        </button>
      </div>

      <h2 style={{ textAlign: "center" }}>Bank Reconciliation Report</h2>

      <p>
        Period: {dayjs(StartDate).format("DD-MM-YYYY")} to{" "}
        {dayjs(EndDate).format("DD-MM-YYYY")}
      </p>

      <table width="100%" border="1" cellPadding="6">
        <thead>
          <tr>
            <th>Sr</th>
            <th>Cheque Date</th>
            <th>Cheque No</th>
            <th>Account</th>
            <th>Debit</th>
            <th>Credit</th>
            <th>Passing Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              <td>{i + 1}</td>
              <td>{dayjs(r.ChequeDate).format("DD-MM-YYYY")}</td>
              <td>{r.CheqNo}</td>
              <td>{r.AccountName}</td>
              <td>{r.Debit}</td>
              <td>{r.Credit}</td>
              <td>
                {r.PassingDate
                  ? dayjs(r.PassingDate).format("DD-MM-YYYY")
                  : ""}
              </td>
              <td>{r.ReconciliationStatus}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default BankRecoReport;
