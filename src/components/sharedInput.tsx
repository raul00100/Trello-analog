import React, { useRef, useEffect } from "react";

type InputProp = {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: (value: string) => void;
  className: string;
};

export default function SharedInput({
  value,
  onChange,
  onSubmit,
  className = "",
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
      onFocus={(e) => e.target.select()}
      onBlur={handleSubmit}
      className={`text-base font-medium font-sans focus:outline-none px-2 ${className}`}
    />
  );
}
