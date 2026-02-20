// src/components/layout/Footer.tsx
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="bg-gray-50 py-10 border-t border-gray-100">
    <div className="max-w-4xl mx-auto px-6 text-center">
      <p className="text-gray-400 text-sm mb-4">© 2026 Nomu-Sup. 薬剤師監修の二日酔い対策ソムリエ</p>
      <div className="flex justify-center gap-6 text-xs text-gray-500 font-medium">
        <Link to="/terms" className="hover:text-primary transition-colors">利用規約</Link>
        <Link to="/privacy" className="hover:text-primary transition-colors">プライバシーポリシー</Link>
        <Link to="/disclaimer" className="hover:text-primary transition-colors">免責事項</Link>
      </div>
    </div>
  </footer>
);

export default Footer;