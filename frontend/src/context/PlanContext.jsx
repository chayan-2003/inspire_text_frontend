import React, { createContext, useState } from 'react';

export const PlanContext = createContext();

export function PlanProvider({ children }) {
  const [plan, setPlan] = useState(null);

  return (
    <PlanContext.Provider value={{ plan, setPlan }}>
      {children}
    </PlanContext.Provider>
  );
}