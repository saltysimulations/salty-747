import { motion } from "framer-motion";
import React, { FC, ReactNode } from "react";
import styled from "styled-components";

export const AnimatedLoad: FC<{ children: ReactNode | ReactNode[] }> = ({ children }) => (
    <AnimatedLoadContainer
        initial={{ transform: "scale(0)" }}
        animate={{ transform: "scale(1)" }}
        exit={{ transform: "scale(0)" }}
        transition={{ duration: 0.25 }}
    >
        {children}
    </AnimatedLoadContainer>
);

const AnimatedLoadContainer = styled(motion.div)`
    height: 100%;
    width: 100%;
`;
