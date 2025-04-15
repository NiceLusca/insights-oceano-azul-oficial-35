
export const formatCurrency = (value: number) => {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
};

export const formatPercentage = (value: number) => {
  return `${(value * 100).toFixed(1)}%`;
};

export const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>, onChange: (...event: any[]) => void) => {
  // Remove non-numeric characters except periods and commas
  let value = e.target.value.replace(/[^0-9.,]/g, '');
  
  // Replace comma with period for calculation
  value = value.replace(',', '.');
  
  // Parse to number or default to 0
  const numValue = value ? parseFloat(value) : 0;
  
  // Call the onChange function with the numeric value
  onChange(numValue);
};
