import React from 'react'
import bearStore from './bearStore'

const Controls = () => {

    const artırmaa = bearStore((state) => state.artırma )
    const sıfırlama = bearStore((state) => state.resetle)
  return (
    <div>

        <button onClick={artırmaa}> artır </button>
        <button onClick={sıfırlama}>reset</button>


    </div>
  )
}

export default Controls