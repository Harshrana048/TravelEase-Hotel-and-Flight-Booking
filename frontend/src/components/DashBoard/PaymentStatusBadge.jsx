import { getStatusClasses, prettyStatus } from "./dashboardHelpers";

export default function PaymentStatusBadge({ status = "pending", label }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-black ring-1 ${getStatusClasses(status)}`}
    >
      {label || prettyStatus(status)}
    </span>
  );
}
