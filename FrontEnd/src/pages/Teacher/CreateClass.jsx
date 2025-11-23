import { useState } from "react";
import { createClassroom } from "../../services/class.service";

const CreateClass = () => {
  const [name, setName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    //await createClassroom({ name });
    alert("Tạo lớp thành công!");
  };

  return (
    <div>
      <h2>Tạo lớp học</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Tên lớp học"
          onChange={(e) => setName(e.target.value)}
        />
        <button type="submit">Tạo lớp</button>
      </form>
    </div>
  );
};

export default CreateClass;
