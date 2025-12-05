import type { Invoice } from "@/types/Invoice";
import type { Product } from "@/types/Product";
import { formatPrice } from "@/helpers/formatPrice";
import { getStatusBadge } from "@/helpers/getStatusBadge";
import { MdClose, MdPerson } from "react-icons/md";

interface InvoiceDetailModalProps {
  invoice: Invoice | null;
  isOpen: boolean;
  onClose: () => void;
  showUserInfo?: boolean;
}

const InvoiceDetailModal = ({
  invoice,
  isOpen,
  onClose,
  showUserInfo = false,
}: InvoiceDetailModalProps) => {
  if (!isOpen || !invoice) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-slate-900 border border-slate-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-slate-900 border-b border-slate-800 p-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-slate-100">
              Chi tiết đơn hàng
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              #{invoice._id.slice(-8).toUpperCase()}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <MdClose size={24} className="text-slate-400" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-800 rounded-lg p-4">
              <p className="text-slate-400 text-sm mb-1">Ngày đặt</p>
              <p className="text-slate-100 font-semibold">
                {new Date(invoice.createdAt || "").toLocaleString("vi-VN")}
              </p>
            </div>
            <div className="bg-slate-800 rounded-lg p-4">
              <p className="text-slate-400 text-sm mb-1">Trạng thái</p>
              {getStatusBadge(invoice.status)}
            </div>
            <div className="bg-slate-800 rounded-lg p-4">
              <p className="text-slate-400 text-sm mb-1">Tổng tiền</p>
              <p className="text-2xl font-bold text-slate-100">
                {formatPrice(invoice.totalAmount)}
              </p>
            </div>
          </div>

          {showUserInfo && (
            <div className="bg-slate-800 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <MdPerson size={20} className="text-slate-400" />
                <p className="text-slate-400 text-sm">Khách hàng:</p>
                <p className="text-slate-100 font-semibold">
                  {typeof invoice.userId === "string"
                    ? `User ID: ${invoice.userId}`
                    : (invoice.userId as any).username || "N/A"}
                </p>
              </div>
            </div>
          )}

          <div>
            <h3 className="text-xl font-bold text-slate-100 mb-4">
              Danh sách sản phẩm ({invoice.products.length})
            </h3>
            <div className="space-y-4">
              {invoice.products.map((item, index) => {
                const isPopulated = typeof item.productId !== "string";
                const product = isPopulated
                  ? (item.productId as Product)
                  : null;

                return (
                  <div
                    key={index}
                    className="bg-slate-800 rounded-lg p-4 flex gap-4"
                  >
                    {product && (
                      <img
                        src={product.thumbnail}
                        alt={product.title}
                        className="w-24 h-24 object-cover rounded-lg border border-slate-700"
                      />
                    )}
                    <div className="flex-1">
                      <h4 className="text-slate-100 font-semibold mb-2">
                        {product
                          ? product.title
                          : `SP #${(item.productId as string)
                              .slice(-8)
                              .toUpperCase()}`}
                      </h4>
                      {product && (
                        <>
                          <p className="text-slate-400 text-sm mb-2 line-clamp-2">
                            {product.description}
                          </p>
                          <div className="flex gap-4 text-sm">
                            <span className="text-slate-400">
                              Đánh giá:{" "}
                              <span className="text-yellow-400">
                                ★ {product.rating}
                              </span>
                            </span>
                          </div>
                        </>
                      )}
                      <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-700">
                        <div>
                          <p className="text-slate-400 text-sm">
                            Số lượng: {item.quantity}
                          </p>
                          <p className="text-slate-400 text-sm">
                            Đơn giá: {formatPrice(item.price)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-slate-400 text-sm">Thành tiền</p>
                          <p className="text-xl font-bold text-slate-100">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="border-t border-slate-800 pt-4">
            <div className="flex justify-between items-center text-lg">
              <span className="text-slate-400 font-semibold">Tổng cộng:</span>
              <span className="text-2xl font-bold text-slate-100">
                {formatPrice(invoice.totalAmount)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetailModal;
