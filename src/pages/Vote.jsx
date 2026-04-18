import { useEffect, useState } from "react";
import API from "../api/api";

function Vote() {
  const [issues, setIssues] = useState([]);

  useEffect(() => {
    API.get("/api/issues").then((res) => setIssues(res.data));
  }, []);

  const vote = async (id) => {
    await API.post(`/api/issues/${id}`);
    window.location.reload();
  };

  return (
    <div>
      <h2>Local Issues</h2>

      {issues.map((issue) => (
        <div key={issue.id}>
          <h3>{issue.title}</h3>
          <p>Votes: {issue.votes}</p>
          <button onClick={() => vote(issue.id)}>Vote</button>
        </div>
      ))}
    </div>
  );
}

export default Vote;