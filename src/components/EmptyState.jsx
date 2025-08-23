import { FileText, Users, AlertCircle, RefreshCw } from "lucide-react";

const EmptyState = ({
  type = "default",
  title,
  description,
  action,
  onActionClick,
  icon: CustomIcon
}) => {
  const getIcon = () => {
    if (CustomIcon) return CustomIcon;

    switch (type) {
      case "activities":
        return FileText;
      case "students":
        return Users;
      case "error":
        return AlertCircle;
      case "loading":
        return RefreshCw;
      default:
        return FileText;
    }
  };

  const getColors = () => {
    switch (type) {
      case "error":
        return {
          iconBg: "bg-red-100",
          iconColor: "text-red-600",
          titleColor: "text-red-900"
        };
      case "warning":
        return {
          iconBg: "bg-yellow-100",
          iconColor: "text-yellow-600",
          titleColor: "text-yellow-900"
        };
      case "info":
        return {
          iconBg: "bg-blue-100",
          iconColor: "text-blue-600",
          titleColor: "text-blue-900"
        };
      default:
        return {
          iconBg: "bg-gray-100",
          iconColor: "text-gray-400",
          titleColor: "text-gray-900"
        };
    }
  };

  const IconComponent = getIcon();
  const colors = getColors();

  return (
    <div className="text-center py-12">
      <div className={`mx-auto flex items-center justify-center h-16 w-16 rounded-full ${colors.iconBg} mb-6`}>
        <IconComponent
          className={`h-8 w-8 ${colors.iconColor} ${type === 'loading' ? 'animate-spin' : ''}`}
        />
      </div>

      <h3 className={`text-lg font-medium mb-2 ${colors.titleColor}`}>
        {title}
      </h3>

      {description && (
        <p className="text-gray-500 max-w-md mx-auto mb-6">
          {description}
        </p>
      )}

      {action && onActionClick && (
        <button
          onClick={onActionClick}
          className="btn btn-primary"
        >
          {action}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
