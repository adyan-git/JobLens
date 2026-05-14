import InsightCard from '../../components/InsightCard';

export default function InsightsPanel({ insightsDataThing }) {
  const insightsArray = Array.isArray(insightsDataThing) ? insightsDataThing : [];

  if (insightsArray.length === 0) {
    return (
      <div className="py-16 flex items-center justify-center">
        <div className="text-center max-w-md text-gray-400 text-sm border border-[#2a2a2a] rounded-xl p-4 bg-[#151515]">
          Not enough data yet to generate insights.
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {insightsArray.map((insightObj, idx) => (
        <InsightCard
          key={`${insightObj?.title || 'insight'}-${idx}`}
          title={insightObj?.title}
          message={insightObj?.message}
        />
      ))}
    </div>
  );
}

