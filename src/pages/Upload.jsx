import { useState } from "react";
import API from "../api/api";

function Upload() {
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("image", file);
    formData.append("description", description);
    formData.append("location", location);

    try {
      await API.post("/api/complaints", formData);
      alert("Complaint Submitted");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Upload Complaint</h2>

      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <br />

      <input
        placeholder="Description"
        onChange={(e) => setDescription(e.target.value)}
      />
      <br />

      <input
        placeholder="Location"
        onChange={(e) => setLocation(e.target.value)}
      />
      <br />

      <button type="submit">Submit</button>
    </form>
  );
}

export default Upload;