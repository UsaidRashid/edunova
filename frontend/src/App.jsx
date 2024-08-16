import Navbar from "./Navbar";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Overview from "./Overview";
import PeopleDirectory from "./PeopleDirectory";

function App() {
  return (
    <>
      <Navbar />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Overview />}></Route>
          <Route path="/people-directory" element={<PeopleDirectory />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
