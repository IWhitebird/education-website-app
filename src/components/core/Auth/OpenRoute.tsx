import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { RootState } from '../../../reducers/reducer';

interface OpenRouteProps {
  children: React.ReactNode;
}

const OpenRoute = ({ children }: OpenRouteProps): JSX.Element | null => {
  const { token } = useSelector((state: RootState) => state.auth);

  if (token === null) {
    return <>{children}</>;
  } else {
    return <Navigate to="/dashboard/my-profile" />;
  }
}

export default OpenRoute;
