"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Pause, Play } from "@/components/icons";
import { useI18n } from "@/i18n/LocaleProvider";
import { HERO_VIDEO, HERO_WIDE_QUERY } from "@/lib/hero-media";

/**
 * Home hero's background loop, over the poster HeroSection renders in the static HTML.
 *
 * Nothing here is in the static HTML, and nothing downloads before the page has loaded: the
 * video is created after the load event and an idle moment, so it never competes with the
 * first paint. It has the poster's box, never a larger one, so its first frame can't become a
 * later LCP than the poster (Chrome reports a new LCP only for a larger element).
 *
 * The visitor sees the poster only when they asked for less motion or less data, on a slow
 * connection (Chromium reports it; Safari doesn't), or when autoplay is refused (iOS Low Power
 * Mode): the button then offers Play, and a tap is allowed to start it. The button is required
 * by WCAG 2.2.2 (anything moving for over 5 s needs a way to stop it). A pause is remembered
 * in localStorage, and while paused the video isn't downloaded at all.
 */

const PAUSED_KEY = "hero-video-paused";

function readPaused() {
  try {
    return localStorage.getItem(PAUSED_KEY) === "1";
  } catch {
    return false;
  }
}

function writePaused(paused: boolean) {
  try {
    if (paused) localStorage.setItem(PAUSED_KEY, "1");
    else localStorage.removeItem(PAUSED_KEY);
  } catch {
    // Storage blocked: the choice lasts for this page only.
  }
}

type Connection = { saveData?: boolean; effectiveType?: string };

function motionAndDataAllowed() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  const connection = (navigator as Navigator & { connection?: Connection }).connection;
  if (connection?.saveData) return false;
  return !["slow-2g", "2g", "3g"].includes(connection?.effectiveType ?? "");
}

/** Runs `go` once the page has loaded and the main thread has a quiet moment. */
function afterLoadAndIdle(go: () => void) {
  let idle: number | undefined;
  let timer: ReturnType<typeof setTimeout> | undefined;
  const start = () => {
    if ("requestIdleCallback" in window) idle = window.requestIdleCallback(go, { timeout: 3000 });
    else timer = setTimeout(go, 1000);
  };
  if (document.readyState === "complete") start();
  else window.addEventListener("load", start, { once: true });
  return () => {
    window.removeEventListener("load", start);
    if (idle !== undefined) window.cancelIdleCallback(idle);
    clearTimeout(timer);
  };
}

export default function HeroVideo() {
  const { t } = useI18n();
  const video = useRef<HTMLVideoElement>(null);
  const [sources, setSources] = useState<readonly string[] | null>(null);
  const [userPaused, setUserPaused] = useState(false);
  const [onScreen, setOnScreen] = useState(true);
  const [pageVisible, setPageVisible] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [shown, setShown] = useState(false);

  useEffect(
    () =>
      afterLoadAndIdle(() => {
        if (!motionAndDataAllowed()) return;
        setUserPaused(readPaused());
        setSources(window.matchMedia(HERO_WIDE_QUERY).matches ? HERO_VIDEO.wide : HERO_VIDEO.phone);
      }),
    []
  );

  // Pause while the hero is scrolled away or the tab is hidden; resume on return.
  useEffect(() => {
    const element = video.current;
    if (!sources || !element) return;
    const observer = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting));
    observer.observe(element);
    const onVisibility = () => setPageVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [sources]);

  useEffect(() => {
    const element = video.current;
    if (!sources || !element) return;
    if (userPaused || !onScreen || !pageVisible) {
      element.pause();
      return;
    }
    // Set in JavaScript as well: React renders `muted` as a property only, and autoplay
    // policies check the element is muted.
    element.muted = true;
    element.play().catch(() => {
      // Autoplay refused (iOS Low Power Mode) or the file failed: the poster stays.
    });
  }, [sources, userPaused, onScreen, pageVisible]);

  // Called from the click itself, so play() counts as the visitor's gesture.
  const toggle = useCallback(() => {
    const element = video.current;
    if (!element) return;
    if (playing) {
      setUserPaused(true);
      writePaused(true);
      element.pause();
    } else {
      setUserPaused(false);
      writePaused(false);
      element.muted = true;
      element.play().catch(() => {});
    }
  }, [playing]);

  if (!sources) return null;

  return (
    <>
      <video
        ref={video}
        className={shown ? "hero-video is-on" : "hero-video"}
        muted
        loop
        playsInline
        disablePictureInPicture
        preload={userPaused ? "none" : "auto"}
        aria-hidden="true"
        tabIndex={-1}
        onPlaying={() => {
          setPlaying(true);
          setShown(true);
        }}
        onPause={() => setPlaying(false)}
      >
        {sources.map((src) => (
          <source key={src} src={src} type={src.endsWith(".webm") ? "video/webm" : "video/mp4"} />
        ))}
      </video>
      <button
        type="button"
        className="hero-pause"
        onClick={toggle}
        aria-label={playing ? t.hero.pauseVideo : t.hero.playVideo}
      >
        {playing ? <Pause /> : <Play />}
      </button>
    </>
  );
}
