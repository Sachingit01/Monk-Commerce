import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/PageManager";
import "./styles.css";

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Index />} />
    </Routes>
  </BrowserRouter>
);

export default App;
