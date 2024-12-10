import React from "react";
import styled from "styled-components";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

// Register the required Chart.js elements
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChart = ({ events }) => {
    // Example data for "Sign ups" and "Checked in"
    const labels = ["Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb"];
    const signups = [40, 35, 50, 70, 60, 80, 55];
    const checkins = [25, 20, 35, 50, 45, 60, 40];

    const chartData = {
        labels,
        datasets: [
            {
                label: "Sign ups",
                data: signups,
                backgroundColor: "#1814F3", // Solid blue for "Sign ups"
                borderRadius: 8, // Rounded corners
                maxBarThickness: 20, // Controls the bar thickness
            },
            {
                label: "Checked in",
                data: checkins,
                backgroundColor: "#16DBCC", // Solid green for "Checked in"
                borderRadius: 8, // Rounded corners
                maxBarThickness: 20, // Controls the bar thickness
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false, // Allows the chart to fill its container
        plugins: {
            legend: {
                position: "top",
                labels: {
                    boxWidth: 10,
                },
            },
            title: {
                display: false,
            },
        },
        scales: {
            x: {
                grid: {
                    display: false,
                },
                barPercentage: 0.5, // Controls the width of the bars relative to the category
                categoryPercentage: 0.5, // Controls the width of the category relative to the available space
            },
            y: {
                beginAtZero: true,
                grid: {
                    drawBorder: false,
                    color: "rgba(200, 200, 200, 0.3)",
                },
            },
        },
    };

    return (
        <ChartContainer>
            <Bar data={chartData} options={options} />
        </ChartContainer>
    );
};

export default BarChart;

// Styled Components
const ChartContainer = styled.div`
    width: 100%;
    height: 100%;

    @media (max-width: 1024px) {
        max-width: 400px;
        margin: 0 auto;
    }

    @media (max-width: 768px) {
        max-width: 350px;
    }

    @media (max-width: 480px) {
        max-width: 300px;
    }
`;
