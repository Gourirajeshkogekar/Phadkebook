import React, { useRef, useEffect } from "react";
import Chart from "chart.js/auto"; // Import 'chart.js/auto' for the latest Chart.js version

const DoughnutChart = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    let myChart;

    if (chartRef.current) {
      // Clear the canvas
      const ctx = chartRef.current.getContext("2d");
      ctx.clearRect(0, 0, chartRef.current.width, chartRef.current.height);

      // Destroy the old chart instance if it exists
      if (myChart) {
        myChart.destroy();
      }
      // Create a new chart instance
      myChart = new Chart(ctx, {
        type: "doughnut",
        // Sample data for the chart
        data: {
          labels: ["Category 1", "Category 2", "Category 3", "Category 4"],
          datasets: [
            {
              data: [30, 40, 30, 20], // Replace with your data values
              backgroundColor: ["red", "green", "blue", "yellow"], // Replace with your color values
            },
          ],
        }, // Pass your data object here
        options: {
          cutout: "70%",
          // Adjust the size of the hole in the middle
          responsive: false,
          maintainAspectRatio: true,
        },
      });
    }

    return () => {
      // Cleanup when the component is unmounted
      if (myChart) {
        myChart.destroy();
      }
    };
  }, []); // Ensure this effect runs only once on mount

  return (
    // <div style={{ position: "absolute", bottom: 10, right: 10 }}>
    <div style={{ position: "relative", marginTop: "30px", float: "right" }}>
      <canvas ref={chartRef} width="190" height="190" />{" "}
      {/* Set width and height as needed */}
    </div>
  );
};

export default DoughnutChart;
