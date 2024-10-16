import React, { FC, useContext } from "react";
import { ModalContext } from "..";
import { Button, ButtonSection, Description, InsideContainer, Modal, TextSection, Title } from "./Modal";

type InfoModalProps = {
    title: string;
    description: string;
};

export const InfoModal: FC<InfoModalProps> = ({ title, description }) => {
    const { setModal } = useContext(ModalContext);

    return (
        <Modal>
            <InsideContainer>
                <TextSection>
                    <Title>{title}</Title>
                    <Description>{description}</Description>
                </TextSection>
                <ButtonSection>
                    <Button onClick={() => setModal(null)}>
                        <div>Close</div>
                    </Button>
                </ButtonSection>
            </InsideContainer>
        </Modal>
    );
};
