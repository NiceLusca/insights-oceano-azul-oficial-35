
import { DiagnosticMessage } from "./DiagnosticMessage";

interface DiagnosticMessagesProps {
  messages: Array<{ type: "success" | "warning" | "error"; message: string }>;
}

export const DiagnosticMessages = ({ messages }: DiagnosticMessagesProps) => {
  if (!messages || messages.length === 0) {
    return null;
  }
  
  return (
    <div className="space-y-3">
      {messages.map((msg, index) => (
        <DiagnosticMessage 
          key={index} 
          message={msg.message} 
          type={msg.type} 
        />
      ))}
    </div>
  );
};
