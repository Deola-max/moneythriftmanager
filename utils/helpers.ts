
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

export const formatDate = (dateString: string | null | undefined, options?: Intl.DateTimeFormatOptions): string => {
  if (!dateString) return 'N/A';
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options
  };
  try {
    return new Date(dateString).toLocaleDateString(undefined, defaultOptions);
  } catch (e) {
    return 'Invalid Date';
  }
};

export const formatCurrency = (amount: number | null | undefined): string => {
  if (amount === null || amount === undefined) return 'N/A';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
};

export const calculateProgress = (current: number, target: number | null): number => {
  if (target === null || target === 0) return 0;
  if (current <= 0) return 0;
  if (current >= target) return 100;
  return Math.round((current / target) * 100);
};
