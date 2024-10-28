import React, { FC, useContext } from "react";

import { ContentPageContainer } from "./components/ContentPageContainer";
import { ItemGroup } from "../../components/ItemGroup";
import { NavigationItem } from "./components/NavigationItem";
import { ListItem } from "../../components/ListItem";
import { Input } from "../../components/Input";
import { useSetting } from "../../hooks/useSettings";
import { SimbriefClient } from "@microsoft/msfs-sdk";
import { ModalContext } from "../..";
import { InfoModal } from "../../components/InfoModal";

export const Accounts: FC = () => {
    const [simbriefUsername, setSimbriefUsername] = useSetting("boeingMsfsSimbriefUsername");
    const [, setSimbriefId] = useSetting("boeingMsfsSimbriefUserID");
    const { setModal } = useContext(ModalContext);

    const handleSimbriefInput = async (input: string) => {
        try {
            const userId = await SimbriefClient.getSimbriefUserIDFromUsername(input);
            setSimbriefUsername(input);
            setSimbriefId(userId);
        } catch (_) {
            setModal(<InfoModal title="Error" description={`Invalid SimBrief username "${input}"`} />);
        }
    };

    return (
        <ContentPageContainer title="Accounts">
            <ItemGroup>
                <ListItem>
                    <div className="side">SimBrief Username</div>
                    <Input
                        placeholder={simbriefUsername ? simbriefUsername.toString().toLowerCase() : "..."}
                        centerPlaceholder={false}
                        placeholderAlign="right"
                        style={{ borderBottom: "none", textAlign: "right", margin: "0 15px", fontSize: "26px" }}
                        onFocusOut={handleSimbriefInput}
                        clearOnFocusOut
                    />
                </ListItem>
                <NavigationItem name="Navigraph" path="/fzpro" />
            </ItemGroup>
        </ContentPageContainer>
    );
};
