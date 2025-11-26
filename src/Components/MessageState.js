import { AlertTriangle, AlertOctagon, CheckCircle, Info } from "lucide-react";

const icons = {
  error: AlertOctagon,
  warning: AlertTriangle,
  success: CheckCircle,
  info: Info,
};

const colors = {
  error: "border-red-500 bg-red-100 text-red-600",
  warning: "border-yellow-400 bg-yellow-100 text-yellow-600",
  success: "border-green-500 bg-green-100 text-green-600",
  info: "border-blue-500 bg-blue-100 text-blue-600",
};

const MessageState = ({
  type = "info",
  title = "Notice",
  message = "Something happened.",
  fullHeight = true,
}) => {
  const Icon = icons[type];
  const color = colors[type];

  return (
    <div
      className={`${
        fullHeight ? "min-h-screen" : "min-h-[300px]"
      } bg-gray-50 p-6`}>
      <div className="max-w-2xl mx-auto mt-20">
        <div
          className={`bg-white rounded-xl shadow-sm p-8 border-l-4 ${color}`}>
          <div className="flex items-center gap-3 mb-4">
            <div className={`p-3 rounded-full ${color}`}>
              <Icon className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">{title}</h2>
          </div>
          <p className="text-gray-600">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default MessageState;
