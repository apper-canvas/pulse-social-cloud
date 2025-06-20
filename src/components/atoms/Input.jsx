import { forwardRef } from 'react';
import ApperIcon from '@/components/ApperIcon';

const Input = forwardRef(({ 
  label, 
  error, 
  icon, 
  iconPosition = 'left',
  type = 'text',
  className = '',
  containerClassName = '',
  ...props 
}, ref) => {
  const inputClasses = `
    w-full px-4 py-3 bg-surface border border-gray-600 rounded-lg text-white placeholder-gray-400
    focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50
    ${error ? 'border-error focus:ring-error/50 focus:border-error' : ''}
    ${icon ? (iconPosition === 'left' ? 'pl-11' : 'pr-11') : ''}
    ${className}
  `;

  return (
    <div className={`relative ${containerClassName}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className={`absolute inset-y-0 ${iconPosition === 'left' ? 'left-0 pl-3' : 'right-0 pr-3'} flex items-center pointer-events-none`}>
            <ApperIcon name={icon} className="w-5 h-5 text-gray-400" />
          </div>
        )}
        <input
          ref={ref}
          type={type}
          className={inputClasses}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-error">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;