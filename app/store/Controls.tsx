
import React from 'react'
import bearStore from './bearStore'

const Controls = () => {

    const güncelle = bearStore((state)=> state.guncelleme)
    const resetleme = bearStore((state) => state.resetleme)
  return (
    <div>
        <button onClick={güncelle} >artır</button>
        <button onClick={resetleme}>sıfırla</button>
    </div>
  )
}

export default Controls