import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Auth0Provider } from "@auth0/auth0-react";

ReactDOM.createRoot(document.getElementById("root")!).render(
  // <React.StrictMode>
  <Auth0Provider
    domain="narrativenet.us.auth0.com"
    clientId="Eyyx9pLNWIZuZuwg1P7N7wXRuF01sfhZ"
    authorizationParams={{
      redirect_uri: window.location.origin,
      audience: "apple",
      scope: "openid profile email",
    }}
  >
    <App />
  </Auth0Provider>
  // {/* </React.StrictMode> */}
);
