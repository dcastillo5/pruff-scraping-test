import "./App.css";
import { Auth } from "./components/auth";
import { Navbar } from "./components/navbar";
import { Properties } from "./components/properties";
import { FilterMenu } from "./components/filterMenu";
import { PropertiesProvider } from "./context/propertiesProvider";
import { Pagination } from "./components/pagination";
import { useState } from "react";

export type User = {
  email: string;
  token: string;
  favoriteProperties: string[];
};

function App() {
  const [user, setUser] = useState<User | null>(null);

  if (!user) {
    return <Auth setUser={setUser} />;
  }
  return (
    <div className="min-h-screen px-10 py-0.5">
      <header>
        <Navbar user={user} setUser={setUser} />
      </header>
      <main>
        <div className="divider mt-0"></div>
        <div className="flex space-x-6">
          <PropertiesProvider user={user} setUser={setUser}>
            <FilterMenu />
            <div className="w-full h-full flex flex-col">
              <Properties />
              <Pagination />
            </div>
          </PropertiesProvider>
        </div>
      </main>
    </div>
  );
}

export default App;
