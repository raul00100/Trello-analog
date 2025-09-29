import { useRef, useEffect } from "react";

type InputProp = {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: (value: string) => void;
  className: string;
  onFocus?: () => void;
  placeholder?: string;
};

export default function SharedInput({
  value,
  onChange,
  onSubmit,
  className = "",
  onFocus,
  placeholder = "",
}: InputProp) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSubmit = () => {
    if (value.trim() === "") return;
    onSubmit?.(value);
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    if (onFocus) {
      onFocus();
      e.target.select();
    }
  };

  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      ref={inputRef}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          handleSubmit();
        }
      }}
      onBlur={handleSubmit}
      className={`text-base font-medium font-sans focus:outline-none px-2 ${className}`}
      onFocus={handleFocus}
      placeholder={placeholder}
    />
  );
}
