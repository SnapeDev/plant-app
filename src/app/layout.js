import "./styles/globals.css"; // Import global styles
import AppLayout from "./components/AppLayout"; // Adjust the path as needed
import { UserProvider } from "../../context/UserContext"; // Import UserProvider

export const metadata = {
  title: "Plant Watering App",
  description: "Track your plant care routine easily.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <UserProvider>
          <AppLayout>{children}</AppLayout>
        </UserProvider>
      </body>
    </html>
  );
}
