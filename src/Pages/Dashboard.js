import React from "react";
import "./Dashboard.css";
import DoughnutChart from "./DoughnutChart";

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <h1 style={{fontWeight: 500,textAlign:'center'}}>Dashboard for Phadke Prakashan</h1>

      <div className="dashboardcard-container">
        {/* First row of cards */}
        <div className="dashcard-row">
          <div className="dashcard">
            <h3>Masters</h3>
            <p>Master details</p>
          </div>
          <div className="dashcard">
            <h3>Transactions</h3>
            <p>Transactions details</p>
          </div>
          <div className="dashcard">
            <h3>Printing</h3>
            <p>Printing details</p>
          </div>
        </div>

        {/* second row of cards */}
        <div className="dashcard-row">
          <div className="dashcard">
            <h3>Royalty</h3>
            <p>Royalty count</p>
          </div>
          <div className="dashcard">
            <h3>Company</h3>
            <p>Company details</p>
          </div>
          <div className="dashcard">
            <h3>Settings</h3>
            <p>Settings</p>
          </div>
        </div>
      </div>

      {/* Doughnut chart */}
      <div className="doughnut-chart">
        <DoughnutChart />
      </div>
    </div>
  );
};

export default Dashboard;






