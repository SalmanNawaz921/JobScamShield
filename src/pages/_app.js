// pages/_app.js

import { UserState } from "@/context/UserContext";
import "@ant-design/v5-patch-for-react-19";
import "./globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <UserState>
      <Component {...pageProps} />
    </UserState>
  );
}

export default MyApp;
