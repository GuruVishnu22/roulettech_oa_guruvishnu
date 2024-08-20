import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import * as Pages from "./pages";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <Router>
      <Toaster />
      <Routes>
        <Route path="/" element={<Pages.Login />} />
        <Route path="/categories">
          <Route path="add" element={<Pages.AddCategory />} />
        </Route>
        <Route path="/items">
          <Route path="" element={<Pages.ItemDashboard />} />
          <Route path="add" element={<Pages.AddItem />} />
        </Route>
        <Route path="*" element={<Pages.NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
