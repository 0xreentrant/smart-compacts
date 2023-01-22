import { useNavigate } from 'react-router-dom'

type Props = {
  to?: string,
  className?: string,
  disabled?: boolean,
  onClick?: Function,
  children?: React.ReactNode
}

export const Button= ({to='', children, className='', disabled, onClick, ...props}: Props) => {
  const navigate = useNavigate()
  const withDisabledBg = disabled ? 'bg-gray-400' : ''
  const clickHandler = (e: React.SyntheticEvent) => {
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

