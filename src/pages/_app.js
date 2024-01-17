import { UserProvider } from '@auth0/nextjs-auth0/client';
import { Toaster } from "react-hot-toast"

 function App({ Component, pageProps }) {

  return (
   <UserProvider>
      <Component {...pageProps} />
      <Toaster />
   </UserProvider>   
  );
  
}

export default App;