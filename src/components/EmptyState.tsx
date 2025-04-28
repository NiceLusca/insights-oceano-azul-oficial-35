
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  icon
}: EmptyStateProps) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center p-12 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {icon ? (
        <div className="mb-6 text-blue-600 dark:text-blue-400">
          {icon}
        </div>
      ) : (
        <img
          src="/lovable-uploads/2da50e89-1402-421c-8c73-60efe5119215.png"
          alt="Oceano Azul"
          className="w-32 h-32 mb-8 opacity-30 dark:opacity-20"
        />
      )}
      
      <motion.h3 
        className="text-xl font-medium text-gray-800 dark:text-gray-200"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.3 }}
      >
        {title}
      </motion.h3>
      
      <motion.p 
        className="text-gray-500 dark:text-gray-400 mt-2 max-w-md text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.3 }}
      >
        {description}
      </motion.p>
      
      {actionLabel && onAction && (
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.3 }}
        >
          <Button 
            className="mt-6"
            onClick={onAction}
            variant="default"
          >
            {actionLabel}
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
}
