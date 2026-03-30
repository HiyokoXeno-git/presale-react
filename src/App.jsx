import { BrowserRouter, Routes, Route } from "react-router-dom";
import OnePage from "./pages/OnePage";
import PresalePage from "./pages/PresalePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<OnePage />} />
        <Route path="/presale" element={<PresalePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;