import "/styles/globals.css";
import { useState, useEffect } from "react";
import { PrivyProvider } from "@privy-io/react-auth";
import DesktopApp from "../components/DesktopApp";
import MobileApp from "../components/MobileApp";
import Image from "next/image";
import { PrivyWagmiConnector } from "@privy-io/wagmi-connector";
import { mainnet } from "wagmi/chains";
import { configureChains, createConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { Cloudinary } from "@cloudinary/url-gen";

import { Inter, Righteous } from "next/font/google";
import NavbarComponent from "../components/NavbarComponent";

import { Network, Alchemy } from "alchemy-sdk";

const configureChainsConfig = configureChains([mainnet], [publicProvider()]);

const settings = {
  apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(settings);

const handleLogin = (user) => {
  console.log(`User ${user.id} logged in!`);
};

const righteous = Righteous({ subsets: ["latin"], weight: "400" });
const inter = Inter({ subsets: ["latin"], weight: "400" });

export default function App({ Component, pageProps }) {
  const [isMobile, setIsMobile] = useState(false);
  const [displayFullScreen, setDisplayFullScreen] = useState(null);
  const [ethBalance, setEthBalance] = useState(0);

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === "Escape" && displayFullScreen) {
        setDisplayFullScreen(false);
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [displayFullScreen]);

  const cld = new Cloudinary({
    cloud: {
      cloudName: "anky",
    },
  });

  useEffect(() => {
    // Function to check the screen size and update the state
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768); // 768px is a common breakpoint for mobile devices
    };

    // Check the screen size on initial render
    checkScreenSize();

    // Add event listener for window resize
    window.addEventListener("resize", checkScreenSize);

    // Clean up the event listener
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID}
      onSuccess={handleLogin}
      config={{
        embeddedWallets: {
          noPromptOnSignature: true,
        },
        loginMethods: ["wallet"],
        appearance: {
          theme: "dark",
          accentColor: "#364CAC",
          logo: "",
        },
        embeddedWallets: {
          createOnLogin: "users-without-wallets",
        },
      }}
    >
      <PrivyWagmiConnector wagmiChainsConfig={configureChainsConfig}>
        <main
          className={`${righteous.className} flex flex-col h-screen w-screen`}
        >
          <NavbarComponent />
          {isMobile ? (
            <MobileApp
              {...pageProps}
              setEthBalance={setEthBalance}
              ethBalance={ethBalance}
              setDisplayFullScreen={setDisplayFullScreen}
            />
          ) : (
            <DesktopApp
              {...pageProps}
              ethBalance={ethBalance}
              setEthBalance={setEthBalance}
              setDisplayFullScreen={setDisplayFullScreen}
            />
          )}
        </main>
        {displayFullScreen && (
          <div className="fixed inset-0 z-50 flex flex-col justify-center items-center bg-black p-2 overflow-y-auto">
            <button
              onClick={() => setDisplayFullScreen(null)}
              className="absolute top-4 right-4 text-white text-4xl leading-none z-50"
            >
              &times;
            </button>
            <div className="relative p-4 w-full aspect-square md:w-96">
              <Image
                src={`/images/${displayFullScreen.number}.png`}
                alt="Full Screen Content"
                fill
              />
            </div>
            <p className="text-white">{displayFullScreen.name}</p>
          </div>
        )}
      </PrivyWagmiConnector>
    </PrivyProvider>
  );
}
