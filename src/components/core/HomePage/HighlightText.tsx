import React from 'react';

interface HighlightTextProps {
  text: string;
}

const HighlightText: React.FC<HighlightTextProps> = ({ text }) => {
  return (
    <>
        {" "}
        <span className='font-bold bg-gradient-to-r from-blue-300 to-blue-100 bg-clip-text text-transparent'>
        {text}
        </span>
    </>
  );
};

export default HighlightText;
