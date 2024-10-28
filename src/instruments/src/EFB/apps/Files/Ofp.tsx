import React, { FC, useCallback, useContext, useRef } from "react";
import ScrollContainer from "react-indiana-drag-scroll";
import styled from "styled-components";
import { FilesContext } from "./FilesContext";

export const Ofp: FC<{ html: string }> = ({ html }) => {
    const scrollerRef = useRef<ScrollContainer>(null);
    const { ofpScroll, setOfpScroll } = useContext(FilesContext);

    const scrollToLastHeight = useCallback((node: HTMLDivElement) => {
        node && node.scrollTo(0, ofpScroll);
    }, []);

    const saveScrollHeight = () => {
        scrollerRef.current && setOfpScroll(scrollerRef.current.getElement().scrollTop);
    };

    return (
        <OfpScroller hideScrollbars={false} innerRef={scrollToLastHeight} onEndScroll={saveScrollHeight} ref={scrollerRef}>
            <StyledOfp dangerouslySetInnerHTML={{ __html: html }} />
        </OfpScroller>
    );
}

const OfpScroller = styled(ScrollContainer)`
    width: 100%;
    height: 100%;

    ::-webkit-scrollbar {
        background: transparent;
        width: 20px;
    }
    ::-webkit-scrollbar-thumb {
        background: gray;
        border-radius: 8px;
    }
`;

const StyledOfp = styled.div`
    width: 100%;
    height: 100%;
    background: transparent;
    color: ${(props) => props.theme.text};
    padding: 50px 60px 10px 60px;
    font-size: 24px;
    line-height: 24px;

    * {
        font-family: "Inconsolata";
    }
`;
