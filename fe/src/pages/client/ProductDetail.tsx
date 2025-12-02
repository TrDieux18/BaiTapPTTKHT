import { getProductById } from "@/services/ProductService";
import * as CartService from "@/services/CartService";
import { setCart } from "@/store/CartReducer";
import type { AppDispatch } from "@/store/store";
import type { Product } from "@/types/Product";
import { formatPrice } from "@/helpers/formatPrice";
import {
  MdShoppingCart,
  MdStar,
  MdCheckCircle,
  MdLocalShipping,
  MdArrowBack,
} from "react-icons/md";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);

        const response = await getProductById(id!);
        if (response.success && response.data) {
          setProduct(response.data);
        }
      } catch (error) {
        alert("Không thể tải thông tin sản phẩm!");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate]);

  const handleAddToCart = async () => {
    if (!product) return;

    try {
      const response = await CartService.addToCart(product._id, 1);
      if (response.success && response.data) {
        dispatch(setCart(response.data));
        alert(`Đã thêm sản phẩm vào giỏ hàng!`);
      }
    } catch (error) {
      alert("Thêm vào giỏ hàng thất bại!");
    }
  };

  const calculateDiscountedPrice = (price: number, discount: number) => {
    return price - (price * discount) / 100;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-slate-400 text-xl">Đang tải dữ liệu...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-slate-400 text-xl">Không tìm thấy sản phẩm!</div>
      </div>
    );
  }

  const discountedPrice = calculateDiscountedPrice(
    product.price,
    product.discountPercentage
  );

  return (
    <div className="space-y-4 px-8 ">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-400 hover:text-slate-100 transition-colors"
      >
        <MdArrowBack size={24} />
        <span>Quay lại</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div className="aspect-square bg-[#F2F2F2] relative">
            <img
              src={product.thumbnail}
              alt={product.title}
              className="w-full h-full object-contain"
            />
            {product.discountPercentage > 0 && (
              <div className="absolute top-4 left-4 bg-red-500 text-white px-4 py-2 rounded-full text-lg font-bold">
                -{product.discountPercentage}%
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center gap-1">
                <MdStar className="text-yellow-400" size={24} />
                <span className="text-slate-100 font-semibold text-xl">
                  {product.rating}
                </span>
              </div>
              <span className="text-slate-500">|</span>
              <span className="text-slate-400">
                {product.stock} sản phẩm có sẵn
              </span>
            </div>

            <h1 className="text-3xl font-bold text-slate-100 mb-4">
              {product.title}
            </h1>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              {product.discountPercentage > 0 ? (
                <div className="space-y-2">
                  <div className="flex items-baseline gap-3">
                    <span className="text-4xl font-bold text-slate-100">
                      {formatPrice(discountedPrice)}
                    </span>
                    <span className="text-xl text-slate-500 line-through">
                      {formatPrice(product.price)}
                    </span>
                  </div>
                  <div className="text-red-400 font-medium">
                    Tiết kiệm {formatPrice(product.price - discountedPrice)}
                  </div>
                </div>
              ) : (
                <span className="text-4xl font-bold text-slate-100">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
            <h3 className="text-lg font-semibold text-slate-100">Mô tả</h3>
            <p className="text-slate-300 leading-relaxed">
              {product.description || "Chưa có mô tả chi tiết"}
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="w-full flex items-center justify-center gap-3 bg-slate-100 text-slate-900 py-4 rounded-xl font-bold text-lg hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <MdShoppingCart size={24} />
              {product.stock === 0 ? "Hết hàng" : "Thêm vào giỏ hàng"}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center gap-3">
              <div className="bg-slate-800 p-3 rounded-lg">
                <MdCheckCircle size={24} className="text-green-400" />
              </div>
              <div>
                <div className="text-slate-100 font-semibold">Chính hãng</div>
                <div className="text-slate-400 text-sm">100% authentic</div>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center gap-3">
              <div className="bg-slate-800 p-3 rounded-lg">
                <MdLocalShipping size={24} className="text-blue-400" />
              </div>
              <div>
                <div className="text-slate-100 font-semibold">Miễn phí</div>
                <div className="text-slate-400 text-sm">Giao hàng nhanh</div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-slate-400">Mã sản phẩm:</span>
                <span className="text-slate-100 ml-2 font-mono">
                  #{product._id.slice(-8).toUpperCase()}
                </span>
              </div>
              <div>
                <span className="text-slate-400">Trạng thái:</span>
                <span
                  className={`ml-2 font-semibold ${
                    product.stock > 0 ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {product.stock > 0 ? "Còn hàng" : "Hết hàng"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
