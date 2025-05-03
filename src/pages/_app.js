// pages/_app.js

import { UserState } from "@/context/UserContext";
import "@/app/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <UserState>
      <Component {...pageProps} />
    </UserState>
  );
}

export default MyApp;
