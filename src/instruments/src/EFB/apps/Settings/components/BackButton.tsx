import React, { FC } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

export type BackButtonProps = { label: string; path: string };

export const BackButton: FC<BackButtonProps> = ({ label, path }) => {
    const navigate = useNavigate();

    return (
        <StyledBack onClick={() => navigate(path)}>
            <IoIosArrowBack size={48} />
            <div>{label}</div>
        </StyledBack>
    );
};

const StyledBack = styled.div`
    display: flex;
    align-items: center;
    color: #1476fb;
    position: relative;
    right: 50px;
`;
