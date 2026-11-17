import { useRef, useEffect } from "react";
import { Input } from "./ui/input";

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
    <Input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      ref={inputRef}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          if (value.trim() === "") return;
          e.preventDefault();
          handleSubmit();
        }
      }}
      onBlur={handleSubmit}
      className={`h-auto w-auto rounded-none border-0 bg-transparent px-2 py-0 text-base font-medium font-sans shadow-none focus:outline-none focus-visible:ring-0 ${className}`}
      onFocus={handleFocus}
      placeholder={placeholder}
    />
  );
}
