
interface DiagnosticMessageProps {
  message: string;
  type: "success" | "warning" | "error";
}

export const DiagnosticMessage = ({ message, type }: DiagnosticMessageProps) => {
  const getBackgroundColor = () => {
    switch (type) {
      case "success":
        return "bg-green-50 text-green-700";
      case "warning":
        return "bg-yellow-50 text-yellow-700";
      case "error":
        return "bg-red-50 text-red-700";
      default:
        return "bg-blue-50 text-blue-700";
    }
  };

  return (
    <div className={`p-4 rounded-lg ${getBackgroundColor()}`}>
      {message}
    </div>
  );
};
