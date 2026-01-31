import Icon from './Icon';

export default function UsageInstructions() {
  return (
    <div className="mt-12 p-8 bg-white rounded-3xl shadow-2xl transition-all duration-500 hover:shadow-[0_20px_50px_rgba(30,58,95,0.3)] hover:scale-105 transform border-4 border-[#1e3a5f]">
      <h2 className="text-3xl font-bold text-[#1e3a5f] mb-6 flex items-center gap-3">
        <Icon emoji="📖" size={48} />
        使用說明
      </h2>
      <ul className="space-y-3 text-xl text-[#1e3a5f] font-semibold">
        <li className="transition-all duration-300 hover:translate-x-3 hover:text-[#f97316] flex items-center gap-3">
          <Icon emoji="🔹" size={32} />
          點擊左上角選單選擇分類
        </li>
        <li className="transition-all duration-300 hover:translate-x-3 hover:text-[#f97316] flex items-center gap-3">
          <Icon emoji="🔹" size={32} />
          點擊任何按鈕即可播放語音
        </li>
        <li className="transition-all duration-300 hover:translate-x-3 hover:text-[#f97316] flex items-center gap-3">
          <Icon emoji="🔹" size={32} />
          使用自訂輸入框輸入任何想說的話
        </li>
        <li className="transition-all duration-300 hover:translate-x-3 hover:text-[#f97316] flex items-center gap-3">
          <Icon emoji="🔹" size={32} />
          在設定中調整語速和音量
        </li>
        <li className="transition-all duration-300 hover:translate-x-3 hover:text-[#f97316] flex items-center gap-3">
          <Icon emoji="🔹" size={32} />
          查看歷史記錄快速重複使用
        </li>
      </ul>
    </div>
  );
}
