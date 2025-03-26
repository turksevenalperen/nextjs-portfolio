import React from 'react'
import bearStore from './bearStore'

const BearCounter = () => {
let bear;
bear  =  bearStore((state) => state.bears )
bear = 6;


  return (
    <div>{bear}</div>
  )
}

export default BearCounter