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
      navigate(to)
      return;
    }

    onClick && onClick(e)
  }

  return (
    <a href={to} onClick={clickHandler} className={`btn ${className} ${withDisabledBg}`} {...props}>
      {children}
    </a>
  )
}


