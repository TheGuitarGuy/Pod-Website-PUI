import React from "react";
import styled from "styled-components";
import BarChart from "./BarChart";
import CircularChart from "./CircularChart";
import MeasureBar from "./MeasureBar";
import { FaPen } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import PodLogo from "../images/pod-logo-logotype.png";

const Dashboard = () => {
    const navigate = useNavigate();

    const handleCreateEvent = () => {
        navigate("/event-form");
    };

    return (
        <Container>
            <Header>
                <Logo src={PodLogo} alt="Pod Logo" />
                <HeaderRight>
                    <Button onClick={handleCreateEvent}>
                        <FaPen aria-label="Create Event Icon" />
                        Create Event
                    </Button>
                    <Profile>
                        <img
                            src="https://via.placeholder.com/40"
                            alt="profile"
                        />
                    </Profile>
                </HeaderRight>
            </Header>

            <Main>
                <BarChartAndMetrics>
                    <BarChartContainer>
                        <BarChart
                            events={[
                                { eventName: "Aug", attendeeCount: 40 },
                                { eventName: "Sep", attendeeCount: 30 },
                                { eventName: "Oct", attendeeCount: 50 },
                            ]}
                        />
                    </BarChartContainer>
                    <Metrics>
                        <MeasureBar
                            label="Monthly Leads"
                            value={1536}
                            maxValue={2000}
                            color="#16DBCC"
                        />
                        <MeasureBar
                            label="Monthly Sales"
                            value={1244.35}
                            maxValue={5000}
                            color="#1814F3"
                        />
                    </Metrics>
                </BarChartAndMetrics>

                <CircularCharts>
                    <CircularChart percentage={82} label="Check in rate" />
                    <CircularChart percentage={75} label="Coupon usage" />
                </CircularCharts>
            </Main>
        </Container>
    );
};

export default Dashboard;

// Styled Components
const Container = styled.div`
    width: 100vw;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    font-family: Arial, sans-serif;
    background-color: #f8f9fc;
`;

const Header = styled.header`
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #2d2e83;
    padding: 10px 20px;
    color: white;
    height: 80px; /* Fixed height instead of clamp */

    @media (max-width: 768px) {
        height: 70px; 
    }

    @media (max-width: 480px) {
        height: 60px;
    }
`;




const Logo = styled.img`
    height: auto;
    max-height: 60px;

    @media (max-width: 768px) {
        max-height: 50px;
    }

    @media (max-width: 480px) {
        max-height: 40px;
    }
`;

const HeaderRight = styled.div`
    display: flex;
    align-items: center;
`;

const Button = styled.button`
    background-color: #ff0a81;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 20px;
    cursor: pointer;
    font-size: 14px;
    font-weight: bold;
    display: flex;
    align-items: center;
    gap: 10px;
    margin-right: 20px;

    &:hover {
        background-color: #e03570;
    }

    @media (max-width: 480px) {
        padding: 6px 12px;
        font-size: 12px;
    }

    svg {
        width: 16px;
        height: 16px;

        @media (max-width: 480px) {
            width: 12px;
            height: 12px;
        }
    }
`;

const Profile = styled.div`
    img {
        border-radius: 50%;
        height: 40px;
        width: 40px;

        @media (max-width: 480px) {
            height: 30px;
            width: 30px;
        }
    }
`;

const Main = styled.main`
    display: grid;
    grid-template-columns: 2fr 1fr;
    grid-template-rows: 1fr;
    grid-template-areas: "bar charts";
    gap: 20px;
    padding: 20px 40px;
    flex-grow: 1; /* Allows Main to take available space */

    /* Adjust media queries accordingly */
    @media (max-width: 1024px) {
        grid-template-columns: 1.5fr 1fr;
    }

    @media (max-width: 768px) {
        grid-template-columns: 1fr;
        grid-template-rows: auto auto;
        grid-template-areas:
            "bar"
            "charts";
        gap: 15px;
        padding: 15px 20px;
    }

    @media (max-width: 480px) {
        gap: 10px;
        padding: 10px 15px;
    }
`;


const BarChartAndMetrics = styled.div`
    grid-area: bar;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    padding: 20px;

    @media (max-width: 768px) {
        padding: 10px;
    }
`;

const BarChartContainer = styled.div`
    width: 100%;
    height: 70%;

    @media (max-width: 1024px) {
        max-width: 600px; /* Restrict width starting at 1024px */
        margin: 0 auto; /* Center the bar chart */
    }

    @media (max-width: 768px) {
       min-width: 600px; /* Further reduce width for smaller devices */
    }

    @media (max-width: 480px) {
        max-width: 300px; /* Reduce width for extra small screens */
    }
`;

const Metrics = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 15px;
    margin-top: 20px;

    @media (max-width: 768px) {
        margin-top: 10px;
        gap: 10px;
    }
`;

const CircularCharts = styled.div`
    grid-area: charts;
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100%;
    gap: 20px;
    justify-content: center;

    @media (max-width: 768px) {
        flex-direction: row;
        justify-content: space-around;
        gap: 15px;
    }

    @media (max-width: 480px) {
        flex-direction: column;
        gap: 10px;
    }
`;
