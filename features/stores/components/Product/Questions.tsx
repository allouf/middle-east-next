'use client';

import React from 'react'
import { motion } from 'framer-motion'
import Question from './Question'

const Questions = () => {
  return (
    <motion.div 
      initial={{translateY:-15}}
      animate={{translateY:0}}
      transition={{duration:0.3}}
    className='w-full flex md:flex-row flex-col items-center gap-4 py-8'>
      <div className='xl:max-w-[500px] lg:max-w-[400px] md:max-w-[300px]'>
        <h1 className='sm:text-[34px] text-[18px] text-subTitleColor text-bold'>Frequently Asked Questions</h1>
        <p className='text-textColor sm:text-[18px] text-[14px]'>Still you have any questions? Contact our Team via support@skillbridge.com</p>
      </div>
      <div className='h-[300px] flex-1'>
       <div className='flex flex-col gap-3'>
        {[...Array(3)].map(()=><Question />)}
        </div>
      </div>
    </motion.div>
  )
}

export default Questions