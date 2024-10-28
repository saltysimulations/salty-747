import React, { FC, ReactNode, useState } from "react";
import { View, Files } from ".";

type FilesContextProps = {
    view?: View;
    setView: (view?: View) => void;
    files?: Files;
    setFiles: (files?: Files) => void;
    ofp?: string;
    setOfp: (ofp?: string) => void;
    ofpSelected: boolean;
    setOfpSelected: (selected: boolean) => void;
    ofpScroll: number;
    setOfpScroll: (scroll: number) => void;
};

export const FilesContext = React.createContext<FilesContextProps>({
    view: undefined,
    setView: () => {},
    files: undefined,
    setFiles: () => {},
    ofp: undefined,
    setOfp: () => {},
    ofpSelected: false,
    setOfpSelected: () => {},
    ofpScroll: 0,
    setOfpScroll: () => {},
});

export const FilesContextProvider: FC<{ children: ReactNode | ReactNode[] }> = ({ children }) => {
    const [files, setFiles] = useState<Files>();
    const [view, setView] = useState<View>();
    const [ofp, setOfp] = useState<string>();
    const [ofpSelected, setOfpSelected] = useState<boolean>(false);
    const [ofpScroll, setOfpScroll] = useState<number>(0);

    return (
        <FilesContext.Provider value={{ files, setFiles, view, setView, ofp, setOfp, ofpSelected, setOfpSelected, ofpScroll, setOfpScroll }}>
            {children}
        </FilesContext.Provider>
    );
};
