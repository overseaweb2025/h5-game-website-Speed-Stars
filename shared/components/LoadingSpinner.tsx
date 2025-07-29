"use client"

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large'
  text?: string
  fullScreen?: boolean
}

const LoadingSpinner = ({ 
  size = 'medium', 
  text = 'Loading...', 
  fullScreen = false 
}: LoadingSpinnerProps) => {
  const sizeClasses = {
    small: 'h-8 w-8',
    medium: 'h-32 w-32',
    large: 'h-48 w-48'
  }

  const containerClasses = fullScreen 
    ? 'min-h-screen flex items-center justify-center'
    : 'flex items-center justify-center p-8'

  return (
    <div className={containerClasses}>
      <div className="text-center">
        <div className={`animate-spin rounded-full border-b-2 border-primary mx-auto mb-4 ${sizeClasses[size]}`}></div>
        <p className="text-text/80">{text}</p>
      </div>
    </div>
  )
}

export default LoadingSpinner