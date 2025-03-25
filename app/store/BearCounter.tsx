import React from 'react'
import bearStore from './bearStore'

const BearCounter = () => {
    const bear = bearStore((state) =>state.bears)
  return (
    <div>
        <h1>{bear}</h1>
    </div>
  )
}

export default BearCounter