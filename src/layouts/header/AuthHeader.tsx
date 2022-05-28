import React from 'react';
import { Navbar} from 'react-bootstrap';

const AuthHeader = () => {
    return (
  
        <Navbar className="header-bg justify-content-center py-4">
            <Navbar.Brand className="text-white logo-text">Compastrips Administrator</Navbar.Brand>
        </Navbar>
    )
}

export default AuthHeader;
