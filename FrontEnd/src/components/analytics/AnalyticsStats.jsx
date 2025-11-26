import "../../styles/analytics/AnalyticsStats.css";

export default function AnalyticsStats({ stats }) {
  return (
    <div className="stats-grid">
      <div className="stat-card">
        <p className="stat-label">Average Engagement</p>
        <p className="stat-value">{stats.engagement}%</p>
      </div>

      <div className="stat-card">
        <p className="stat-label">Positive Emotion Score</p>
        <p className="stat-value">{stats.positive}%</p>
      </div>

      <div className="stat-card">
        <p className="stat-label">Attention Level</p>
        <p className="stat-value">{stats.attention}%</p>
      </div>

      <div className="stat-card">
        <p className="stat-label">Stress Indicator</p>
        <p className="stat-value">{stats.stress}%</p>
      </div>
    </div>
  );
}
