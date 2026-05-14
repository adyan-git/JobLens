export default function InsightCard({ title, message }) {
  return (
    <div className="bg-[#161616] border border-[#2a2a2a] rounded-xl p-4">
      <div className="text-white font-semibold">{title}</div>
      <div className="text-sm text-gray-300 mt-2 leading-relaxed">{message}</div>
    </div>
  );
}

