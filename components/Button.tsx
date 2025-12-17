import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  ...props 
}) => {
  const baseStyle = "px-6 py-3 rounded-xl font-bold text-lg transition-all transform active:scale-95 shadow-lg uppercase tracking-wider";
  
  const variants = {
    primary: "bg-green-600 hover:bg-green-500 text-white border-b-4 border-green-800",
    secondary: "bg-blue-600 hover:bg-blue-500 text-white border-b-4 border-blue-800",
    danger: "bg-red-600 hover:bg-red-500 text-white border-b-4 border-red-800",
    success: "bg-emerald-500 hover:bg-emerald-400 text-white border-b-4 border-emerald-700"
  };

  return (
    <button 
      className={`${baseStyle} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
