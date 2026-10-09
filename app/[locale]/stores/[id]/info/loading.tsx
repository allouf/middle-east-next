import LoaderPage from '@/components/shared/LoaderPage'
import React from 'react'

export default function loading () {
  return (
     <div className=" mx-auto">
         <LoaderPage type="store" count={3}/>
      </div>
  )
}

