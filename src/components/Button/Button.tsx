import { ButtonHTMLAttributes, forwardRef, ReactNode } from 'react';
import styles from './Button.module.css';

export enum ButtonVariants {
  default = 'default',
  primary = 'primary',
  primaryDeemphasized = 'primary_deemphasized',
  link = 'link',
  success = 'success'
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariants;
  children: ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = ButtonVariants.default, children, ...props }, ref) => {
    return (
      <button className={styles[variant]} {...props} ref={ref}>
        {children}
      </button>
    );
  }
);

export default Button;
