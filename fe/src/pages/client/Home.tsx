import { getAllProducts } from "@/services/ProductService";
import * as CartService from "@/services/CartService";
import { setCart } from "@/store/CartReducer";
import type { AppDispatch } from "@/store/store";
import type { Product } from "@/types/Product";
import type { ApiResponse } from "@/types/Response";
import { formatPrice } from "@/helpers/formatPrice";
import { Search, ShoppingCart, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { AiOutlineDollarCircle, AiOutlineThunderbolt } from "react-icons/ai";
import { TiTick } from "react-icons/ti";
import { useDispatch } from "react-redux";

const HomePage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 8;

  const dispatch = useDispatch<AppDispatch>();
  const categories = [
    { value: "all", label: "Tất cả " },
    { value: "ao", label: "Áo" },
    { value: "quan", label: "Quần" },
    { value: "giay", label: "Giày" },
    { value: "dep", label: "Dép" },
    { value: "tui", label: "Túi" },
    { value: "mu", label: "Mũ" },
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const params: Record<string, string> = {
          page: currentPage.toString(),
          limit: itemsPerPage.toString(),
        };

        if (debouncedSearchTerm) params.search = debouncedSearchTerm;
        if (selectedCategory && selectedCategory !== "all")
          params.category = selectedCategory;

        const response: ApiResponse<Product[]> = await getAllProducts(params);

        if (response.success && response.data) {
          setProducts(response.data);
          if (response.totalPages) {
            setTotalPages(response.totalPages);
          }
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentPage, debouncedSearchTerm, selectedCategory]);

  const handleAddToCart = async (product: Product) => {
    try {
      const response = await CartService.addToCart(product._id);
      if (response.success && response.data) {
        dispatch(setCart(response.data));
        alert("Đã thêm vào giỏ hàng!");
      }
    } catch (error) {
      console.error("Failed to add to cart:", error);
      alert("Thêm vào giỏ hàng thất bại!");
    }
  };

  const calculateDiscountedPrice = (price: number, discount: number) => {
    return price - (price * discount) / 100;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-400">Đang tải dữ liệu...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4 px-8">
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-12 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-400 focus:border-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-700"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value);
            setCurrentPage(1);
          }}
          className="px-4 py-3 bg-slate-900 border border-slate-800 rounded-lg text-slate-100 focus:border-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-700 min-w-[200px]"
        >
          {categories.map((category) => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </select>
      </div>

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
                <div className="relative overflow-hidden bg-[#F2F2F2] w-full h-55 ">
                  <img
                    src={product.thumbnail}
                    alt={product.title}
                    className="w-full h-55 object-contain group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
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

                  <button
                    onClick={() => handleAddToCart(product)}
                    className="w-full bg-slate-800 hover:bg-slate-700 text-slate-100 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 group-hover:bg-slate-100 group-hover:text-slate-900"
                  >
                    <ShoppingCart size={20} />
                    Thêm vào giỏ hàng
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-slate-800 text-slate-100 rounded-lg hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Trước
            </button>

            <div className="flex gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      currentPage === page
                        ? "bg-slate-100 text-slate-900 font-semibold"
                        : "bg-slate-800 text-slate-100 hover:bg-slate-700"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}
            </div>

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(totalPages, prev + 1))
              }
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-slate-800 text-slate-100 rounded-lg hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Sau
            </button>
          </div>
        )}
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
