import React from 'react';
import CTAButton from "../HomePage/CTAButton";
import HighlightText from './HighlightText';
import { FaArrowRight } from "react-icons/fa";
import { TypeAnimation } from 'react-type-animation';
import aa from "./aa.svg"

type CodeBlockProps = {
  position: string;
  heading: React.ReactNode;
  subheading: string;
  ctabtn1: {
    active: boolean;
    linkto: string;
    btnText: string;
  };
  ctabtn2: {
    active: boolean;
    linkto: string;
    btnText: string;
  };
  codeblock: string;
  backgroudGradient: string;
  codeColor: string;
  myBlob: string;
};

const CodeBlocks: React.FC<CodeBlockProps> = ({
  position,
  heading,
  subheading,
  ctabtn1,
  ctabtn2,
  codeblock,
  backgroudGradient,
  codeColor,
  myBlob
}) => {
  return (
    <div className={`flex ${position} my-20 justify-between gap-10`}>
      
    {/*Section 1*/}
    <div className='w-[50%] flex flex-col gap-8'>
        {heading}
        <div className='text-richblack-300 font-bold '>
            {subheading}
        </div>

        <div className='flex gap-7 mt-7'>
            <CTAButton active={ctabtn1.active} linkto={ctabtn1.linkto}>
                <div className='flex gap-2 items-center'>
                    {ctabtn1.btnText}
                    <FaArrowRight/>
                </div>
            </CTAButton>

            <CTAButton active={ctabtn2.active} linkto={ctabtn2.linkto}>  
                    {ctabtn2.btnText}
            </CTAButton>
        </div>


    </div>

     {/*Section 2*/}

        <div className='relative h-fit flex flex-row text-10[px] w-[100%] py-4 lg:w-[500px] bg-white bg-opacity-5  rounded-md  border-[#5f5f5f] border-opacity-50 border-[1px]'> 
            <img src={myBlob} className='absolute top-[-80px] left-[-100px]'/>
            <div className='text-center flex flex-col w-[10%] text-richblack-400 font-inter font-bold'>
                <p>1</p>
                <p>2</p>
                <p>3</p>
                <p>4</p>
                <p>5</p>
                <p>6</p>
                <p>7</p>
                <p>8</p>
                <p>9</p>
                <p>10</p>
                <p>11</p>
            </div>

            <div className={`w-[90%] flex flex-col gap-2 font-bold font-mono ${codeColor} pr-2`}>
              <TypeAnimation
                sequence={[codeblock, 2000, ""]}
                repeat={Infinity}
                cursor={true}
              
                style = {
                    {
                        whiteSpace: "pre-line",
                        display:"block",
                    }
                }
                omitDeletionAnimation={true}      
              />
            </div>

        </div>




    </div>
  )
}

export default CodeBlocks