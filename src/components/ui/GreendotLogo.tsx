import React from 'react';

interface GreendotLogoProps {
  variant?: 'dark' | 'light';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  onClick?: () => void;
}

export const GreendotLogo: React.FC<GreendotLogoProps> = ({
  variant = 'dark',
  size = 'md',
  className = '',
  onClick,
}) => {
  const isLight = variant === 'light';

  const dotSizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-11 h-11',
    xl: 'w-14 h-14',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-4xl',
  };

  const bankSizes = {
    sm: 'text-[12px] -mt-1 ml-[52px]',
    md: 'text-[15px] -mt-1 ml-[68px]',
    lg: 'text-[19px] -mt-1.5 ml-[86px]',
    xl: 'text-[24px] -mt-2 ml-[108px]',
  };

  const regSizes = {
    sm: 'text-[8px]',
    md: 'text-[10px]',
    lg: 'text-[12px]',
    xl: 'text-[14px]',
  };

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-2.5 select-none cursor-pointer group ${className}`}
    >
      {/* 3D Sphere matching uploaded IMG_8856.png */}
      <div
        className={`relative ${dotSizes[size]} rounded-full flex-shrink-0 transition-transform duration-300 group-hover:scale-105 shadow-md`}
        style={{
          background: 'radial-gradient(circle at 35% 32%, #78f862 0%, #16d333 34%, #049f1e 72%, #026012 100%)',
          boxShadow: '0 3px 10px rgba(4, 159, 30, 0.35), inset 0 -2px 5px rgba(0, 40, 10, 0.4)',
        }}
      >
        {/* Specular curved reflection highlight */}
        <div
          className="absolute top-[18%] left-[20%] w-[36%] h-[28%] rounded-full bg-white/75 blur-[0.4px]"
          style={{ transform: 'rotate(-25deg)' }}
        />
      </div>

      {/* Typography: "greendot®" with "bank" aligned under "dot" */}
      <div className="flex flex-col">
        <div className="flex items-start leading-none">
          <span
            className={`font-sans font-extrabold tracking-[-0.04em] transition-colors ${textSizes[size]} ${
              isLight ? 'text-white' : 'text-slate-900'
            }`}
          >
            greendot
          </span>
          <span
            className={`font-bold ml-0.5 leading-none transition-colors ${regSizes[size]} ${
              isLight ? 'text-white/80' : 'text-slate-900'
            }`}
          >
            &reg;
          </span>
        </div>
        <span
          className={`font-sans font-normal lowercase tracking-tight transition-colors leading-none ${bankSizes[size]} ${
            isLight ? 'text-white/90' : 'text-slate-900'
          }`}
        >
          bank
        </span>
      </div>
    </div>
  );
};

