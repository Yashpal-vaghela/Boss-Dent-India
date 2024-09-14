import React from 'react'

const ColorOption = ({color,onClick,isSelected}) => {
    // console.log("color",color)
    const Objectvalue = Object.values(color)
  return (
    <div 
    // className='color-option'
    className={`color-option ${isSelected ? 'selected' : ''}`}
    style={{backgroundColor:Objectvalue[0]}} 
    onClick={() => onClick(color)}> 
    </div>
  ) 
}

export default ColorOption;
