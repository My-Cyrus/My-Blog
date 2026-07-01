import { motion, HTMLMotionProps } from 'motion/react';
import { cn } from '@/lib/utils';
import { forwardRef } from 'react';

interface GlassCardProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ children, className, hoverEffect = true, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        whileHover={hoverEffect ? { y: -5, scale: 1.01 } : {}}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className={cn(
          'relative overflow-hidden rounded-2xl',
          'bg-[#19191e]/40',
          'backdrop-blur-[30px] backdrop-saturate-[140%]',
          'border border-white/15',
          'shadow-[0_10px_40px_rgba(0,0,0,0.5)]',
          'text-white',
          className
        )}
        {...props}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent dark:from-white/5 opacity-50 pointer-events-none" />
        {children}
      </motion.div>
    );
  }
);
GlassCard.displayName = 'GlassCard';
