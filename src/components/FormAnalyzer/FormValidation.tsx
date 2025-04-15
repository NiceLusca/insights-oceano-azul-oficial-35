
import { FormValues } from "@/schemas/formSchema";
import { UseFormReturn } from "react-hook-form";

interface FormValidationProps {
  form: UseFormReturn<FormValues>;
}

export const useFormValidation = ({ form }: FormValidationProps) => {
  const validateRequiredFields = () => {
    // Check if all required numeric fields have values > 0
    const values = form.getValues();
    const requiredFields = [
      'totalClicks', 
      'salesPageVisits', 
      'checkoutVisits', 
      'mainProductSales',
      'mainProductPrice'
    ];
    
    for (const field of requiredFields) {
      if (!values[field] || values[field] === 0) {
        form.setError(field as any, {
          type: 'required',
          message: 'Este campo é obrigatório'
        });
        return false;
      }
    }
    
    return true;
  };

  return { validateRequiredFields };
};
