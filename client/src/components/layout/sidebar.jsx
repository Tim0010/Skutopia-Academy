import React from 'react';

export const Sidebar = ({ items }) => {
  return (
    <div className="sidebar">
      {items.map((item, index) => (
        <div 
          key={index} 
          onClick={item.onClick} 
          className="sidebar-item"
        >
          {item.icon && <item.icon />}
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
};
