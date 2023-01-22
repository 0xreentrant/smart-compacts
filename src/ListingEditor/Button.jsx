import React from 'react'
import { useNavigate } from 'react-router-dom'

export const Button = ({to='', children, className='', disabled, onClick, ...props}) => {
  const navigate = useNavigate()
  const withDisabledBg = disabled ? 'bg-gray-400' : ''
  const clickHandler = e => {
    e.preventDefault()

    if (disabled) {
      return 
    }

    if (to) {
      console.log('about to navigate to ', to)
      navigate(to)
      return;
    }

    onClick && onClick(e)
  }

  console.log(to)

  return (
    <a href={to} onClick={clickHandler} className={`btn ${className} ${withDisabledBg}`} {...props}>
      {children}
    </a>
  )
}


