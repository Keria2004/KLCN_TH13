import { useParams } from "react-router-dom";
import useEmotionRealtime from "../../services/emotion.service";

const EmotionDashboard = () => {
  const { id: sessionId } = useParams();
  const [emotions, setEmotions] = useState([]);

  useEmotionRealtime(sessionId, (data) => {
    setEmotions((prev) => [...prev, data]);
  });

  return (
    <div>
      <h2>Giám sát cảm xúc buổi học</h2>

      <EmotionLineChart data={emotions} />
      <EmotionPieChart data={emotions} />
    </div>
  );
};

export default EmotionDashboard;
