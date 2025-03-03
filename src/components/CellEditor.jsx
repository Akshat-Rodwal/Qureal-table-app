import React, { useState, useEffect } from 'react';

const CellEditor = ({ value, onChange, onBlur, onKeyDown }) => {
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleChange = (e) => {
    setInputValue(e.target.value);
    onChange && onChange(e.target.value);
  };

  const handleBlur = () => {
    onBlur(inputValue); // When the input loses focus, apply the changes
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onBlur(inputValue); // Apply changes on Enter key press
    }
  };

  return (
    <input
      type="text"
      value={inputValue}
      onChange={handleChange}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      className="w-full bg-transparent border-none focus:outline-none"
    />
  );
};

export default CellEditor;
