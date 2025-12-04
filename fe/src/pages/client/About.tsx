import { MdEmail, MdPhone, MdLocationOn, MdShoppingBag } from "react-icons/md";
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";

const AboutPage = () => {
  return (
    <div className="space-y-12">
      <section className="bg-slate-900 border border-slate-800 rounded-xl p-8 md:p-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-100 mb-4">
            Chào mừng đến với Dark Hawk
          </h1>
          <p className="text-xl text-slate-300 leading-relaxed">
            Thời trang tối giản - Phong cách đen huyền bí
          </p>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-slate-100 mb-4">
            Về chúng tôi
          </h2>
          <div className="space-y-4 text-slate-300">
            <p>
              Dark Hawk là thương hiệu thời trang chuyên về quần áo màu đen,
              mang đến phong cách tối giản, sang trọng và đầy cá tính cho những
              người yêu thích sự huyền bí và thanh lịch.
            </p>
            <p>
              Với triết lý "Less is more", mỗi sản phẩm của chúng tôi đều được
              thiết kế tỉ mỉ, chọn lọc chất liệu cao cấp để tạo nên những món đồ
              vượt thời gian, dễ dàng phối hợp và luôn nổi bật.
            </p>
            <p>
              Từ áo thun basic, hoodie, áo khoác đến quần jeans, quần âu - tất
              cả đều mang đậm dấu ấn của sắc đen huyền bí, phù hợp cho mọi dịp
              từ casual đến formal.
            </p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-slate-100 mb-4">
            Tầm nhìn & Sứ mệnh
          </h2>
          <div className="space-y-4 text-slate-300">
            <div>
              <h3 className="text-lg font-semibold text-slate-100 mb-2">
                Tầm nhìn
              </h3>
              <p>
                Trở thành thương hiệu thời trang tối giản hàng đầu, nơi mọi
                người tìm thấy phong cách riêng với sắc đen đặc trưng.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-100 mb-2">
                Sứ mệnh
              </h3>
              <p>
                Mang đến những bộ trang phục chất lượng, vượt thời gian, giúp
                bạn tự tin thể hiện cá tính và phong cách riêng.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-900 border border-slate-800 rounded-xl p-8">
        <h2 className="text-2xl font-bold text-slate-100 mb-6 text-center">
          Giá trị cốt lõi
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-slate-800 rounded-lg">
            <div className="bg-blue-500/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <MdShoppingBag size={32} className="text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-100 mb-2">
              Chất lượng
            </h3>
            <p className="text-slate-300">
              Vải cao cấp, đường may tiến, thoải mái và bền đẹp qua thời gian
            </p>
          </div>

          <div className="text-center p-6 bg-slate-800 rounded-lg">
            <div className="bg-green-500/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <MdEmail size={32} className="text-green-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-100 mb-2">
              Phong cách
            </h3>
            <p className="text-slate-300">
              Thiết kế tối giản, dễ phối đồ, phù hợp mọi dịp từ casual đến
              formal
            </p>
          </div>

          <div className="text-center p-6 bg-slate-800 rounded-lg">
            <div className="bg-purple-500/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <MdPhone size={32} className="text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-100 mb-2">
              Tận tâm
            </h3>
            <p className="text-slate-300">
              Hỗ trợ khách hàng 24/7, giải đáp mọi thắc mắc nhanh chóng và nhiệt
              tình
            </p>
          </div>
        </div>
      </section>

      <section className="bg-slate-900 border border-slate-800 rounded-xl p-8">
        <h2 className="text-2xl font-bold text-slate-100 mb-6 text-center">
          Thông tin liên hệ
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="bg-slate-800 p-3 rounded-lg">
                <MdLocationOn size={24} className="text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-100 mb-1">
                  Địa chỉ
                </h3>
                <p className="text-slate-300">
                  123 Đường ABC, Quận 1, TP. Hồ Chí Minh
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-slate-800 p-3 rounded-lg">
                <MdPhone size={24} className="text-green-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-100 mb-1">
                  Điện thoại
                </h3>
                <p className="text-slate-300">Hotline: 1900 xxxx</p>
                <p className="text-slate-300">Mobile: 0123 456 789</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="bg-slate-800 p-3 rounded-lg">
                <MdEmail size={24} className="text-purple-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-100 mb-1">
                  Email
                </h3>
                <p className="text-slate-300">support@darkhawk.com</p>
                <p className="text-slate-300">info@darkhawk.com</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-slate-800 p-3 rounded-lg">
                <FaFacebook size={24} className="text-blue-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-100 mb-1">
                  Mạng xã hội
                </h3>
                <div className="flex gap-4 mt-2">
                  <a
                    href="#"
                    className="text-slate-400 hover:text-blue-500 transition-colors"
                  >
                    <FaFacebook size={24} />
                  </a>
                  <a
                    href="#"
                    className="text-slate-400 hover:text-blue-400 transition-colors"
                  >
                    <FaTwitter size={24} />
                  </a>
                  <a
                    href="#"
                    className="text-slate-400 hover:text-pink-400 transition-colors"
                  >
                    <FaInstagram size={24} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-900 border border-slate-800 rounded-xl p-8">
        <h2 className="text-2xl font-bold text-slate-100 mb-6 text-center">
          Giờ làm việc
        </h2>
        <div className="max-w-md mx-auto space-y-3">
          <div className="flex justify-between items-center p-4 bg-slate-800 rounded-lg">
            <span className="text-slate-100 font-medium">Thứ 2 - Thứ 6</span>
            <span className="text-slate-300">8:00 - 20:00</span>
          </div>
          <div className="flex justify-between items-center p-4 bg-slate-800 rounded-lg">
            <span className="text-slate-100 font-medium">Thứ 7 - Chủ nhật</span>
            <span className="text-slate-300">9:00 - 21:00</span>
          </div>
          <div className="flex justify-between items-center p-4 bg-slate-800 rounded-lg">
            <span className="text-slate-100 font-medium">Ngày lễ</span>
            <span className="text-slate-300">9:00 - 18:00</span>
          </div>
        </div>
      </section>

      <section className="bg-linear-to-r from-blue-900/20 to-purple-900/20 border border-slate-800 rounded-xl p-8 text-center">
        <h2 className="text-2xl font-bold text-slate-100 mb-4">
          Cảm ơn bạn đã tin tưởng Dark Hawk!
        </h2>
        <p className="text-slate-300 max-w-2xl mx-auto">
          Chúng tôi luôn nỗ lực để mang đến trải nghiệm mua sắm tốt nhất. Hãy
          liên hệ với chúng tôi nếu bạn cần bất kỳ sự hỗ trợ nào.
        </p>
      </section>
    </div>
  );
};

export default AboutPage;
