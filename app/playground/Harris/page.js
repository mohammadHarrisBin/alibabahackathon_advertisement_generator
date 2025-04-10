"use client";
import React from 'react'
import { connectionToMuhammadAli } from './actions';

const handleAnalysis = async() => {
    const sickness = ["high blood pressure", 'gout'];
    const analysis = await connectionToMuhammadAli(sickness);
}


function page() {


  return (

        // step 1 : analyse video

    

    <div>
        <button className='bg-red-300 p-10 hover:cursor-pointer' onClick={handleAnalysis}>Test</button>
    </div>



  )
}

export default page