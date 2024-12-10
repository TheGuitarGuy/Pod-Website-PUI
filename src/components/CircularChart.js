import React, { useState, useEffect } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const CircularChart = ({ percentage, label }) => {
    const [animatedPercentage, setAnimatedPercentage] = useState(0);

    useEffect(() => {
        let start = 0;
        const duration =3000;
        const increment = percentage / (duration / 16);

        const animate = () => {
            start += increment;
            if (start >= percentage) {
                setAnimatedPercentage(percentage);
            } else {
                setAnimatedPercentage(Math.ceil(start));
                requestAnimationFrame(animate);
            }
        };

        animate();

        return () => cancelAnimationFrame(animate);
    }, [percentage]);

    const data = {
        datasets: [
            {
                data: [animatedPercentage, 100 - animatedPercentage],
                backgroundColor: [label === "Check in rate" ? "#16DBCC" : "#1814F3", "#e0e0e0"],
                borderWidth: 0,
            },
        ],
    };

    const options = {
        cutout: "80%",
        plugins: {
            tooltip: { enabled: false },
            legend: { display: false },
        },
        animation: { duration: 1000 },
    };

    return (
        <div style={{ width: "260px", height: "260px", textAlign: "center", position: "relative" }}>
            <Doughnut data={data} options={options} />
            <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", fontSize: "24px", fontWeight: "bold" }}>
                {animatedPercentage}%
                <div style={{ fontSize: "14px", color: "#666" }}>{label}</div>
            </div>
        </div>
    );
};

export default CircularChart;
