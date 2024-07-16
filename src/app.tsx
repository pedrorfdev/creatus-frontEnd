import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "./components/ui/sonner";
import { Login } from "./pages/login";
import { UserDetails } from "./pages/user-details";
import { Users } from "./pages/users";

export function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Login />,
    },
    {
      path: "/users",
      element: <Users />,
    },
    {
      path: "/user-details/:id",
      element: <UserDetails />,
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
      <Toaster duration={3000} position="top-right" />
    </>
  );
}
