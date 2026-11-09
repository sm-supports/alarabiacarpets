"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useI18n } from "@/i18n/LocaleProvider";

/** Catalog photos: the sized copies under /img/ (src/lib/card-image.ts). Logos keep the browser's own fallback. */
const PHOTO = "img[src^='/img/']";

/** What failed: a photo, a video (its poster stays), or a video's poster (the video can still play). */
type Kind = "image" | "video" | "poster";

/**
 * S16 for photos and videos: one that fails becomes a named tile, its alt text over
 * "Image unavailable", in the photo's own box, so nothing on the page moves and the
 * visitor still knows what was there. A video keeps its poster and gets the same words
 * as a band across its top, clear of the controls.
 *
 * It renders nothing: one capture listener on the document covers every image and video
 * on every page, so no page carries a tile in its HTML. An image can fail before React
 * runs, when no listener can hear it, so it also looks at every catalog photo once
 * hydrated and after each navigation: complete with no width means it failed. A lazy
 * photo that hasn't come into view isn't complete yet; its error, if any, comes later.
 *
 * The tile is a sibling of the image, placed over it, rather than a React element: the
 * component that renders the image needs no state for it. Coming back online, every
 * failed one is asked for again, and its tile goes when it loads.
 */
export default function ImageFallback() {
  const pathname = usePathname();
  const { t } = useI18n();
  const scan = useRef<() => void>(() => {});

  useEffect(() => {
    const words = t.common;
    const tiles = new Map<HTMLElement, { tile: HTMLElement; kind: Kind }>();
    // The poster each video was last checked with.
    const probed = new WeakMap<HTMLVideoElement, string>();
    // The tile follows the image's box: a rotation or a breakpoint resizes it.
    const resized = new ResizeObserver((entries) => {
      for (const entry of entries) place(entry.target as HTMLElement);
    });

    function place(element: HTMLElement) {
      const held = tiles.get(element);
      if (!held) return;
      if (!element.isConnected) {
        drop(element);
        return;
      }
      const style = held.tile.style;
      style.top = `${element.offsetTop}px`;
      style.left = `${element.offsetLeft}px`;
      style.width = `${element.offsetWidth}px`;
      if (held.kind === "image") style.height = `${element.offsetHeight}px`;
      style.borderRadius = getComputedStyle(element).borderRadius;
    }

    function drop(element: HTMLElement) {
      const held = tiles.get(element);
      if (!held) return;
      tiles.delete(element);
      resized.unobserve(element);
      const host = held.tile.parentElement;
      held.tile.remove();
      element.removeAttribute("data-imgx");
      if (host?.hasAttribute("data-imgx-host") && !host.querySelector(":scope > .imgx")) host.removeAttribute("data-imgx-host");
    }

    function mark(element: HTMLElement, kind: Kind) {
      const held = tiles.get(element);
      if (held?.kind === kind) {
        place(element);
        return;
      }
      if (held) drop(element);
      const host = element.parentElement;
      if (!host) return;
      const tile = document.createElement("span");
      tile.className = kind === "image" ? "imgx" : "imgx imgx-v";
      // The image keeps its alt text for screen readers; the tile is what it looks like.
      tile.setAttribute("aria-hidden", "true");
      // The page's direction, even inside the product card's left-to-right slide track.
      tile.dir = document.documentElement.dir || "ltr";
      const name = (element instanceof HTMLImageElement ? element.alt : (element.getAttribute("aria-label") ?? "")).trim();
      if (name) {
        const line = document.createElement("span");
        line.className = "imgx-n";
        line.textContent = name;
        tile.append(line);
      }
      const note = document.createElement("span");
      note.className = "imgx-u";
      note.textContent = kind === "video" ? words.videoUnavailable : words.imageUnavailable;
      tile.append(note);
      // The tile is measured against the parent, so the parent is what it is placed in.
      if (getComputedStyle(host).position === "static") host.setAttribute("data-imgx-host", "");
      if (kind === "image") element.setAttribute("data-imgx", "");
      element.after(tile);
      tiles.set(element, { tile, kind });
      place(element);
      resized.observe(element);
    }

    // A poster fires no event of its own. A second request for it answers from the
    // browser's cache when it loaded, and fails when it didn't.
    function checkPoster(video: HTMLVideoElement) {
      const poster = video.getAttribute("poster");
      if (!poster?.startsWith("/img/") || probed.get(video) === poster) return;
      probed.set(video, poster);
      const probe = new Image();
      probe.onload = () => {
        if (tiles.get(video)?.kind === "poster") drop(video);
      };
      probe.onerror = () => {
        if (video.isConnected && video.getAttribute("poster") === poster && !tiles.has(video)) mark(video, "poster");
      };
      probe.src = poster;
    }

    scan.current = () => {
      for (const element of [...tiles.keys()]) if (!element.isConnected) drop(element);
      for (const image of document.querySelectorAll<HTMLImageElement>(PHOTO)) {
        if (image.complete && image.naturalWidth === 0) mark(image, "image");
      }
      for (const video of document.querySelectorAll("video")) {
        if (video.error) mark(video, "video");
        else checkPoster(video);
      }
    };

    const onError = (event: Event) => {
      const target = event.target;
      if (target instanceof HTMLImageElement) {
        if (target.matches(PHOTO)) mark(target, "image");
      } else if (target instanceof HTMLVideoElement) {
        mark(target, "video");
      } else if (target instanceof HTMLSourceElement && target.parentElement instanceof HTMLVideoElement) {
        mark(target.parentElement, "video");
      }
    };
    const onLoad = (event: Event) => {
      if (event.target instanceof HTMLImageElement && tiles.has(event.target)) drop(event.target);
    };
    // A video that plays needs neither its tile nor its poster.
    const onPlaying = (event: Event) => {
      if (event.target instanceof HTMLVideoElement && tiles.has(event.target)) drop(event.target);
    };
    const onOnline = () => {
      for (const [element, { kind }] of [...tiles]) {
        if (!element.isConnected) {
          drop(element);
        } else if (element instanceof HTMLImageElement) {
          // Setting either attribute, even to the same value, fetches the image again.
          const srcset = element.getAttribute("srcset");
          if (srcset !== null) element.setAttribute("srcset", srcset);
          const src = element.getAttribute("src");
          if (src !== null) element.setAttribute("src", src);
        } else if (element instanceof HTMLVideoElement) {
          if (kind === "poster") {
            const poster = element.getAttribute("poster");
            probed.delete(element);
            if (poster) {
              element.removeAttribute("poster");
              element.setAttribute("poster", poster);
            }
            checkPoster(element);
          } else {
            // Back to its poster, ready to play: a failure next time brings the tile back.
            drop(element);
            element.load();
          }
        }
      }
    };

    // Capture: load and error don't bubble, and a capture listener hears every element's.
    document.addEventListener("error", onError, true);
    document.addEventListener("load", onLoad, true);
    document.addEventListener("playing", onPlaying, true);
    window.addEventListener("online", onOnline);
    return () => {
      document.removeEventListener("error", onError, true);
      document.removeEventListener("load", onLoad, true);
      document.removeEventListener("playing", onPlaying, true);
      window.removeEventListener("online", onOnline);
      for (const element of [...tiles.keys()]) drop(element);
      resized.disconnect();
      scan.current = () => {};
    };
  }, [t]);

  // After the listeners above, so nothing can fail between the look and the listening.
  useEffect(() => {
    scan.current();
  }, [pathname]);

  return null;
}
