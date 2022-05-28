import React from 'react';

interface Props {
    onSelect: (e?: any,) => void;
    type: string;
    name: string;
    id: string;
    checked?:boolean;
    value: string;
    BtnLable: string;
  }


const RadioButton: React.FC<Props> = ({ 
    type,
    BtnLable, 
    name, 
    id, 
    value, 
    checked,
    onSelect}) => {
    return (
    <div className="checkboxes checkbox-add_top_15">
        <label className="container_check-detail">
            <input 
            type={type} 
            name={name}
            id={id}
            checked={checked ?? false}
            onChange={onSelect} 
            value={value}/>
            {BtnLable && <span className="checkmark">{BtnLable}</span>}
        </label>
    </div>
    )
}

export default RadioButton;
