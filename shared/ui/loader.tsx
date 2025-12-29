import * as React from 'react'
import { cn } from '@/lib/utils'

export interface LoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg'
}

const Loader = React.forwardRef<HTMLDivElement, LoaderProps>(
  ({ className, size = 'md', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'animate-spin rounded-full border-2 border-gray-300 border-t-blue-600',
          {
            'h-4 w-4': size === 'sm',
            'h-6 w-6': size === 'md',
            'h-8 w-8': size === 'lg',
          },
          className
        )}
        {...props}
      />
    )
  }
)
Loader.displayName = 'Loader'

export { Loader }
