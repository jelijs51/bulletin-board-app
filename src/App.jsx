import { Routes, Route } from "react-router-dom";
import Homepage from "./page/Homepage";
import PostDetail from "./page/PostDetail";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/post/:id" element={<PostDetail />} />
    </Routes>
  );
}

export default App;
