import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

const Card = ({ children, className = "" }: CardProps) => {
  return (
    <div
      className={`bg-white rounded-xl border border-gray-200 shadow-sm p-5 ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;
