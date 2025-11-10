/**
 * Format price string to display format
 */
export function formatPrice(price: string | number): string {
  const numericPrice = typeof price === 'string' ? parseFloat(price) : price;

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(numericPrice);
}

/**
 * Calculate total from price and quantity
 */
export function calculateTotal(price: string | number, quantity: number): string {
  const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
  return (numericPrice * quantity).toFixed(2);
}
