/**
 * UI-specific constants
 */

// Component Sizes
export const COMPONENT_SIZES = {
  XS: 'xs',
  SM: 'sm',
  MD: 'md',
  LG: 'lg',
  XL: 'xl',
};

// Button Variants
export const BUTTON_VARIANTS = {
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
  SUCCESS: 'success',
  DANGER: 'danger',
  WARNING: 'warning',
  INFO: 'info',
  LIGHT: 'light',
  DARK: 'dark',
  OUTLINE_PRIMARY: 'outline-primary',
  OUTLINE_SECONDARY: 'outline-secondary',
  OUTLINE_SUCCESS: 'outline-success',
  OUTLINE_DANGER: 'outline-danger',
  OUTLINE_WARNING: 'outline-warning',
  OUTLINE_INFO: 'outline-info',
  OUTLINE_LIGHT: 'outline-light',
  OUTLINE_DARK: 'outline-dark',
  LINK: 'link',
  GHOST: 'ghost',
};

// Input Types
export const INPUT_TYPES = {
  TEXT: 'text',
  EMAIL: 'email',
  PASSWORD: 'password',
  NUMBER: 'number',
  TEL: 'tel',
  URL: 'url',
  SEARCH: 'search',
  DATE: 'date',
  TIME: 'time',
  DATETIME_LOCAL: 'datetime-local',
  MONTH: 'month',
  WEEK: 'week',
  COLOR: 'color',
  FILE: 'file',
  HIDDEN: 'hidden',
  CHECKBOX: 'checkbox',
  RADIO: 'radio',
  RANGE: 'range',
  TEXTAREA: 'textarea',
  SELECT: 'select',
};

// Alert Types
export const ALERT_TYPES = {
  SUCCESS: 'success',
  DANGER: 'danger',
  WARNING: 'warning',
  INFO: 'info',
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
  LIGHT: 'light',
  DARK: 'dark',
};

// Modal Sizes
export const MODAL_SIZES = {
  SMALL: 'sm',
  MEDIUM: 'md',
  LARGE: 'lg',
  EXTRA_LARGE: 'xl',
  FULLSCREEN: 'fullscreen',
};

// Table Variants
export const TABLE_VARIANTS = {
  DEFAULT: 'default',
  STRIPED: 'striped',
  BORDERED: 'bordered',
  BORDERLESS: 'borderless',
  HOVER: 'hover',
  SMALL: 'sm',
  RESPONSIVE: 'responsive',
};

// Card Variants
export const CARD_VARIANTS = {
  DEFAULT: 'default',
  OUTLINED: 'outlined',
  ELEVATED: 'elevated',
  FLAT: 'flat',
  FILLED: 'filled',
};

// Badge Variants
export const BADGE_VARIANTS = {
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
  SUCCESS: 'success',
  DANGER: 'danger',
  WARNING: 'warning',
  INFO: 'info',
  LIGHT: 'light',
  DARK: 'dark',
};

// Spinner Types
export const SPINNER_TYPES = {
  BORDER: 'border',
  GROW: 'grow',
  DOT: 'dot',
  PULSE: 'pulse',
  WAVE: 'wave',
  RING: 'ring',
  CIRCLE: 'circle',
};

// Animation Types
export const ANIMATION_TYPES = {
  FADE: 'fade',
  SLIDE: 'slide',
  ZOOM: 'zoom',
  BOUNCE: 'bounce',
  FLIP: 'flip',
  ROTATE: 'rotate',
  SCALE: 'scale',
  SKEW: 'skew',
  TRANSLATE: 'translate',
  OPACITY: 'opacity',
};

// Animation Directions
export const ANIMATION_DIRECTIONS = {
  UP: 'up',
  DOWN: 'down',
  LEFT: 'left',
  RIGHT: 'right',
  IN: 'in',
  OUT: 'out',
};

// Animation Durations
export const ANIMATION_DURATIONS = {
  FAST: 150,
  NORMAL: 250,
  SLOW: 350,
  VERY_SLOW: 500,
};

// Animation Easing
export const ANIMATION_EASING = {
  LINEAR: 'linear',
  EASE: 'ease',
  EASE_IN: 'ease-in',
  EASE_OUT: 'ease-out',
  EASE_IN_OUT: 'ease-in-out',
  CUBIC_BEZIER: 'cubic-bezier',
};

// Z-Index Layers
export const Z_INDEX = {
  DROPDOWN: 1000,
  STICKY: 1020,
  FIXED: 1030,
  MODAL_BACKDROP: 1040,
  MODAL: 1050,
  POPOVER: 1060,
  TOOLTIP: 1070,
  TOAST: 1080,
  LOADING_OVERLAY: 1090,
  DEBUG_PANEL: 1100,
};

// Breakpoints
export const BREAKPOINTS = {
  XS: 0,
  SM: 576,
  MD: 768,
  LG: 992,
  XL: 1200,
  XXL: 1400,
};

// Grid Columns
export const GRID_COLUMNS = {
  1: 1,
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
  12: 12,
};

// Flex Directions
export const FLEX_DIRECTIONS = {
  ROW: 'row',
  ROW_REVERSE: 'row-reverse',
  COLUMN: 'column',
  COLUMN_REVERSE: 'column-reverse',
};

// Flex Wraps
export const FLEX_WRAPS = {
  NOWRAP: 'nowrap',
  WRAP: 'wrap',
  WRAP_REVERSE: 'wrap-reverse',
};

// Justify Content
export const JUSTIFY_CONTENT = {
  START: 'start',
  END: 'end',
  CENTER: 'center',
  BETWEEN: 'between',
  AROUND: 'around',
  EVENLY: 'evenly',
};

// Align Items
export const ALIGN_ITEMS = {
  START: 'start',
  END: 'end',
  CENTER: 'center',
  BASELINE: 'baseline',
  STRETCH: 'stretch',
};

// Text Align
export const TEXT_ALIGN = {
  LEFT: 'left',
  CENTER: 'center',
  RIGHT: 'right',
  JUSTIFY: 'justify',
};

// Font Weights
export const FONT_WEIGHTS = {
  LIGHT: 300,
  NORMAL: 400,
  MEDIUM: 500,
  SEMIBOLD: 600,
  BOLD: 700,
  EXTRABOLD: 800,
  BLACK: 900,
};

// Font Sizes
export const FONT_SIZES = {
  XS: '0.75rem',
  SM: '0.875rem',
  BASE: '1rem',
  LG: '1.125rem',
  XL: '1.25rem',
  '2XL': '1.5rem',
  '3XL': '1.875rem',
  '4XL': '2.25rem',
  '5XL': '3rem',
  '6XL': '3.75rem',
};

// Line Heights
export const LINE_HEIGHTS = {
  TIGHT: 1.25,
  NORMAL: 1.5,
  RELAXED: 1.75,
};

// Border Radius
export const BORDER_RADIUS = {
  NONE: '0',
  SM: '0.125rem',
  MD: '0.375rem',
  LG: '0.5rem',
  XL: '0.75rem',
  '2XL': '1rem',
  '3XL': '1.5rem',
  FULL: '9999px',
};

// Shadows
export const SHADOWS = {
  NONE: 'none',
  SM: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  MD: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  LG: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  XL: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2XL': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  INNER: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
};

// Transitions
export const TRANSITIONS = {
  FAST: '150ms ease-in-out',
  NORMAL: '250ms ease-in-out',
  SLOW: '350ms ease-in-out',
  VERY_SLOW: '500ms ease-in-out',
};

// Icon Sizes
export const ICON_SIZES = {
  XS: '0.75rem',
  SM: '0.875rem',
  MD: '1rem',
  LG: '1.25rem',
  XL: '1.5rem',
  '2XL': '2rem',
  '3XL': '3rem',
};

// Avatar Sizes
export const AVATAR_SIZES = {
  XS: '1.5rem',
  SM: '2rem',
  MD: '2.5rem',
  LG: '3rem',
  XL: '4rem',
  '2XL': '5rem',
  '3XL': '6rem',
};

// Product Card Sizes
export const PRODUCT_CARD_SIZES = {
  SMALL: 'small',
  MEDIUM: 'medium',
  LARGE: 'large',
  COMPACT: 'compact',
  DETAILED: 'detailed',
};

// Pagination Sizes
export const PAGINATION_SIZES = {
  SMALL: 'sm',
  MEDIUM: 'md',
  LARGE: 'lg',
};

// Form Layouts
export const FORM_LAYOUTS = {
  VERTICAL: 'vertical',
  HORIZONTAL: 'horizontal',
  INLINE: 'inline',
  FLOATING: 'floating',
};

// Form Sizes
export const FORM_SIZES = {
  SMALL: 'sm',
  MEDIUM: 'md',
  LARGE: 'lg',
};

// Loading States
export const LOADING_STATES = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
};

// Tooltip Positions
export const TOOLTIP_POSITIONS = {
  TOP: 'top',
  BOTTOM: 'bottom',
  LEFT: 'left',
  RIGHT: 'right',
  TOP_START: 'top-start',
  TOP_END: 'top-end',
  BOTTOM_START: 'bottom-start',
  BOTTOM_END: 'bottom-end',
  LEFT_START: 'left-start',
  LEFT_END: 'left-end',
  RIGHT_START: 'right-start',
  RIGHT_END: 'right-end',
};

// Dropdown Positions
export const DROPDOWN_POSITIONS = {
  AUTO: 'auto',
  TOP: 'top',
  BOTTOM: 'bottom',
  LEFT: 'left',
  RIGHT: 'right',
};

export default {
  COMPONENT_SIZES,
  BUTTON_VARIANTS,
  INPUT_TYPES,
  ALERT_TYPES,
  MODAL_SIZES,
  TABLE_VARIANTS,
  CARD_VARIANTS,
  BADGE_VARIANTS,
  SPINNER_TYPES,
  ANIMATION_TYPES,
  ANIMATION_DIRECTIONS,
  ANIMATION_DURATIONS,
  ANIMATION_EASING,
  Z_INDEX,
  BREAKPOINTS,
  GRID_COLUMNS,
  FLEX_DIRECTIONS,
  FLEX_WRAPS,
  JUSTIFY_CONTENT,
  ALIGN_ITEMS,
  TEXT_ALIGN,
  FONT_WEIGHTS,
  FONT_SIZES,
  LINE_HEIGHTS,
  BORDER_RADIUS,
  SHADOWS,
  TRANSITIONS,
  ICON_SIZES,
  AVATAR_SIZES,
  PRODUCT_CARD_SIZES,
  PAGINATION_SIZES,
  FORM_LAYOUTS,
  FORM_SIZES,
  LOADING_STATES,
  TOOLTIP_POSITIONS,
  DROPDOWN_POSITIONS,
};
