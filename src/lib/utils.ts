export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  } catch {
    return dateString;
  }
}

export function formatShortDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  } catch {
    return dateString;
  }
}

export function maskCardNumber(cardNumber: string): string {
  const clean = cardNumber.replace(/\s+/g, '');
  if (clean.length < 4) return cardNumber;
  const lastFour = clean.slice(-4);
  return `•••• •••• •••• ${lastFour}`;
}

export function generateAccountNumber(): string {
  return Math.floor(1000000000 + Math.random() * 9000000000).toString();
}

export function generateCustomerId(): string {
  return 'CUST-' + Math.floor(100000 + Math.random() * 900000).toString();
}

export function generateActivationCode(): string {
  const g1 = Math.floor(1000 + Math.random() * 9000);
  const g2 = Math.floor(1000 + Math.random() * 9000);
  const g3 = Math.floor(1000 + Math.random() * 9000);
  const g4 = Math.floor(1000 + Math.random() * 9000);
  return `GRD-${g1}-${g2}-${g3}-${g4}`;
}

export function generateReceiptNumber(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = 'RCP-';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function generateReference(prefix = 'TXN'): string {
  const chars = '0123456789ABCDEFGHJKMNPQRSTUVWXYZ';
  let ref = `${prefix}-`;
  for (let i = 0; i < 9; i++) {
    ref += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return ref;
}
