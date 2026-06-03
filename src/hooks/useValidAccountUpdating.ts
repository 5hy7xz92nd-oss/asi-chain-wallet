import { useState } from "react";
import { useSelector } from "react-redux";
import { selectAccounts } from "store/walletSlice";
import { Account } from "types/wallet";

interface IUseValidAccountUpdatingResponse {
    isNameUpdateValid: boolean;
    updateAccountField: <TKey extends keyof Account>(
        key: TKey,
        value: Account[TKey],
    ) => void;
}

export const useValidAccountUpdating = (
    targetAccount: Account | undefined,
): IUseValidAccountUpdatingResponse => {
    const existingAccountNames: Account[] = useSelector(selectAccounts);

    const [currentAccountData, setCurrentAccountData] = useState<
        Partial<Account>
    >(targetAccount ?? {});

    const updateAccountField = <TKey extends keyof Account>(
        key: TKey,
        value: Account[TKey],
    ) => {
        setCurrentAccountData((previousValue) => ({
            ...previousValue,
            [key]: value,
        }));
    };

    const otherExistingAccounts: Account[] = existingAccountNames.filter(
        (account: Account) => account.id !== currentAccountData?.id,
    );

    return {
        isNameUpdateValid:
            !!currentAccountData?.name &&
            !otherExistingAccounts.some(
                (account: Account) => account.name === currentAccountData?.name,
            ),
        updateAccountField,
    };
};
