import React from 'react';

export type DeviceType = 'phone' | 'desktop' | 'tablet' | 'square';

interface DeviceFrameProps {
  children: React.ReactNode;
  type?: DeviceType;
  className?: string;
}

export const DeviceFrame: React.FC<DeviceFrameProps> = ({ 
  children, 
  type = 'desktop',
  className = '' 
}) => {
  const frameClasses = {
    phone: 'max-w-[375px] aspect-[9/19]',
    desktop: 'max-w-[800px] aspect-[16/10]',
    tablet: 'max-w-[600px] aspect-[4/3]',
    square: 'max-w-[500px] aspect-square'
  };

  return (
    <div className={`device-frame ${frameClasses[type]} ${className}`}>
      <div className="device-screen">
        <div className="transform-container">
          {children}
        </div>
      </div>
    </div>
  );
}; 