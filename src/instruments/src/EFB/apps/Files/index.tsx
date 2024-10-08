import React, { FC, useContext, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { ModalContext } from "../..";
import { InfoModal } from "../../components/InfoModal";
import { SimBridge } from "../../lib/simbridge";
import { AirportChartViewer } from "../../components/charts/AirportChartViewer";
import { Sidebar } from "./Sidebar";
import { DocumentLoading } from "../../components/charts/DocumentLoading";
import ScrollContainer from "react-indiana-drag-scroll";
import { useSetting } from "../../hooks/useSettings";
import { FilesContext } from "./FilesContext";
import { SettingsContext } from "../Settings/SettingsContext";
import { useSimBridge } from "../../hooks/useSimBridge";

export type View = {
    name: string;
    blob: Blob;
    pages?: number;
    currentPage?: number;
};

export type Files = { pdfs: string[]; images: string[] };

export const Files: FC = () => {
    const [documentLoading, setDocumentLoading] = useState<boolean>(false);
    const [simbridgeConnection, setSimbridgeConnection] = useState<boolean>(false);

    const { setModal } = useContext(ModalContext);
    const { view, setView, files, setFiles, ofp, setOfp, ofpSelected, setOfpSelected } = useContext(FilesContext);
    const { simbridgePort } = useContext(SettingsContext);

    const simbridge = useSimBridge();

    const contentSectionRef = useRef<HTMLDivElement>(null);

    const [simbriefUsername] = useSetting("boeingMsfsSimbriefUsername");

    const getFiles = async () => setFiles({ pdfs: await simbridge.getPDFList(), images: await simbridge.getImageList() });

    const handleSelect = async (name: string) => {
        setOfpSelected(false);
        setView(undefined);
        setDocumentLoading(true);

        try {
            setView(
                files?.images.includes(name)
                    ? { name, blob: await simbridge.getImage(name) }
                    : { name, blob: await simbridge.getPDFPage(name, 1), pages: await simbridge.getPDFPageNum(name), currentPage: 1 }
            );
        } catch (e: unknown) {
            e instanceof Error && setModal(<InfoModal title="Error" description={e.message} />);
        }

        setDocumentLoading(false);
    };

    const handlePageChange = async (page: number) => {
        try {
            view && setView({ ...view, blob: await simbridge.getPDFPage(view.name, page), currentPage: page });
        } catch (e: unknown) {
            e instanceof Error && setModal(<InfoModal title="Error" description={e.message} />);
        }
    };

    const handleSelectOfp = async () => {
        setDocumentLoading(true);
        setView(undefined);

        if (!ofp) {
            try {
                const ofp = await fetch(`https://www.simbrief.com/api/xml.fetcher.php?username=${simbriefUsername}&json=1`);
                const json = await ofp.json();
                const html = json.text.plan_html;
                setOfp(html.replace(/^<div [^>]+>/, "").replace(/<\/div>$/, ""));
            } catch (_) {
                setModal(<InfoModal title="Error" description="Couldn't fetch OFP" />);
            }
        }

        setOfpSelected(true);
        setDocumentLoading(false);
    };

    const checkHealth = async () => {
        if (await simbridge.getHealth()) {
            setSimbridgeConnection(true);
            !files && getFiles();
        }
    };

    useEffect(() => {
        checkHealth();
    }, []);

    return (
        <Container>
            <Sidebar
                simbridgeAvailable={simbridgeConnection}
                files={files}
                selected={view?.name}
                onSelect={handleSelect}
                ofpSelected={ofpSelected}
                onSelectOfp={handleSelectOfp}
                onRefresh={() => simbridgeConnection ? getFiles() : checkHealth()}
            />
            <ContentSection ref={contentSectionRef}>
                {!view && !ofpSelected && !documentLoading && <SelectAFile>Select a file</SelectAFile>}
                {view && contentSectionRef.current && (
                    <AirportChartViewer
                        chartImage={view.blob}
                        canvasWidth={contentSectionRef.current.clientWidth}
                        canvasHeight={contentSectionRef.current.clientHeight}
                        currentPage={view.currentPage}
                        pages={view.pages}
                        setPage={handlePageChange}
                        theme="os"
                    />
                )}
                {documentLoading && <DocumentLoading />}
                {ofpSelected && ofp && (
                    <ScrollContainer style={{ width: "100%", height: "100%" }}>
                        <Ofp dangerouslySetInnerHTML={{ __html: ofp }} />
                    </ScrollContainer>
                )}
            </ContentSection>
        </Container>
    );
};

const Ofp = styled.div`
    width: 100%;
    height: 100%;
    color: black;
    padding: 50px 60px 10px 60px;
    font-size: 24px;
    line-height: 24px;

    * {
        font-family: "Inconsolata";
    }
`;

const SelectAFile = styled.div`
    flex: 1;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: lightgray;
    font-size: 28px;
`;

const Container = styled.div`
    width: 100vw;
    height: 100vh;
    display: flex;
    background: white;
`;

const ContentSection = styled.div`
    flex: 1;
    position: relative;
`;
