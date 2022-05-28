import React, { useState } from 'react';
// import { validateInput } from './Vailidation';

import { Form} from 'react-bootstrap';

interface Props {
    name: string;
    value: any;
    lablestyleClass: string;
    InputstyleClass: string;
    onChange: (e: object) => void;
    label: string;
    placeholder: string;
    type: string;
    fromrowStyleclass: string;
 
  }

const InputField : React.FC<Props> = ({name,value, lablestyleClass, InputstyleClass, onChange, label, placeholder, type, fromrowStyleclass}) => {
    const [values, setValues] = useState(value);
     const handleChange = (event: { target: { value: any; }; }) =>{
        const {value} = event.target;
        setValues(value);
        onChange(event);
    }

    return (
        <Form.Group className={`mb-0 ${fromrowStyleclass}`}>
            {label && <Form.Label className={lablestyleClass}>{label}</Form.Label>}

            {type === 'textarea' ? (
                <Form.Control 
                as="textarea" 
                rows={5}
                name={name} 
                className={InputstyleClass}
                placeholder={placeholder}
                onChange={handleChange}
                value={values ? values : value}
                />
            ) : (
                <Form.Control 
                name={name}
                value={values ? values : value}
                className={InputstyleClass} 
                type={type} 
                placeholder={placeholder} 
                onChange={handleChange}
                />
            )}
                
        </Form.Group>
    )
};


export default InputField;