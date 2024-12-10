import React from "react";
import styled from "styled-components";

const MeasureBar = ({ label, value, maxValue, color }) => {
    const percentage = (value / maxValue) * 100;

    return (
        <Container>
            <Label>
                {label} <span>{value}</span>
            </Label>
            <BarContainer>
                <Bar percentage={percentage} color={color} />
            </BarContainer>
        </Container>
    );
};

export default MeasureBar;

const Container = styled.div`
    margin-bottom: 20px;
`;

const Label = styled.div`
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    margin-bottom: 5px;
`;

const BarContainer = styled.div`
    background-color: #e0e0e0;
    border-radius: 10px;
`;

const Bar = styled.div`
    height: 12px;
    width: ${({ percentage }) => percentage}%;
    background-color: ${({ color }) => color};
    transition: width 0.5s;

    @media (max-width: 480px) {
        height: 8px;
    }
`;
