
import { motion } from "framer-motion";

interface ErrorDisplayProps {
  errorMessage: string;
}

export function ErrorDisplay({ errorMessage }: ErrorDisplayProps) {
  return (
    <motion.div 
      className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h3 className="text-lg font-semibold text-red-700 dark:text-red-400">Atenção</h3>
      <p className="text-red-600 dark:text-red-300 mt-2">{errorMessage}</p>
    </motion.div>
  );
}
