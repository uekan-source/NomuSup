const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 py-8 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-sm text-gray-500 mb-4">
          © 2026 Nomu-Sup. 薬剤師監修の二日酔い対策ソムリエ
        </p>
        <div className="flex justify-center gap-6 text-xs text-gray-400">
          <a href="#" className="hover:underline">利用規約</a>
          <a href="#" className="hover:underline">プライバシーポリシー</a>
          <a href="#" className="hover:underline">免責事項</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;