import styled from "styled-components";
import React, { FC } from "react";
import { AiOutlineCloudDownload } from "react-icons/all";
import { FadeLoader } from "react-spinners";

export const DocumentLoading: FC = () => (
    <StyledDocumentLoading>
        <AiOutlineCloudDownload size={200} color="#A9B3BE" />
        <div>Loading Document...</div>
        <FadeLoader
            color="#636D76"
            radius={35}
            speedMultiplier={2}
            margin={3}
            height={20}
            cssOverride={{ margin: "15px" }}
        />
    </StyledDocumentLoading>
);

const StyledDocumentLoading = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 28px;
    color: #636D76;
    font-weight: 500;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    * {
        margin: 5px;
    }
`;
