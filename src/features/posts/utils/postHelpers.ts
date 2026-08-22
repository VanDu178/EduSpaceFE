export const getPostTypeStyles = (code?: string): string => {
  const normCode = code?.toUpperCase() || 'GENERAL';
  switch (normCode) {
    case 'FRONTEND':
    case 'KIENTHUC':
    case 'KIEN_THUC':
      return 'purple';
    case 'BACKEND':
    case 'BAITAP':
    case 'BAI_TAP':
      return 'cyan';
    case 'UIUX':
    case 'PROJECT_LOG':
    case 'PROJECTLOG':
      return 'magenta';
    case 'DEVOPS':
    case 'GENERAL':
      return 'cyan';
    default:
      return 'default';
  }
};
