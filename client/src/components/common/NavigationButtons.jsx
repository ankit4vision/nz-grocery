import React from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import './NavigationButtons.css';

const NavigationButtons = ({
  onPrev,
  onNext,
  isPrevDisabled = false,
  isNextDisabled = false,
  className = '',
  prevLabel = 'Previous',
  nextLabel = 'Next'
}) => {
  const buttonClasses = [
    'navigation-buttons',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={buttonClasses}>
      <button 
        className={`navigation-buttons__btn navigation-buttons__btn--prev ${isPrevDisabled ? 'navigation-buttons__btn--disabled' : ''}`}
        onClick={onPrev}
        disabled={isPrevDisabled}
        aria-label={prevLabel}
      >
        <FaChevronLeft className="navigation-buttons__icon" />
      </button>
      <button 
        className={`navigation-buttons__btn navigation-buttons__btn--next ${isNextDisabled ? 'navigation-buttons__btn--disabled' : ''}`}
        onClick={onNext}
        disabled={isNextDisabled}
        aria-label={nextLabel}
      >
        <FaChevronRight className="navigation-buttons__icon" />
      </button>
    </div>
  );
};

export default NavigationButtons;
