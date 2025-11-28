import React, { createContext, useContext, useState, useCallback } from 'react';
import { LoginModal, SignupModal, ForgotPasswordModal } from '../components/ui';

const AuthModalContext = createContext();

export const AuthModalProvider = ({ children }) => {
  const [modals, setModals] = useState({
    login: false,
    signup: false,
    forgotPassword: false,
  });

  const closeAllModals = useCallback(() => {
    setModals({
      login: false,
      signup: false,
      forgotPassword: false,
    });
  }, []);

  const openLoginModal = useCallback(() => {
    setModals({
      login: true,
      signup: false,
      forgotPassword: false,
    });
  }, []);

  const openSignupModal = useCallback(() => {
    setModals({
      login: false,
      signup: true,
      forgotPassword: false,
    });
  }, []);

  const openForgotPasswordModal = useCallback(() => {
    setModals({
      login: false,
      signup: false,
      forgotPassword: true,
    });
  }, []);

  const value = {
    openLoginModal,
    openSignupModal,
    openForgotPasswordModal,
    closeAuthModals: closeAllModals,
  };

  return (
    <AuthModalContext.Provider value={value}>
      {children}

      <LoginModal
        show={modals.login}
        onHide={closeAllModals}
        onSwitchToSignup={openSignupModal}
        onSwitchToForgotPassword={openForgotPasswordModal}
      />

      <SignupModal
        show={modals.signup}
        onHide={closeAllModals}
        onSwitchToLogin={openLoginModal}
      />

      <ForgotPasswordModal
        show={modals.forgotPassword}
        onHide={closeAllModals}
        onSwitchToLogin={openLoginModal}
      />
    </AuthModalContext.Provider>
  );
};

export const useAuthModal = () => {
  const context = useContext(AuthModalContext);
  if (!context) {
    throw new Error('useAuthModal must be used within an AuthModalProvider');
  }
  return context;
};

export default AuthModalContext;

