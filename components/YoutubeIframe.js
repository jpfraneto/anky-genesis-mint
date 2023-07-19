import React, { useState, useEffect, useCallback, useRef } from 'react';

const YoutubeIframe = props => {
  const { videoId, title, onVideoPlay, onVideoStop } = props;
  const videoURL = `https://www.youtube.com/embed/${videoId}?enablejsapi=1`;
  const iframeRef = useRef(null);
  const defaultHeight = 495;
  const [videoHeight, setVideoHeight] = useState(
    iframeRef.current ? iframeRef.current.offsetWidth * 0.5625 : defaultHeight
  );

  const handleChangeVideoWidth = useCallback(() => {
    const ratio =
      window.innerWidth > 990
        ? 1.0
        : window.innerWidth > 522
        ? 1.2
        : window.innerWidth > 400
        ? 1.45
        : 1.85;
    const height = iframeRef.current
      ? iframeRef.current.offsetWidth * 0.5625
      : defaultHeight;
    return setVideoHeight(Math.floor(height * ratio));
  }, []);

  // This function creates an <iframe> (and YouTube player)
  // after the API code downloads.
  function onYouTubeIframeAPIReady() {
    new window.YT.Player(iframeRef.current, {
      videoId: videoId,
      playerVars: { autoplay: 0 },
      events: {
        onStateChange: onPlayerStateChange,
      },
    });
  }

  // when the player is ready, bind events to the music player
  useEffect(() => {
    // If not, load the script asynchronously
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    } else {
      // if youtube iframe api is already available
      onYouTubeIframeAPIReady();
    }
  }, []);

  // event.data == 1 (started playing), notify the parent component to decrease volume
  // event.data == 2 (paused) or event.data == 0 (ended), notify the parent component to increase volume
  function onPlayerStateChange(event) {
    if (event.data == window.YT.PlayerState.PLAYING) {
      onVideoPlay();
    } else if (
      event.data == window.YT.PlayerState.PAUSED ||
      event.data == window.YT.PlayerState.ENDED
    ) {
      onVideoStop();
    }
  }

  useEffect(() => {
    window.addEventListener('resize', handleChangeVideoWidth);
    const ratio =
      window.innerWidth > 990
        ? 1.0
        : window.innerWidth > 522
        ? 1.2
        : window.innerWidth > 400
        ? 1.45
        : 1.85;
    const height = iframeRef.current
      ? iframeRef.current.offsetWidth * 0.5625
      : defaultHeight;
    setVideoHeight(Math.floor(height * ratio));
    return function cleanup() {
      window.removeEventListener('resize', handleChangeVideoWidth);
    };
  }, [videoHeight, handleChangeVideoWidth]);

  return (
    <iframe
      ref={iframeRef}
      id='youtube-player' // need an id to bind the Youtube Player
      title={title}
      width='100%'
      height={`${videoHeight}px`}
      src={videoURL}
      frameBorder='0'
      allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
      allowFullScreen
    />
  );
};

export default YoutubeIframe;
