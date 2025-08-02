"use client"

interface ErrorDisplayProps {
  title?: string
  message: string
  onRetry?: () => void
  fullScreen?: boolean
}

const ErrorDisplay = ({ 
  title = 'Error', 
  message, 
  onRetry, 
  fullScreen = false 
}: ErrorDisplayProps) => {
  const containerClasses = fullScreen 
    ? 'min-h-screen flex items-center justify-center'
    : 'flex items-center justify-center p-8'

  return (
    <div className={containerClasses}>
      <div className="text-center">
        <p className="text-red-400 text-xl mb-4">{title}</p>
        <p className="text-text/60 mb-4">{message}</p>
        {onRetry && (
          <button 
            onClick={onRetry}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
          >
            Retry
          </button>
        )}
      </div>
    </div>
  )
}

export default ErrorDisplay