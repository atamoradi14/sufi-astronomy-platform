#!/usr/bin/env bash
# Put a reel's cover image at the very start of the video, so Instagram uses it as the thumbnail.
# The cover is fully visible from frame 0 until 1.0 s (well past the 0.5 s minimum),
# then crossfades into the reel over 0.4 s.
# Usage: prepend_cover.sh cover.png reel.mp4 out.mp4
set -euo pipefail
cover=$1; reel=$2; out=$3
ffmpeg -v error -y -loop 1 -framerate 30 -t 1.4 -i "$cover" -i "$reel" \
  -f lavfi -i anullsrc=r=44100:cl=stereo \
  -filter_complex "[0:v]scale=1080:1920,setsar=1,format=yuv420p,fps=30[c];[1:v]scale=1080:1920,setsar=1,format=yuv420p,fps=30[v];[c][v]xfade=transition=fade:duration=0.4:offset=1.0[out]" \
  -map "[out]" -map 2:a -shortest -c:v libx264 -preset slow -crf 18 -profile:v high \
  -pix_fmt yuv420p -c:a aac -b:a 128k -movflags +faststart "$out"
# Check: the first frame must be the cover.
ffmpeg -v error -y -ss 0 -i "$out" -frames:v 1 "${out%.mp4}-frame0.png"
echo "Wrote $out — open ${out%.mp4}-frame0.png and confirm it shows the cover."
