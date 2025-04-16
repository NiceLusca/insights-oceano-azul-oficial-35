
interface DiagnosticMessageProps {
  message: string;
  type: "success" | "warning" | "error";
}

export const DiagnosticMessage = ({ message, type }: DiagnosticMessageProps) => {
  const getBackgroundColor = () => {
    switch (type) {
      case "success":
        return "bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400";
      case "warning":
        return "bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400";
      case "error":
        return "bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400";
      default:
        return "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400";
    }
  };

  return (
    <div className={`p-4 rounded-lg border ${getBackgroundColor()} ${
      type === 'success' ? 'border-green-200 dark:border-green-800' :
      type === 'warning' ? 'border-yellow-200 dark:border-yellow-800' :
      type === 'error' ? 'border-red-200 dark:border-red-800' :
      'border-blue-200 dark:border-blue-800'
    }`}>
      {message}
    </div>
  );
};
