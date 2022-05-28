import React from 'react'
import AuthHeader from './header/AuthHeader';


interface Props {
    children?: React.ReactNode;

  }


const LogRegLayout: React.FC<Props> = ({
    children,
    }) => {
    return (
        <div className="loginreg-bg">
            <AuthHeader/>
                {children}
        </div>
    )
}

export default LogRegLayout;
