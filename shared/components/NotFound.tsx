"use client"

interface NotFoundProps {
  title?: string
  message: string
  fullScreen?: boolean
}

const NotFound = ({ 
  title = 'Not Found', 
  message, 
  fullScreen = false 
}: NotFoundProps) => {
  const containerClasses = fullScreen 
    ? 'min-h-screen flex items-center justify-center'
    : 'flex items-center justify-center p-8'

  return (
    <div className={containerClasses}>
      <div className="text-center">
        <p className="text-text/80 text-xl mb-4">{title}</p>
        <p className="text-text/60">{message}</p>
      </div>
    </div>
  )
}

export default NotFound