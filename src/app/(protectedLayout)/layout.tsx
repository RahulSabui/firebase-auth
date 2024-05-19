import React from 'react'
import AuthContext from '../AuthContext'

const page = ({children}) => {
  return (
    <AuthContext>
        {children}

        </AuthContext>
      

  )
}

export default page
