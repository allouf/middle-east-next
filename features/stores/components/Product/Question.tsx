'use client';

import React, { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaPlus } from "react-icons/fa6";

const Question = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [height, setHeight] = useState(0)
  const contentRef = useRef(null)
  const questionRef = useRef(null)

  // Update height whenever open state changes
  useEffect(() => {
    if (contentRef.current) {
      setHeight(isOpen ? contentRef.current.offsetHeight : 0)
    }
    // console.log(contentRef.current)
  }, [isOpen])

  useEffect(()=>{
    const handler = (e)=>{
       if (questionRef.current && !questionRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }

      document.addEventListener("mousedown", handler);
      return () => document.removeEventListener("mousedown", handler);
  },[])

  return (
    <div className='py-4 px-8 border border-[#D0D5DD] rounded-[10px]' ref={questionRef}>
      {/* Header */}
      <motion.div 
     
      initial={{ borderBottom: "1px solid #D0D5DD"}}
      animate={{ borderBottom: isOpen ?"1px solid #D0D5DD" : "0px solid #D0D5DD", 
        paddingBottom:isOpen?"12px":"0px"
      }}
      transition={{ duration: 0.1 }}
      className={`flex flex-row items-center justify-between  transition duration-300`}>
        <h1 className='text-subTitleColor font-semibold sm:text-[20px] text-[14px]'>
          Can I enroll in multiple courses at once?
        </h1>

        <button
          className='p-2 bg-blueIcons text-textWhiteColor rounded-md'
          onClick={() => setIsOpen(prev => !prev)}
        >
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: isOpen ? 45 : 0 }}
            transition={{ duration: 0.1 }}
          >
            <FaPlus className='text-textWhiteColor font-bold' size={20} />
          </motion.div>
        </button>
      </motion.div>

      {/* Animated content */}
      <motion.div
        className='overflow-hidden'
        initial={{height:0}}
        animate={{ height :height ,paddingTop:isOpen?"12px":"0px"}}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <div >
          <p className='text-subTitleColor py-3 sm:text-[16px] text-[10px]' ref={contentRef}>
            Absolutely! You can enroll in multiple courses simultaneously and
            access them at your convenience.
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export default Question
