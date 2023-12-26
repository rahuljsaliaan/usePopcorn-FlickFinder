import { useState } from "react";

export function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);
  <Box />;
  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && children}
    </div>
  );
}
