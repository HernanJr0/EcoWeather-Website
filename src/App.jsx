import { Outlet } from "react-router-dom";
import Header from "./Components/Header/Header";
import Footer from "./Components/Footer/Footer";
import { Analytics } from "@vercel/analytics/react";
import "./App.css";

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

const App = () => {
  return (
    <div id="App">
      <Header />
      <Outlet />
      <Footer />
      <Analytics/>
    </div>
  );
};
export default App;
