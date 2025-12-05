export const getStatusBadge = (status: string) => {
  const statusConfig = {
    pending: {
      label: "Chờ xử lý",
      className: "bg-yellow-900/20 text-yellow-400 border-yellow-800",
    },
    paid: {
      label: "Đã thanh toán",
      className: "bg-green-900/20 text-green-400 border-green-800",
    },
    cancelled: {
      label: "Đã hủy",
      className: "bg-red-900/20 text-red-400 border-red-800",
    },
  };

  const config =
    statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.className}`}
    >
      {config.label}
    </span>
  );
};
