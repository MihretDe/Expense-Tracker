import { useAuth0 } from "@auth0/auth0-react";

const LoginButton = () => {
    const { loginWithRedirect } = useAuth0();
  return (
    <button className="bg-amber-50" onClick={() => loginWithRedirect()}>LoginButton</button>
  )
}

export default LoginButton