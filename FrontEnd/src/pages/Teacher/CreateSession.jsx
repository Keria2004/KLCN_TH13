import { useEffect, useState } from "react";
import { getClassrooms } from "../../services/class.service";
import { createSession } from "../../services/session.service";

const CreateSession = () => {
  const [classes, setClasses] = useState([]);
  const [classId, setClassId] = useState("");
  const [sessionName, setSessionName] = useState("");

  useEffect(() => {
    getClassrooms().then((res) => setClasses(res.data));
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    // await createSession({
    //   class_id: classId,
    //   session_name: sessionName,
    // });
    alert("Tạo buổi học thành công!");
  };

  return (
    <div>
      <h2>Tạo buổi học</h2>

      <form onSubmit={submit}>
        <select onChange={(e) => setClassId(e.target.value)}>
          <option value="">-- Chọn lớp học --</option>
          {classes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Tên buổi học"
          onChange={(e) => setSessionName(e.target.value)}
        />

        <button type="submit">Tạo buổi học</button>
      </form>
    </div>
  );
};

export default CreateSession;
