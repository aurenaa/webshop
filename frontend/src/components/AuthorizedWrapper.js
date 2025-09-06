import { useAuthorize } from "../contexts/AuthorizeContext";

export default function AuthorizedWrapper({ children }) {
  const { isLoggedIn } = useAuthorize();

  if (!isLoggedIn) {
    return null;
  }

  return <>{children}</>;
}
