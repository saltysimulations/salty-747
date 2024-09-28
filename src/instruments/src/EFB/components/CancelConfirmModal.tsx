import React, { FC, useContext } from "react";
import styled from "styled-components";
import { ModalContext } from "../apps/FZPro";
import { Modal } from "./Modal";

type CancelConfirmModalProps = {
    title: string;
    description: string;
    confirmText: string;
    onConfirm: () => void;
}

export const CancelConfirmModal: FC<CancelConfirmModalProps> = ({ title, description, confirmText, onConfirm }) => {
    const { setModal } = useContext(ModalContext);

    const handleConfirm = () => {
        setModal(null);
        onConfirm();
    };

    return (
        <Modal>
            <Container>
                <TextSection>
                    <Title>{title}</Title>
                    <Description>{description}</Description>
                </TextSection>
                <ButtonSection>
                    <Button onClick={() => setModal(null)}>
                        <div>Cancel</div>
                    </Button>
                    <Button onClick={handleConfirm}>
                        <Confirm>{confirmText}</Confirm>
                    </Button>
                </ButtonSection>
            </Container>
        </Modal>
    );
}

const Confirm = styled.div`
    font-weight: 700;
`;

const Button = styled.div`
    padding: 20px 0;
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #4fa0fc;
    font-size: 28px;

    &:first-child {
        border-right: 1px solid lightgray;
    }
`;

const ButtonSection = styled.div`
    display: flex;
    border-top: 1px solid lightgray;
`;

const Title = styled.div`
    font-weight: 500;
    font-size: 28px;
    margin-bottom: 5px;
`;

const Description = styled.div`
    font-size: 22px;
    text-align: center;
`;

const TextSection = styled.div`
    padding: 25px;
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: 450px;
`;

const Container = styled.div`
    display: flex;
    flex-direction: column;
`;
