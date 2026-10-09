'use client';

import React from "react";
import AuthWrapper from "./AuthWrapper";
import LoginForm from "./LoginForm";

/**
 * Login Page Component
 * Combines AuthWrapper layout with LoginForm
 */
const LoginPage: React.FC = () => {
  return (
    <AuthWrapper>
      <LoginForm />
    </AuthWrapper>
  );
};

export default LoginPage;

