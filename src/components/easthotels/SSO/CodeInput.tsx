import React, { useState } from 'react';

const CodeInput = () => {
  const [code, setCode] = useState(['', '', '', '', '', '']);

  const handleKeyDown = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Backspace' && index > 0 && code[index] == '') {
      const prevElement = document.getElementById(`input-${index - 1}`);
      if (prevElement !== null) {
        prevElement.focus();
      }
    }
    if (event.key === 'Backspace' && code[index] != '') {
      const newCode = [...code];
      newCode[index] = '';
      setCode(newCode);
    }
    if (event.key === 'ArrowLeft' && index > 0) {
      const prevElement = document.getElementById(`input-${index - 1}`);
      if (prevElement !== null) {
        prevElement.focus();
      }
    }
    if (event.key === 'ArrowRight' && index < 5) {
      const nextElement = document.getElementById(`input-${index + 1}`);
      if (nextElement !== null) {
        nextElement.focus();
      }
    }
    // if (event.key.match(/\d/)) {
    //   const newCode = [...code];
    //   newCode[index] = event.key;
    //   setCode(newCode);
    //   const nextElement = document.getElementById(`input-${index + 1}`);
    //   if (nextElement !== null) {
    //     nextElement.focus();
    //   }
    // }
  };
  const handleInput = (index: number, event: React.FormEvent<HTMLInputElement>) => {
    if (event.currentTarget.value.match(/\d/)) {
      const newCode = [...code];
      newCode[index] = event.currentTarget.value;
      setCode(newCode);
      const nextElement = document.getElementById(`input-${index + 1}`);
      if (nextElement !== null) {
        nextElement.focus();
      }
    }
  };
  const handlePaste = (index: number, event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const pastedData = (event.clipboardData || window.clipboardData).getData('Text');
    const digits = pastedData.match(/\d/g) || [];

    let newCode = [...code];
    for (let i = index; i < index + digits.length && i < 6; i++) {
      newCode[i] = digits[i - index];
    }
    setCode(newCode);
  };

  return (
    <div id="InputCode" className="mx-auto flex justify-between space-x-2">
      {code.map((digit, index) => (
        <input
          key={index}
          type="text"
          className="h-[45px] w-[45px] bg-[#dcdcd8] text-center text-[20px] font-bold focus:outline-none"
          value={digit}
          //onChange={(e) => handleChange(index, e)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onInput={(e) => handleInput(index, e)}
          onPaste={(e) => handlePaste(index, e)}
          maxLength={1}
          id={`input-${index}`}
          autoFocus={index === 0}
        />
      ))}
    </div>
  );
};

export default CodeInput;
