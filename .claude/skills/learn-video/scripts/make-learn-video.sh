#!/usr/bin/env bash
# Dựng clip mở cảnh cho bài Learn: narration giọng nữ + ducking nền + encode web.
# Chạy: bash make-learn-video.sh --src <video> --text "<câu narration>" --out <file .mp4>
set -euo pipefail

SRC=""; TEXT=""; OUT=""
VOICE="en-CA-ClaraNeural"; RATE="-10%"; START="0.8"; DUCK="0.27"; CRF="26"
KEEP_TEMP=0; NO_NARRATION=0

while [ $# -gt 0 ]; do
  case "$1" in
    --src) SRC="$2"; shift 2 ;;
    --text) TEXT="$2"; shift 2 ;;
    --out) OUT="$2"; shift 2 ;;
    --voice) VOICE="$2"; shift 2 ;;
    --rate) RATE="$2"; shift 2 ;;
    --start) START="$2"; shift 2 ;;
    --duck) DUCK="$2"; shift 2 ;;
    --crf) CRF="$2"; shift 2 ;;
    --keep-temp) KEEP_TEMP=1; shift ;;
    --no-narration) NO_NARRATION=1; shift ;;
    -h|--help)
      sed -n '2,3p' "$0"; echo
      echo "Tuỳ chọn: --voice (mặc định en-CA-ClaraNeural) --rate (-10%) --start (0.8s)"
      echo "          --duck (0.27 = 27%) --crf (26) --keep-temp --no-narration"
      exit 0 ;;
    *) echo "Không hiểu tham số: $1" >&2; exit 2 ;;
  esac
done

[ -n "$SRC" ] && [ -n "$OUT" ] || { echo "Thiếu --src hoặc --out (xem --help)" >&2; exit 2; }
[ -f "$SRC" ] || { echo "Không thấy video nguồn: $SRC" >&2; exit 2; }
[ $NO_NARRATION -eq 1 ] || [ -n "$TEXT" ] || { echo "Thiếu --text (hoặc dùng --no-narration)" >&2; exit 2; }

command -v ffmpeg >/dev/null || { echo "Thiếu ffmpeg" >&2; exit 3; }
command -v python >/dev/null || { echo "Thiếu python" >&2; exit 3; }
if [ $NO_NARRATION -eq 0 ] && ! python -c "import edge_tts" 2>/dev/null; then
  echo "Thiếu edge-tts. Cài bằng: pip install edge-tts" >&2
  echo "(ĐỪNG thay bằng giọng SAPI/Windows mặc định — nghe như robot, không dùng cho bé.)" >&2
  exit 3
fi

TMP="$(mktemp -d)"
cleanup() { [ $KEEP_TEMP -eq 1 ] || rm -rf "$TMP"; }
trap cleanup EXIT

probe() { ffprobe -v error -select_streams "$1" -show_entries "$2" -of csv=p=0 "$3" 2>/dev/null | head -1; }

SRC_DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$SRC")
SRC_SIZE=$(stat -c%s "$SRC")
SRC_WH=$(probe v:0 stream=width,height "$SRC")
SRC_FPS=$(probe v:0 stream=r_frame_rate "$SRC")
SRC_VCODEC=$(probe v:0 stream=codec_name "$SRC")
SRC_ACODEC=$(probe a:0 stream=codec_name "$SRC")

echo "── NGUỒN ──────────────────────────────"
printf "  %s · %s · %s fps · %s/%s · %.2f MB · %.3fs\n" \
  "$(basename "$SRC")" "$SRC_WH" "$(python -c "print(round(eval('$SRC_FPS'),2))")" \
  "$SRC_VCODEC" "${SRC_ACODEC:-khong-co-audio}" \
  "$(python -c "print($SRC_SIZE/1048576)")" "$SRC_DUR"

mkdir -p "$(dirname "$OUT")"

if [ $NO_NARRATION -eq 1 ]; then
  FILTER="[0:a]anull[aout]"
  NARR_DUR=0
else
  echo "── NARRATION ──────────────────────────"
  echo "  giọng $VOICE · tốc độ $RATE"
  python -m edge_tts --voice "$VOICE" --rate="$RATE" --text "$TEXT" --write-media "$TMP/narr.mp3" >/dev/null
  NARR_DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$TMP/narr.mp3")
  END=$(python -c "print(round($START + $NARR_DUR, 3))")
  printf "  dài %.3fs · chèn %ss → %ss\n" "$NARR_DUR" "$START" "$END"
  python - "$END" "$SRC_DUR" <<'PY'
import sys
end, dur = float(sys.argv[1]), float(sys.argv[2])
if end > dur - 0.5:
    print(f"  ⚠️  Narration kết thúc {end:.2f}s, quá sát cuối clip ({dur:.2f}s).")
    print("     Rút ngắn câu, hoặc --rate=-0%, hoặc giảm --start.")
PY
  # Ducking có ramp: 0.2s hạ xuống trước khi đọc, 0.3s nâng lại sau khi đọc xong.
  UP=$(python -c "print(round(1-$DUCK,4))")
  D0=$(python -c "print(round($START-0.2,3))")
  E1=$(python -c "print(round($END+0.3,3))")
  DUCK_FILTER="[0:a]volume=volume='if(lt(t,$D0),1,if(lt(t,$START),1-$UP*(t-$D0)/0.20,if(lt(t,$END),$DUCK,if(lt(t,$E1),$DUCK+$UP*(t-$END)/0.30,1))))':eval=frame[bg]"
  MS=$(python -c "print(int($START*1000))")
  cat > "$TMP/mix.txt" <<EOF
$DUCK_FILTER;
[1:a]adelay=$MS|$MS,apad[nar];
[bg][nar]amix=inputs=2:duration=first:normalize=0[aout]
EOF
  # Bản chỉ-có-nền để bước kiểm tra đo được mức ducking mà không lẫn giọng đọc.
  printf '%s\n' "$DUCK_FILTER" > "$TMP/bgonly.txt"
  FILTER=""
fi

echo "── ENCODE ─────────────────────────────"
if [ $NO_NARRATION -eq 1 ]; then
  ffmpeg -y -hide_banner -loglevel error -i "$SRC" -filter_complex "$FILTER" -map 0:v -map "[aout]" \
    -c:v libx264 -preset slow -crf "$CRF" -pix_fmt yuv420p -profile:v high -level 4.0 \
    -c:a aac -b:a 96k -ar 48000 -ac 2 -shortest -movflags +faststart "$OUT"
else
  ffmpeg -y -hide_banner -loglevel error -i "$SRC" -i "$TMP/narr.mp3" \
    -filter_complex_script "$TMP/mix.txt" -map 0:v -map "[aout]" \
    -c:v libx264 -preset slow -crf "$CRF" -pix_fmt yuv420p -profile:v high -level 4.0 \
    -c:a aac -b:a 96k -ar 48000 -ac 2 -shortest -movflags +faststart "$OUT"
fi

# ── Kiểm tra: đừng tin cảm tính, đo thật ─────────────────────────────
OUT_SIZE=$(stat -c%s "$OUT")
SSIM=$(ffmpeg -hide_banner -i "$OUT" -i "$SRC" -lavfi ssim -f null - 2>&1 | grep -o "All:[0-9.]*" | tail -1 | cut -d: -f2)
FAST=$(python - "$OUT" <<'PY'
import sys
d = open(sys.argv[1], 'rb').read(500000)
moov, mdat = d.find(b'moov'), d.find(b'mdat')
print("OK" if 0 < moov < mdat else "CHƯA")
PY
)

echo "── KẾT QUẢ ────────────────────────────"
printf "  %s\n" "$OUT"
printf "  %.2f MB (nguồn %.2f MB) · SSIM %s · faststart %s\n" \
  "$(python -c "print($OUT_SIZE/1048576)")" "$(python -c "print($SRC_SIZE/1048576)")" "${SSIM:-n/a}" "$FAST"
printf "  %s · %s fps · %.3fs\n" "$(probe v:0 stream=width,height "$OUT")" \
  "$(python -c "print(round(eval('$(probe v:0 stream=r_frame_rate "$OUT")'),2))")" \
  "$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$OUT")"

if [ $NO_NARRATION -eq 0 ]; then
  # Đo nền ĐÃ ducking tách riêng (không lẫn giọng đọc) rồi so với nguồn cùng đoạn.
  ffmpeg -y -hide_banner -loglevel error -i "$SRC" \
    -filter_complex_script "$TMP/bgonly.txt" -map "[bg]" "$TMP/bg.wav" 2>/dev/null || true
  MID=$(python -c "print(round($START + $NARR_DUR/2 - 0.5, 3))")
  if [ -f "$TMP/bg.wav" ]; then
    B=$(ffmpeg -hide_banner -ss "$MID" -t 1 -i "$TMP/bg.wav" -af volumedetect -f null - 2>&1 | grep -o "mean_volume: [-0-9.]*" | cut -d' ' -f2)
    S=$(ffmpeg -hide_banner -ss "$MID" -t 1 -i "$SRC" -af volumedetect -f null - 2>&1 | grep -o "mean_volume: [-0-9.]*" | cut -d' ' -f2)
    printf "  ducking nền: %s dB → %s dB (mục tiêu %.0f%%)\n" "$S" "$B" "$(python -c "print($DUCK*100)")"
  fi
  echo "  ⚠️  NGHE THỬ file trước khi commit — script không nghe hộ được."
fi
