import React, { ReactNode } from 'react';
import AuthContext from '../AuthContext';

interface PageProps {
  children: ReactNode;
}

const Page: React.FC<PageProps> = ({ children }) => {
  return (
    <AuthContext>
      {children}
    </AuthContext>
  );
}

export default Page;
