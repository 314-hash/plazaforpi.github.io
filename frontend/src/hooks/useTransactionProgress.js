import { useState, useCallback } from 'react';

const useTransactionProgress = (type = 'listing') => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  const [customSteps, setCustomSteps] = useState(null);

  const start = useCallback((steps = null) => {
    setIsOpen(true);
    setCurrentStep(0);
    setIsLoading(true);
    setError(null);
    setMessage('');
    if (steps) setCustomSteps(steps);
  }, []);

  const nextStep = useCallback((newMessage = '') => {
    setCurrentStep(prev => prev + 1);
    setMessage(newMessage);
  }, []);

  const setStep = useCallback((step, newMessage = '') => {
    setCurrentStep(step);
    setMessage(newMessage);
  }, []);

  const complete = useCallback((finalMessage = '') => {
    setIsLoading(false);
    setMessage(finalMessage);
    setTimeout(() => {
      setIsOpen(false);
      setCurrentStep(0);
      setMessage('');
      setCustomSteps(null);
    }, 2000);
  }, []);

  const fail = useCallback((errorMessage) => {
    setIsLoading(false);
    setError(errorMessage);
  }, []);

  const reset = useCallback(() => {
    setIsOpen(false);
    setCurrentStep(0);
    setIsLoading(false);
    setError(null);
    setMessage('');
    setCustomSteps(null);
  }, []);

  const updateMessage = useCallback((newMessage) => {
    setMessage(newMessage);
  }, []);

  return {
    // State
    isOpen,
    currentStep,
    isLoading,
    error,
    message,
    customSteps,
    type,

    // Actions
    start,
    nextStep,
    setStep,
    complete,
    fail,
    reset,
    updateMessage,
  };
};

export default useTransactionProgress;
