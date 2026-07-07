import React, {
    useRef,
    useEffect,
    useState,
    CSSProperties,
    RefObject,
} from "react";
import styled from "styled-components";
import { DefaultTheme } from "styled-components/dist/types";
import { VisibilityIcon, VisibilityOffIcon } from "components/Icons";
import {
    InputWrapper,
    Label,
    StyledInput,
    ErrorMessage,
    InputContainer,
    ActionButtonWrapper,
} from "components/Input/Input";

export interface PasswordInputProps extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "type"
> {
    label?: string;
    error?: string;
    fullWidth?: boolean;
    wrapperStyle?: CSSProperties;
    labelStyle?: CSSProperties;
    labelColorSelector?: (theme: DefaultTheme) => string;
    "data-testid"?: string;
    "data-cy"?: string;
    inputRef?: RefObject<HTMLInputElement>;
    withoutHoverUI?: boolean;
}

const ToggleButton = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    background: none;
    border: none;
    outline: none;
    border-radius: 4px;
    cursor: pointer;
    color: ${({ theme }) => theme.text.primary};
    transition: opacity 0.2s ease;

    &:hover {
        opacity: 0.7;
    }

    &:focus-visible {
        outline: 2px solid ${({ theme }) => theme.primary};
        outline-offset: 2px;
    }
`;

export const PasswordInput: React.FC<PasswordInputProps> = ({
    label,
    error,
    fullWidth = true,
    "data-testid": dataTestId,
    "data-cy": dataCy,
    onChange,
    onInput,
    autoFocus,
    wrapperStyle,
    labelStyle,
    labelColorSelector,
    inputRef,
    withoutHoverUI = false,
    value,
    ...props
}) => {
    const defaultRef = useRef<HTMLInputElement>(null);
    const currentRef = inputRef || defaultRef;
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (autoFocus && currentRef.current) {
            const timer = setTimeout(() => {
                currentRef.current?.focus();
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [autoFocus, currentRef]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (onChange) {
            onChange(e);
        }
    };

    const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
        if (onInput) {
            onInput(e);
        }

        if (onChange) {
            const changeEvent = {
                ...e,
                target: e.currentTarget,
                currentTarget: e.currentTarget,
            } as React.ChangeEvent<HTMLInputElement>;

            onChange(changeEvent);
        }
    };

    const toggleVisibility = () => setIsVisible((prev) => !prev);

    return (
        <InputWrapper $fullWidth={fullWidth} style={wrapperStyle}>
            <h4>
                {label && (
                    <Label
                        $themeColorSelector={labelColorSelector}
                        style={labelStyle}
                    >
                        {label}
                    </Label>
                )}
            </h4>
            <InputContainer>
                <StyledInput
                    ref={currentRef}
                    type={isVisible ? "text" : "password"}
                    $hasError={!!error}
                    data-testid={dataTestId}
                    data-cy={dataCy}
                    onChange={handleChange}
                    onInput={handleInput}
                    value={value}
                    $copyable
                    $withoutHoverUI={withoutHoverUI}
                    {...props}
                />
                <ActionButtonWrapper>
                    <ToggleButton
                        type="button"
                        onClick={toggleVisibility}
                        title={isVisible ? "Hide password" : "Show password"}
                        aria-label={
                            isVisible ? "Hide password" : "Show password"
                        }
                    >
                        {isVisible ? (
                            <VisibilityOffIcon size={16} />
                        ) : (
                            <VisibilityIcon size={16} />
                        )}
                    </ToggleButton>
                </ActionButtonWrapper>
            </InputContainer>
            {error && <ErrorMessage>{error}</ErrorMessage>}
        </InputWrapper>
    );
};

export default PasswordInput;
