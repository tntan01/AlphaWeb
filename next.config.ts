import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Các cấu hình khác của ông (nếu có) */
  reactStrictMode: true,

  async rewrites() {
    return [
      // 1. CHUYÊN MỤC GIỚI THIỆU (ABOUT)
      {
        source: '/gioi-thieu',           // URL hiển thị cho khách
        destination: '/about',           // Thư mục thực tế trong code
      },
      {
        source: '/gioi-thieu/:slug',      // URL chi tiết bài giới thiệu
        destination: '/about/:slug',     // Thư mục thực tế
      },

      // 2. CHUYÊN MỤC DỰ ÁN (PROJECTS)
      {
        source: '/du-an',
        destination: '/projects',
      },
      {
        source: '/du-an/:slug',
        destination: '/projects/:slug',
      },

      // 3. CHUYÊN MỤC TIN TỨC (NEWS)
      {
        source: '/tin-tuc',
        destination: '/news',
      },
      {
        source: '/tin-tuc/:slug',
        destination: '/news/:slug',
      },

      // 4. CHUYÊN MỤC SẢN PHẨM (PRODUCTS)
      {
        source: '/san-pham',
        destination: '/products',
      },
      {
        source: '/san-pham/:slug',
        destination: '/products/:slug',
      }
    ];
  },
};

export default nextConfig;