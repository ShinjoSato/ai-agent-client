import { ThemeProvider } from "@/components/theme-provider"
import Home from './pages/Home';

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Home />
    </ThemeProvider>
  );
} 