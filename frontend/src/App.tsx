import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import Home from "./pages/Home";
import Viewer from "./pages/Viewer";
import Header from "@/components/localcomponents/Header";

const App = () => (
  <BrowserRouter>
    <Header />
    <Routes>
      <Route path="/" element={<Home />}></Route>
      <Route path="/viewer/:storyid" element={<Viewer />}></Route>
    </Routes>
    <Toaster />
  </BrowserRouter>
);

export default App;
