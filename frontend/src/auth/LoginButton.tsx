import { useAuth0 } from "@auth0/auth0-react";

const LoginButton = () => {
    const { loginWithRedirect } = useAuth0();
  return (
    <button className="bg-lime-300 px-4 py-2  rounded-md shadow-md " onClick={() => loginWithRedirect()}>Get Started</button>
  )
}

export default LoginButton