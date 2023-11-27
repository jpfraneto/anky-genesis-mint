import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import '../styles/globals.css';
import { Rubik, Righteous } from 'next/font/google';
import Head from 'next/head';
import Modal from 'react-modal';
import { PrivyProvider } from '@privy-io/react-auth';
import { PrivyWagmiConnector } from '@privy-io/wagmi-connector';
import { mainnet } from '@wagmi/chains';
import ErrorBoundary from '../components/ErrorBoundary';
import { configureChains, createConfig } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';

import { Network, Alchemy } from 'alchemy-sdk';

const configureChainsConfig = configureChains([mainnet], [publicProvider()]);

const settings = {
  apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
  network: Network.Ethereum,
};

const rubik = Rubik({ subsets: ['latin'] });
const righteous = Righteous({ subsets: ['latin'], weight: ['400'] });

Modal.setAppElement('#__next');

function MyApp({ Component, pageProps }) {
  const [musicOn, setMusicOn] = useState(null);
  const [musicVolume, setMusicVolume] = useState(1.0);
  const [audioFiles, setAudioFiles] = useState([]);
  const [modalOpen, setModalOpen] = useState(true);
  const [alreadyOpened, setAlreadyOpened] = useState(false);

  useEffect(() => {
    if (musicOn) {
      const audio = new Audio('/assets/music/1.mp3');
      audio.play();
      const nextAudioFiles = [audio];
      for (let i = 2; i <= 5; i++) {
        const nextAudio = new Audio(`/assets/music/${i}.mp3`);
        nextAudioFiles.push(nextAudio);
        nextAudioFiles[i - 2].addEventListener('ended', function () {
          nextAudioFiles[i - 1].play();
        });
      }
      setAudioFiles(nextAudioFiles);
    } else if (audioFiles.length) {
      audioFiles.forEach(audio => audio.pause());
      setAudioFiles([]);
    }
  }, [musicOn]);

  const handleLogin = async user => {
    console.log('the user is logged in', user);
  };

  const changeVolumeGradually = (start, end, step, delay) => {
    let currentVolume = start;
    return new Promise(resolve => {
      const intervalId = setInterval(() => {
        currentVolume += step;
        if (
          (step > 0 && currentVolume >= end) ||
          (step < 0 && currentVolume <= end)
        ) {
          clearInterval(intervalId);
          resolve();
        } else {
          console.log('vamo vamo');
          setMusicVolume(currentVolume);
        }
      }, delay);
    });
  };

  const onVideoPlay = async () => {
    await changeVolumeGradually(musicVolume, 0.1, -0.01, 100);
  };

  const onVideoStop = async () => {
    await changeVolumeGradually(musicVolume, 1.0, 0.1, 100);
  };

  useEffect(() => {
    // set the volume of the music tracks
    audioFiles.forEach(audio => (audio.volume = musicVolume));
  }, [musicVolume]);

  return (
    <ErrorBoundary>
      <Head>
        <title>anky genesis</title>
      </Head>
      <PrivyProvider
        appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID}
        onSuccess={handleLogin}
        config={{
          embeddedWallets: {
            noPromptOnSignature: true,
          },
          loginMethods: ['email', 'wallet'],
          appearance: {
            theme: 'dark',
            accentColor: '#364CAC',
            logo: '',
          },
          embeddedWallets: {
            createOnLogin: 'users-without-wallets',
          },
        }}
      >
        <PrivyWagmiConnector wagmiChainsConfig={configureChainsConfig}>
          <main className={`${righteous.className} h-full`}>
            <Navbar
              musicVolume={musicVolume}
              changeVolumeGradually={changeVolumeGradually}
            />
            <Component
              {...pageProps}
              onVideoPlay={onVideoPlay}
              onVideoStop={onVideoStop}
            />
          </main>
        </PrivyWagmiConnector>
      </PrivyProvider>
    </ErrorBoundary>
  );
}

export default MyApp;
