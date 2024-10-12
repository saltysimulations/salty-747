import React, { FC } from "react";
import styled, { useTheme } from "styled-components";
import { BsFileEarmark, BsFiletypeJpg, BsFiletypePdf, BsFiletypePng } from "react-icons/bs";
import { IoIosRefresh } from "react-icons/io";
import { AiOutlineCloudDownload } from "react-icons/ai";
import ScrollContainer from "react-indiana-drag-scroll";
import { Files } from ".";

type SidebarProps = {
    simbridgeAvailable: boolean
    files?: Files;
    selected?: string;
    onSelect: (name: string) => void;
    ofpSelected: boolean;
    onSelectOfp: () => void;
    onRefresh: () => void;
};

export const Sidebar: FC<SidebarProps> = ({ simbridgeAvailable, files, selected, onSelect, ofpSelected, onSelectOfp, onRefresh }) => {
    const theme = useTheme();

    const getFileTypeIcon = (name: string, props: { fill: string; size: number }) => {
        if (name.endsWith(".pdf")) {
            return <BsFiletypePdf {...props} />;
        } else if (name.endsWith(".png")) {
            return <BsFiletypePng {...props} />;
        } else if (name.endsWith(".jpg") || name.endsWith(".jpeg")) {
            return <BsFiletypeJpg {...props} />;
        }
        return <BsFileEarmark {...props} />;
    };

    return (
        <StyledSidebar>
            <Title>Files</Title>
            <Category>
                <div>SimBrief</div>
                <AiOutlineCloudDownload size={33} fill={theme.select} onClick={onSelectOfp} />
            </Category>
            <Entry selected={ofpSelected} onClick={onSelectOfp}>
                <BsFileEarmark fill={ofpSelected ? "white" : theme.select} size={32} />
                <div>OFP</div>
            </Entry>
            {simbridgeAvailable ? (
                <ScrollContainer style={{ width: "100%" }}>
                    {files?.pdfs.length !== 0 && (
                        <>
                            <Category>
                                <div>Local Documents</div>
                                <IoIosRefresh size={32} fill={theme.select} onClick={onRefresh} />
                            </Category>
                            {files?.pdfs?.map((file, i) => (
                                <Entry selected={selected === file} key={i} onClick={() => onSelect(file)}>
                                    {getFileTypeIcon(file, { fill: selected === file ? "white" : theme.select, size: 32 })}
                                    <div>{file}</div>
                                </Entry>
                            ))}
                        </>
                    )}
                    {files?.images.length !== 0 && (
                        <>
                            <Category>
                                <div>Local Images</div>
                                <IoIosRefresh size={32} fill={theme.select} onClick={onRefresh} />
                            </Category>
                            {files?.images.map((image, i) => (
                                <Entry selected={selected === image} key={i} onClick={() => onSelect(image)}>
                                    {getFileTypeIcon(image, { fill: selected === image ? "white" : theme.select, size: 32 })}
                                    <div>{image}</div>
                                </Entry>
                            ))}
                        </>
                    )}
                </ScrollContainer>
            ) : (
                <SimbridgeUnavailable>
                    <div>SimBridge not connected</div>
                    <IoIosRefresh size={32} fill="lightgray" onClick={onRefresh} />
                </SimbridgeUnavailable>
            )}
        </StyledSidebar>
    );
};

const SimbridgeUnavailable = styled.div`
    width: 100%;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: lightgray;

    * {
        margin: 5px;
    }
`;

const Entry = styled.div<{ selected: boolean }>`
    display: flex;
    align-items: center;
    padding: 12px 8px;
    width: 100%;
    flex-wrap: nowrap;
    overflow: hidden;
    background: ${(props) => (props.selected ? props.theme.select : "transparent")};
    color: ${(props) => (props.selected ? "white" : props.theme.text)};
    border-radius: 15px;

    * {
        margin: 0 4px;
        flex-shrink: 0;
    }
`;

const Category = styled.div`
    font-size: 26px;
    font-weight: 700;
    padding: 14px 10px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const StyledSidebar = styled.div`
    height: 100%;
    width: 400px;
    display: flex;
    flex-direction: column;
    background: ${(props) => props.theme.primary};
    padding: 25px 17px;
    color: ${(props) => props.theme.text};
    font-size: 24px;
    border-right: 1px solid ${(props) => props.theme.border};
    flex-shrink: 0;
`;

const Title = styled.div`
    font-size: 50px;
    font-weight: 700;
    padding: 50px 0 15px 8px;
`;
