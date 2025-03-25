import React from 'react'
import C from './C'

const B = ({user} : {user:string}) => {
  return (
    <div><C user={user}/></div>
  )
}

export default B