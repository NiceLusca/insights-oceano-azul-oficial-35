
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
  // Remove qualquer caractere que não seja número, ponto ou vírgula
  let value = e.target.value.replace(/[^0-9.,]/g, '');
  
  // Remove o "R$ " se existir
  value = value.replace("R$ ", "");
  
  // Converte vírgula para ponto para cálculos internos
  const numericValue = value.replace(',', '.');
  
  // Se for um número válido, use-o; caso contrário, use 0
  const numValue = isNaN(parseFloat(numericValue)) ? 0 : parseFloat(numericValue);
  
  // Chama a função onChange com o valor numérico
  onChange(numValue);
};
