import React, { FC, useContext } from "react";
import styled from "styled-components";
import { ModalContext } from "..";
import { Button, ButtonSection, Description, InsideContainer, Modal, TextSection, Title } from "./Modal";

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
            <InsideContainer>
                <TextSection>
                    <Title>{title}</Title>
                    <Description>{description}</Description>
                </TextSection>
                <ButtonSection>
                    <Button className=".border" onClick={() => setModal(null)}>
                        <div>Cancel</div>
                    </Button>
                    <Button onClick={handleConfirm}>
                        <Confirm>{confirmText}</Confirm>
                    </Button>
                </ButtonSection>
            </InsideContainer>
        </Modal>
    );
};

const Confirm = styled.div`
    font-weight: 700;
`;

