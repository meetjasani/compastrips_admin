import React from "react";
import { Button } from "react-bootstrap";


interface Props {
  ButtonStyle: string;
  children?: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  type: string;
}

const Buttons: React.FC<Props> = ({
  children,
  onClick,
  type,
  ButtonStyle,
  disabled
}) => {
  return (
    <Button
      disabled={disabled || false}
      type={type}
      onClick={onClick}
      className={ButtonStyle}
    >
      {children}
    </Button>
  );
}

export default Buttons;