import styled from "styled-components";

export const ListItemTitle = styled.div`
    font-weight: 500;
    color: ${(props) => props.theme.text};
`;

export const ListItemLabel = styled.div`
    font-weight: 300;
    color: gray;
`;

export const ListItemDescription = styled.div`
    display: flex;
    flex-direction: column;
    margin: 24px;
    width: 70%;
    font-size: 24px;

    * {
        margin: 3px 0;
    }
`;
