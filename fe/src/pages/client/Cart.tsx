import { clearCart, removeFromCart } from "@/store/CartReducer";
import type { AppDispatch, RootState } from "@/store/store";
import type { Cart } from "@/types/Cart";
import { useDispatch, useSelector } from "react-redux";

const CartPage = () => {
  const cartList: Cart[] = useSelector((state: RootState) => state.cart);

  const total: number = cartList.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  const dispatch = useDispatch<AppDispatch>();

  const handleRemove = (_id: string) => {
    dispatch(removeFromCart({ productId: _id }));
  };

  const handleClear = () => {
    dispatch(clearCart());
  };
  return (
    <div className="px-20 ">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Giỏ hàng của bạn</h2>
        <button
          onClick={handleClear}
          className="rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
        >
          Xóa tất cả
        </button>
      </div>

      {cartList.length > 0 ? (
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
          <ul className="divide-y divide-gray-200">
            {cartList.map((item) => (
              <li key={item._id} className="flex gap-4 p-4">
                <div className="h-24 w-24  overflow-hidden rounded-md border border-gray-200">
                  <img
                    src={item.product.thumbnail}
                    alt={item.product.title}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="flex flex-1 flex-col">
                  <div className="flex justify-between">
                    <h3 className="text-base font-medium text-gray-900">
                      {item.product.title}
                    </h3>
                    <button
                      className="text-sm font-medium text-red-600 hover:text-red-500"
                      onClick={() => handleRemove(item._id)}
                    >
                      Xóa
                    </button>
                  </div>

                  <div className="mt-auto flex items-end justify-between">
                    <div className="flex items-center space-x-4">
                      <button className="rounded-md border border-gray-300 px-2 py-1 text-sm hover:bg-gray-50">
                        -
                      </button>
                      <span className="text-sm font-medium">
                        {item.quantity}
                      </span>
                      <button className="rounded-md border border-gray-300 px-2 py-1 text-sm hover:bg-gray-50">
                        +
                      </button>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">
                        ${item.product.price} x {item.quantity}
                      </p>
                      <p className="text-lg font-medium text-indigo-600">
                        ${item.product.price * item.quantity}
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div className="border-t border-gray-200 p-4">
            <div className="flex justify-between">
              <span className="text-base font-medium text-gray-900">
                Tổng tiền
              </span>
              <span className="text-xl font-bold text-indigo-600">
                ${total.toFixed(2)}
              </span>
            </div>
            <button className="mt-4 w-full rounded-md bg-indigo-600 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1">
              Thanh toán
            </button>
          </div>
        </div>
      ) : (
        <div className="flex h-70 items-center justify-center rounded-lg border border-gray-200 bg-white">
          <p className="text-gray-500">Giỏ hàng trống</p>
        </div>
      )}
    </div>
  );
};

export default CartPage;
