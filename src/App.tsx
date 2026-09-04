import { Route, Routes } from "react-router";

import { DashboardView } from "./views/dashboard.view";
import { YearlyView } from "./views/yearly.view";

function App() {
  return (
    <Routes>
      <Route index element={<DashboardView />} />
      <Route path="year" element={<YearlyView />} />
    </Routes>
  );
}

export default App;
