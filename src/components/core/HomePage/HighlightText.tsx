import React from 'react';

interface HighlightTextProps {
  text: string;
}

const HighlightText: React.FC<HighlightTextProps> = ({ text }) => {
  return (
    <>
        {" "}
        <span className='font-bold bg-gradient-to-b from-[#1FA2FF] via-[#12D8FA] to-[#A6FFCB] bg-clip-text text-transparent'>
        {text}
        </span>
    </>
  );
};

export default HighlightText;
