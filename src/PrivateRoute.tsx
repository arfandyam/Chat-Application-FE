import { Navigate } from "react-router-dom";

export const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const user = JSON.parse(sessionStorage.getItem('user') || "null");

    if (!user) {
      return <Navigate to="/" />;
    }

    return <>{children}</>
};
