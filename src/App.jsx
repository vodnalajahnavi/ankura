import { LanguageProvider } from "./LanguageContext";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <LanguageProvider>
      <Dashboard />
    </LanguageProvider>
  );
}

export default App;