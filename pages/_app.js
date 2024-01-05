import "bootstrap/dist/css/bootstrap.min.css";
import "/styles/globals.css";
import { useState, useEffect } from "react";
import { PrivyProvider } from "@privy-io/react-auth";
import DesktopApp from "../components/DesktopApp";
import MobileApp from "../components/MobileApp";
import Image from "next/image";
import metadata from "../lib/metadata.json";
import { PrivyWagmiConnector } from "@privy-io/wagmi-connector";
import FullScreenAnkyView from "../components/FullScreenAnkyView";
import { mainnet } from "wagmi/chains";
import { configureChains, createConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";

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

export default function App({ Component, pageProps }) {
  const [isMobile, setIsMobile] = useState(false);
  const [displayFullScreenIndex, setDisplayFullScreenIndex] = useState(null);
  const [mintingError, setMintingError] = useState("");

  const setDisplayFullScreen = (index) => {
    setDisplayFullScreenIndex(index);
  };

  const changeAnky = (direction) => {
    console.log("the direction is: ", direction, displayFullScreenIndex.index);
    let newIndex = displayFullScreenIndex.index + direction;
    console.log("the new index is: ", newIndex);
    const maxIndex = metadata.length - 1;
    if (newIndex < 0) {
      newIndex = maxIndex;
    } else if (newIndex > maxIndex) {
      newIndex = 0;
    }
    setDisplayFullScreenIndex(metadata[newIndex]);
  };

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (displayFullScreenIndex !== null) {
        if (event.key === "Escape") {
          setDisplayFullScreenIndex(null);
        } else if (event.key === "ArrowRight") {
          changeAnky(1);
        } else if (event.key === "ArrowLeft") {
          changeAnky(-1);
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [displayFullScreenIndex]);

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
          <DesktopApp
            {...pageProps}
            mintingError={mintingError}
            setMintingError={setMintingError}
            setDisplayFullScreenIndex={setDisplayFullScreenIndex}
          />
          {displayFullScreenIndex !== null && (
            <FullScreenAnkyView
              anky={metadata[displayFullScreenIndex.index]}
              onClose={() => setDisplayFullScreenIndex(null)}
              onNext={() => changeAnky(1)}
              onPrevious={() => changeAnky(-1)}
            />
          )}
        </main>
      </PrivyWagmiConnector>
    </PrivyProvider>
  );
}
