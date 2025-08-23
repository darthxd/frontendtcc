import { CheckCircle, Clock, AlertTriangle, GraduationCap } from "lucide-react";

const StatusIcon = ({ status, className = "h-4 w-4" }) => {
  const statusConfig = {
    pending: {
      icon: Clock,
      color: "text-yellow-500",
    },
    submitted: {
      icon: CheckCircle,
      color: "text-blue-500",
    },
    graded: {
      icon: GraduationCap,
      color: "text-green-500",
    },
    overdue: {
      icon: AlertTriangle,
      color: "text-red-500",
    },
  };

  const config = statusConfig[status] || statusConfig.pending;
  const IconComponent = config.icon;

  return <IconComponent className={`${className} ${config.color}`} />;
};

export default StatusIcon;
