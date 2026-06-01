import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { RootState } from "store";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    Button,
    Input,
} from "components";
import { Select } from "components/Select";
import { ISelectOption } from "components/Select/Select";
import { DeployLiteModeWidget } from "components/DeployLiteModeWidget";
import { DeployProModeWidget } from "components/DeployProModeWidget";
import useScreen from "hooks/useScreen";

const DeployContainer = styled.div``;

const DeployHeader = styled.div`
    display: flex;
    align-items: end;
    width: 100%;
    gap: 31px;
    margin-bottom: 36px;

    @media (max-width: 768px) {
        display: block;
    }
`;

const FormGroup = styled.div`
    @media (max-width: 768px) {
        width: 100%;
    }
`;

const FormRow = styled.div`
    display: flex;
    gap: 16px;
    align-items: end;

    @media (max-width: 768px) {
        flex-direction: column;
        align-items: start;
        margin-bottom: 16px;
    }
`;

const Label = styled.label`
    // font-size: 14px;
    font-weight: 500;
    color: ${({ theme }) => theme.text.primary};
`;

enum DeployPageMods {
    LITE = "lite",
    PRO = "pro",
}

const deployPageModsOptions: ISelectOption[] = [
    {
        id: DeployPageMods.LITE,
        value: DeployPageMods.LITE,
        label: "Lite Mode",
    },
    {
        id: DeployPageMods.PRO,
        value: DeployPageMods.PRO,
        label: "Pro Mode",
    },
];

type DeployModeWidget = React.FC<{
    phloLimit: string;
    phloPrice: string;
    children: React.ReactNode;
}> & {
    Actions: React.FC;
    Board: React.FC;
};

const deployWidgetsByMode: Record<DeployPageMods, DeployModeWidget> = {
    [DeployPageMods.LITE]: DeployLiteModeWidget,
    [DeployPageMods.PRO]: DeployProModeWidget,
};

export const Deploy: React.FC = () => {
    const navigate = useNavigate();
    const { selectedAccount } = useSelector((state: RootState) => state.wallet);
    const { isLaptop } = useScreen();

    console.log("IS LAPTOP: ", isLaptop);

    const [selectedMode, setSelectedMode] = useState<DeployPageMods>(
        DeployPageMods.LITE,
    );
    const [phloLimit, setPhloLimit] = useState("100000000");
    const [phloPrice, setPhloPrice] = useState("1");

    const ModeWidget = deployWidgetsByMode[selectedMode];

    if (!selectedAccount) {
        return (
            <DeployContainer>
                <Card>
                    <CardContent>
                        <p>Please select an account first.</p>
                        <Button onClick={() => navigate("/accounts")}>
                            Select Account
                        </Button>
                    </CardContent>
                </Card>
            </DeployContainer>
        );
    }

    return (
        <DeployContainer className="deploy-container">
            <ModeWidget phloLimit={phloLimit} phloPrice={phloPrice}>
                <Card>
                    <CardHeader>
                        <CardTitle>
                            <h1>Deploy Rholang Contract</h1>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <DeployHeader>
                            <FormRow>
                                <FormGroup>
                                    <Label>
                                        <h4 style={{ marginBottom: 8 }}>
                                            Mode
                                        </h4>
                                    </Label>
                                    <Select
                                        value={selectedMode}
                                        onChange={(mode) =>
                                            setSelectedMode(
                                                mode as DeployPageMods,
                                            )
                                        }
                                        placeholder="Select mode"
                                        options={deployPageModsOptions}
                                    />
                                </FormGroup>
                                <Input
                                    id="deploy-phlo-limit-input"
                                    className="deploy-phlo-limit-input text-3"
                                    wrapperStyle={{ marginBottom: 0 }}
                                    labelStyle={{ color: "#0D1012" }}
                                    label="Phlo Limit"
                                    value={phloLimit}
                                    fullWidth={isLaptop}
                                    onChange={(e) =>
                                        setPhloLimit(e.target.value)
                                    }
                                    type="number"
                                />
                                <Input
                                    id="deploy-phlo-price-input"
                                    className="deploy-phlo-price-input text-3"
                                    wrapperStyle={{ marginBottom: 0 }}
                                    labelStyle={{ color: "#0D1012" }}
                                    label="Phlo Price"
                                    value={phloPrice}
                                    fullWidth={isLaptop}
                                    onChange={(e) =>
                                        setPhloPrice(e.target.value)
                                    }
                                    type="number"
                                />
                            </FormRow>
                            <ModeWidget.Actions />
                        </DeployHeader>
                        <ModeWidget.Board />
                    </CardContent>
                </Card>
            </ModeWidget>
        </DeployContainer>
    );
};
