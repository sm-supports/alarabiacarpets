#!/bin/bash
# Encodes Home's hero background loop (public/video/, see docs/media-credits.md).
# Needs ffmpeg (brew install ffmpeg) and the repo's node_modules (sharp, for the WebP posters).
# Run it from the repo root:
#
#   bash scripts/encode-hero-video.sh <source.mp4> <scratch-out-dir> <hash8>
#
# <hash8> is the first 8 hex characters of `shasum -a 256 <source.mp4>`. /video/* is served
# immutable, so a new clip must get new names. Copy hero-<hash8>-{wide,phone}.{webm,mp4,webp}
# into public/video/, update the names in HeroSection.tsx and HeroVideo.tsx, and delete the old
# files. START, END and the phone crop below were chosen for Pexels 7407016; pick them again for
# a new clip.
# Targets: wide webm <= 0.9 MB, mp4 <= 1.4 MB; phone each <= 0.5 MB. The wide poster must stay
# above about 0.06 bits per pixel at 2560x1376. Below that, Chrome treats it as a placeholder,
# and the later video frame becomes the page's LCP.
#
# The loop is source [START, END] with the last XF seconds dissolved into the first XF, so the
# loop's last frame flows into its first.
set -euo pipefail
SRC="$1"; OUT="$2"; H="$3"
WM=30; WW=42; PM=30; PW=42   # CRF: wide mp4, wide webm, phone mp4, phone webm
START=0.0; END=18.5; XF=1.0
T=$(echo "$END - $START" | bc); OFF=$(echo "$T - 2*$XF" | bc)
mkdir -p "$OUT"
loop() { # $1 = per-size filter, $2 = near-lossless intermediate
  ffmpeg -v error -y -i "$SRC" -an -filter_complex "
    [0:v]trim=start=$START:end=$END,setpts=PTS-STARTPTS,fps=25,$1,split[a][b];
    [a]trim=start=$XF,setpts=PTS-STARTPTS[A];
    [b]trim=end=$XF,setpts=PTS-STARTPTS[B];
    [A][B]xfade=transition=fade:duration=$XF:offset=$OFF,format=yuv420p[v]" \
    -map "[v]" -c:v libx264 -crf 10 -preset fast "$2"
}
# Wide keeps the source's 1.9:1 frame. Phone is a 3:4 crop around the sofa and the person.
loop "scale=1280:-2,gblur=sigma=1.1" "$OUT/int-wide.mp4"
loop "crop=810:1080:640:0,scale=540:720,gblur=sigma=0.9" "$OUT/int-phone.mp4"

x264() { ffmpeg -v error -y -i "$1" -an -c:v libx264 -profile:v main -preset veryslow -crf "$2" \
  -pix_fmt yuv420p -g 50 -movflags +faststart "$3"; }
vp9() { ffmpeg -v error -y -i "$1" -an -c:v libvpx-vp9 -b:v 0 -crf "$2" -row-mt 1 -deadline good \
  -cpu-used 1 -g 50 -pix_fmt yuv420p "$3"; }

x264 "$OUT/int-wide.mp4" "$WM" "$OUT/hero-$H-wide.mp4"
vp9 "$OUT/int-wide.mp4" "$WW" "$OUT/hero-$H-wide.webm"
x264 "$OUT/int-phone.mp4" "$PM" "$OUT/hero-$H-phone.mp4"
vp9 "$OUT/int-phone.mp4" "$PW" "$OUT/hero-$H-phone.webm"

# Posters: the loop's first frame. This ffmpeg build has no WebP encoder, so sharp makes them.
ffmpeg -v error -y -i "$OUT/int-wide.mp4" -frames:v 1 "$OUT/poster-wide.png"
ffmpeg -v error -y -i "$OUT/int-phone.mp4" -frames:v 1 "$OUT/poster-phone.png"
OUT_DIR="$OUT" HASH="$H" node -e '
const sharp = require("sharp");
const { OUT_DIR: o, HASH: h } = process.env;
Promise.all([["wide", 85], ["phone", 60]].map(([k, q]) =>
  sharp(`${o}/poster-${k}.png`).webp({ quality: q, effort: 6 }).toFile(`${o}/hero-${h}-${k}.webp`)));'
ls -l "$OUT"/hero-"$H"-*
