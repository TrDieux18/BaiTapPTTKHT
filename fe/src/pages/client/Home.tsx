import { getAllProducts } from "@/services/ProductService";
import type { Product } from "@/types/Product";
import type { ApiResponse } from "@/types/Response";
import { ShoppingCart, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { AiOutlineDollarCircle, AiOutlineThunderbolt } from "react-icons/ai";
import { TiTick } from "react-icons/ti";

const HomePage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response: ApiResponse<Product[]> = await getAllProducts();
        if (response.success && response.data) {
          setProducts(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const calculateDiscountedPrice = (price: number, discount: number) => {
    return price - (price * discount) / 100;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-400">Đang tải dữ liệu...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-slate-100 mb-6">
          Sản Phẩm Nổi Bật
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => {
            const discountedPrice = calculateDiscountedPrice(
              product.price,
              product.discountPercentage
            );

            return (
              <div
                key={product._id}
                className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-slate-700 transition-all duration-300 group"
              >
                <div className="relative overflow-hidden bg-slate-800 w-full h-64 ">
                  <img
                    src={product.thumbnail}
                    alt={product.title}
                    className="w-full h-auto object-cover group-hover:scale-110 transition-transform duration-500"
                  />

                  {product.discountPercentage > 0 && (
                    <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      -{product.discountPercentage}%
                    </div>
                  )}

                  <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-sm text-slate-100 px-3 py-1 rounded-full text-xs">
                    Còn {product.stock} sp
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Star
                        className="text-yellow-400 fill-yellow-400"
                        size={16}
                      />
                      <span className="text-slate-100 font-semibold">
                        {product.rating}
                      </span>
                    </div>
                    <span className="text-slate-500 text-sm">
                      ({product.stock} đánh giá)
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-100 line-clamp-2 min-h-14">
                    {product.title}
                  </h3>

                  <p className="text-slate-400 text-sm line-clamp-2 min-h-10">
                    {product.description}
                  </p>

                  <div className="pt-2 border-t border-slate-800">
                    {product.discountPercentage > 0 ? (
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold text-slate-100">
                            {formatPrice(discountedPrice)}
                          </span>
                        </div>
                        <span className="text-slate-500 line-through text-sm">
                          {formatPrice(product.price)}
                        </span>
                      </div>
                    ) : (
                      <span className="text-2xl font-bold text-slate-100">
                        {formatPrice(product.price)}
                      </span>
                    )}
                  </div>

                  <button className="w-full bg-slate-800 hover:bg-slate-700 text-slate-100 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 group-hover:bg-slate-100 group-hover:text-slate-900">
                    <ShoppingCart size={20} />
                    Thêm vào giỏ hàng
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-center">
          <div className="bg-slate-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <TiTick size={32} className="text-slate-100" />
          </div>
          <h3 className="text-slate-100 font-bold text-lg mb-2">
            Chính hãng 100%
          </h3>
          <p className="text-slate-400 text-sm">
            Cam kết sản phẩm chính hãng, bảo hành đầy đủ
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-center">
          <div className="bg-slate-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <AiOutlineDollarCircle size={32} className="text-slate-100" />
          </div>
          <h3 className="text-slate-100 font-bold text-lg mb-2">
            Giá tốt nhất
          </h3>
          <p className="text-slate-400 text-sm">
            Cam kết giá rẻ nhất thị trường
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-center">
          <div className="bg-slate-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <AiOutlineThunderbolt size={32} className="text-slate-100" />
          </div>
          <h3 className="text-slate-100 font-bold text-lg mb-2">
            Giao hàng nhanh
          </h3>
          <p className="text-slate-400 text-sm">Miễn phí ship đơn từ 500k</p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
