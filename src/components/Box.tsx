import { useState, type PropsWithChildren } from "react";

type BoxProps = PropsWithChildren<object>;
export function Box({ children }: BoxProps) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen(open => !open)}>
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && children}
    </div>
  );
}
