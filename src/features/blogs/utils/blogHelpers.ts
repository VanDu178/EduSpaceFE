export const getBlogTypeStyles = (code?: string): string => {
  const normCode = code?.toUpperCase() || '';
  switch (normCode) {
    case 'MINDSET':
      return 'purple';
    case 'METHODOLOGY':
      return 'cyan';
    case 'QUANT':
      return 'magenta';
    default:
      return 'default';
  }
};

