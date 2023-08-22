import { useEffect, useState } from "react";

import './styled.scss'

type IInputModalProps = {
  isOpen: boolean;
  label: string;
  buttonLabel?: string;
  error?: string | undefined | null;
  onSubmit: (inputValue: string) => void;
};

const InputModal = ({
  isOpen,
  label,
  buttonLabel = 'Save',
  error,
  onSubmit,
}: IInputModalProps) => {
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    setInputValue("")
  }, [isOpen])

  if (!isOpen) return <></>;

  return (
    <div className="inputModalContainer">
      <div className="inputModalMain">
        <div className="inputModalLabel">{label}</div>
        <div className="inputModalErrorLabel">{error}</div>
        <input
          className={`input ${error ? "error" : ""}`}
          autoFocus
          value={inputValue}
          onChange={(e) => setInputValue(e.currentTarget.value)}
          onKeyDown={e => {if (e.key == 'Enter') onSubmit(inputValue)}}
        />
        <button
          className="inputModalButton"
          onClick={() => {
            onSubmit(inputValue);
          }}
        >
          {buttonLabel}
        </button>
      </div>
    </div>
  );
};

export default InputModal;
