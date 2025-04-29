
import { ActionableInsight } from "@/components/ActionableInsight";
import { motion } from "framer-motion";

interface ActionableInsightsGridProps {
  insights: Array<{
    title: string;
    content: string;
    action: string;
    status: "success" | "warning" | "error";
  }>;
}

export function ActionableInsightsGrid({ insights }: ActionableInsightsGridProps) {
  if (!insights || insights.length === 0) {
    return null;
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {insights.map((insight, index) => (
        <motion.div 
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <ActionableInsight
            title={insight.title}
            insight={insight.content}
            action={insight.action}
            status={insight.status}
          />
        </motion.div>
      ))}
    </div>
  );
}
