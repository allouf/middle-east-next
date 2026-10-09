"use client";

import React, { useEffect } from 'react';
import { CreateForm } from './Profile/CreateForm';
import { useProviderApiStore } from '../../stores';

interface ProviderSectionWrapperProps {
  children: React.ReactNode;
}

export const ProviderSectionWrapper: React.FC<ProviderSectionWrapperProps> = ({ children }) => {
  const { shouldShowCreateForm } = useProviderApiStore();


  useEffect(() => {
    console.log("shouldShowCreateForm", shouldShowCreateForm)
  }, [shouldShowCreateForm])
  return (
    <>
      {shouldShowCreateForm ? <CreateForm /> : children}
    </>
  );
};
