import Logo from '@/components/common/Logo';
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        {/* Left section */}
        <div style={styles.column}>
          <Logo className="" iconSize={6} textSize="text-xl" />

          <p style={styles.description}>
            Đổi mới ngành kính mắt từ năm 2012. Chúng tôi kết hợp tay nghề thủ công tinh xảo với
            công nghệ số hiện đại để mang đến trải nghiệm quang học tốt nhất cho bạn.
          </p>

          <div style={styles.social}>
            <button style={styles.iconBtn}>🌐</button>
            <button style={styles.iconBtn}>🔗</button>
          </div>
        </div>

        {/* Shop */}
        <div style={styles.column}>
          <h4 style={styles.title}>MUA SẮM</h4>
          <ul style={styles.list}>
            <li>Tất cả kính</li>
            <li>Sản phẩm mới</li>
            <li>Kính chống ánh sáng xanh</li>
            <li>Kính râm</li>
          </ul>
        </div>

        {/* Support */}
        <div style={styles.column}>
          <h4 style={styles.title}>HỖ TRỢ</h4>
          <ul style={styles.list}>
            <li>Theo dõi đơn hàng</li>
            <li>Đổi / Trả hàng</li>
            <li>Tìm cửa hàng</li>
            <li>Trung tâm trợ giúp</li>
          </ul>
        </div>

        {/* Legal */}
        <div style={styles.column}>
          <h4 style={styles.title}>PHÁP LÝ</h4>
          <ul style={styles.list}>
            <li>Chính sách bảo mật</li>
            <li>Điều khoản sử dụng</li>
            <li>Khả năng truy cập</li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  footer: {
    backgroundColor: '#ffffff',
    borderTop: '1px solid #e5e7eb',
    padding: '40px 80px',
    fontFamily: 'Arial, sans-serif',
    color: '#374151',
  },
  container: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr 1fr 1fr',
    gap: '40px',
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontWeight: 600,
    fontSize: '18px',
  },
  logoIcon: {
    color: '#2563eb',
  },
  logoText: {
    color: '#111827',
  },
  description: {
    fontSize: '14px',
    lineHeight: '1.6',
    color: '#6b7280',
    maxWidth: '300px',
  },
  social: {
    display: 'flex',
    gap: '12px',
    marginTop: '8px',
  },
  iconBtn: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    border: '1px solid #d1d5db',
    background: '#ffffff',
    cursor: 'pointer',
  },
  title: {
    fontSize: '14px',
    fontWeight: 600,
    color: '#111827',
  },
  list: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    fontSize: '14px',
    color: '#6b7280',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
};

export default Footer;
