import * as CartService from "@/services/CartService";
import * as InvoiceService from "@/services/InvoiceService";
import { setCart } from "@/store/CartReducer";
import type { AppDispatch, RootState } from "@/store/store";
import type { LocalCartItem } from "@/types/Cart";
import { formatPrice } from "@/helpers/formatPrice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MdDelete, MdRemove, MdAdd, MdShoppingCart } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const user = useSelector((state: RootState) => state.user.user);
  const cartList: LocalCartItem[] = useSelector(
    (state: RootState) => state.cart
  );
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        setLoading(true);
        const response = await CartService.getCart();
        if (response.success && response.data) {
          dispatch(setCart(response.data));
        }
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [dispatch]);

  const total: number = cartList.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  const handleRemove = async (_id: string) => {
    try {
      const response = await CartService.removeFromCart(_id);
      if (response.success && response.data) {
        dispatch(setCart(response.data));
      }
    } catch (error) {}
  };

  const handleClear = async () => {
    if (window.confirm("Bạn có chắc muốn xóa toàn bộ giỏ hàng?")) {
      try {
        const response = await CartService.clearCart();
        if (response.success && response.data) {
          dispatch(setCart(response.data));
        }
      } catch (error) {}
    }
  };

  const handleUpdateQuantity = async (
    productId: string,
    newQuantity: number
  ) => {
    try {
      if (newQuantity <= 0) {
        await handleRemove(productId);
        return;
      }

      const response = await CartService.updateCartItem(productId, newQuantity);
      if (response.success && response.data) {
        dispatch(setCart(response.data));
      }
    } catch (error) {}
  };

  const handleCheckout = async () => {
    if (!user) {
      alert("Vui lòng đăng nhập để thanh toán!");
      navigate("/auth");
      return;
    }

    if (cartList.length === 0) {
      alert("Giỏ hàng trống!");
      return;
    }

    const products = cartList.map((item) => ({
      productId: item.product._id,
      quantity: item.quantity,
      price: item.product.price,
    }));

    try {
      const response = await InvoiceService.createInvoice(
        user._id,
        products,
        true
      );

      if (response.success) {
        alert("Đặt hàng thành công!");
        navigate("/invoices");
      } else {
        alert("Đặt hàng thất bại!");
      }
    } catch (error) {
      alert("Có lỗi xảy ra!");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-400">Đang tải giỏ hàng...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-100">
            Giỏ hàng của bạn
          </h2>
          <p className="text-slate-400 mt-1">
            {cartList.length} sản phẩm trong giỏ hàng
          </p>
        </div>
        {cartList.length > 0 && (
          <button
            onClick={handleClear}
            className="flex items-center gap-2 px-4 py-2 bg-red-900/20 text-red-400 border border-red-800 rounded-lg font-medium hover:bg-red-900/30 transition-colors"
          >
            <MdDelete size={20} />
            Xóa tất cả
          </button>
        )}
      </div>

      {cartList.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {cartList.map((item) => (
              <div
                key={item._id}
                className="bg-slate-900 border border-slate-800 rounded-lg p-4 hover:border-slate-700 transition-colors"
              >
                <div className="flex gap-4">
                  <div className="w-24 h-24 shrink-0 overflow-hidden rounded-lg bg-slate-800">
                    <img
                      src={item.product.thumbnail}
                      alt={item.product.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src =
                          "https://via.placeholder.com/96/334155/e2e8f0?text=No+Image";
                      }}
                    />
                  </div>

                  <div className="flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-semibold text-slate-100 line-clamp-2">
                        {item.product.title}
                      </h3>
                      <button
                        onClick={() => handleRemove(item._id)}
                        className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-colors ml-2"
                        title="Xóa"
                      >
                        <MdDelete size={20} />
                      </button>
                    </div>

                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center gap-3 bg-slate-800 border border-slate-700 rounded-lg p-1">
                        <button
                          onClick={() =>
                            handleUpdateQuantity(item._id, item.quantity - 1)
                          }
                          className="p-2 text-slate-300 hover:text-slate-100 hover:bg-slate-700 rounded transition-colors"
                        >
                          <MdRemove size={18} />
                        </button>
                        <span className="text-slate-100 font-semibold min-w-8 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            handleUpdateQuantity(item._id, item.quantity + 1)
                          }
                          className="p-2 text-slate-300 hover:text-slate-100 hover:bg-slate-700 rounded transition-colors"
                        >
                          <MdAdd size={18} />
                        </button>
                      </div>

                      <div className="text-right">
                        <p className="text-sm text-slate-400">
                          {formatPrice(item.product.price)} x {item.quantity}
                        </p>
                        <p className="text-xl font-bold text-slate-100 mt-1">
                          {formatPrice(item.product.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 space-y-4 sticky top-6">
              <h3 className="text-lg font-semibold text-slate-100 border-b border-slate-800 pb-3">
                Tóm tắt đơn hàng
              </h3>

              <div className="space-y-2">
                <div className="flex justify-between text-slate-400">
                  <span>Tạm tính</span>
                  <span>{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Phí vận chuyển</span>
                  <span className="text-green-400">Miễn phí</span>
                </div>
              </div>

              <div className="border-t border-slate-800 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-slate-100">
                    Tổng cộng
                  </span>
                  <span className="text-2xl font-bold text-slate-100">
                    {formatPrice(total)}
                  </span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full bg-slate-100 text-slate-900 py-3 rounded-lg font-semibold hover:bg-white transition-colors"
              >
                Thanh toán
              </button>

              <a
                href="/"
                className="block w-full bg-slate-800 text-slate-300 py-3 rounded-lg font-semibold hover:bg-slate-700 transition-colors text-center"
              >
                Tiếp tục mua hàng
              </a>

              <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 mt-4">
                <div className="space-y-2 text-sm text-slate-400">
                  <div className="flex items-start gap-2">
                    <span>✓</span>
                    <span>Miễn phí vận chuyển cho đơn hàng từ 500k</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span>✓</span>
                    <span>Đổi trả trong 30 ngày</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span>✓</span>
                    <span>Bảo hành chính hãng</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-12">
          <div className="text-center max-w-md mx-auto space-y-4">
            <div className="bg-slate-800 w-24 h-24 rounded-full flex items-center justify-center mx-auto">
              <MdShoppingCart className="text-slate-600" size={48} />
            </div>
            <h3 className="text-2xl font-bold text-slate-100">
              Giỏ hàng trống
            </h3>
            <p className="text-slate-400">
              Bạn chưa có sản phẩm nào trong giỏ hàng. Hãy khám phá các sản phẩm
              tuyệt vời của chúng tôi!
            </p>
            <a
              href="/"
              className="inline-block bg-slate-100 text-slate-900 px-8 py-3 rounded-lg font-semibold hover:bg-white transition-colors"
            >
              Khám phá sản phẩm
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
