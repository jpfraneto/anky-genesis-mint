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
            {!modalOpen && (
              <>
                <Navbar
                  musicVolume={musicVolume}
                  changeVolumeGradually={changeVolumeGradually}
                />
                <Component
                  {...pageProps}
                  onVideoPlay={onVideoPlay}
                  onVideoStop={onVideoStop}
                />
              </>
            )}

            {!alreadyOpened && (
              <Modal
                isOpen={modalOpen}
                onRequestClose={() => setModalOpen(false)}
                contentLabel='Music Modal'
                className={`${righteous.className} flex items-center justify-center fixed inset-0 z-50 outline-none focus:outline-none`}
                overlayClassName='fixed inset-0 bg-black opacity-100 z-40'
              >
                <div className='relative w-auto mx-auto max-w-3xl'>
                  <div className='border-0 rounded-lg shadow-lg relative p-6 flex flex-col w-full bg-white dark:bg-gray-800 outline-none focus:outline-none'>
                    <h1
                      className='font-extrabold text-transparent mt-4 mb-2 w-fit text-4xl bg-clip-text'
                      style={{
                        background:
                          'linear-gradient(to right, red, orange, yellow, green, blue, indigo, violet, white)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                    >
                      welcome to the ankyverse
                    </h1>

                    <div className='relative  flex-auto'>
                      <p className='mt-2 mb-4 text-gray-400 text-lg leading-relaxed'>
                        This world is a sensorial experience, and it all starts
                        with sound. Do you want to navigate the journey through
                        this website using music? (highly recommended).
                      </p>
                    </div>
                    <div className='flex space-x-2'>
                      <button
                        className='bg-green-500 text-white active:bg-green-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 hover:opacity-70'
                        type='button'
                        onClick={() => {
                          setAlreadyOpened(true);
                          setMusicOn(true);
                          setModalOpen(false);
                        }}
                      >
                        Yes
                      </button>
                      <button
                        className='text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 hover:opacity-70'
                        type='button'
                        onClick={() => {
                          setMusicOn(false);
                          setModalOpen(false);
                        }}
                      >
                        No
                      </button>
                    </div>
                    <small className='mt-4 text-gray-400'>
                      (The album is called Collected Dream Fragments, by
                      Hypnagog. I asked him to use his music here, as a way of
                      honoring is life path. His journey is also the one of
                      Anky, and his music represents it with mastery.)
                    </small>
                  </div>
                </div>
              </Modal>
            )}
          </main>
        </PrivyWagmiConnector>
      </PrivyProvider>
    </ErrorBoundary>
  );
}

export default MyApp;
