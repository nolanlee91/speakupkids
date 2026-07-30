"use client";

import { useState } from "react";

const STK = "/assets/images/stickers/";

export function StickerArt({ id, emoji }: { id: string; emoji: string }) {
  const [err, setErr] = useState(false);
  return err ? <span className="sticker-emoji">{emoji}</span>
    : <img className="sticker-img" src={`${STK}${id}.webp`} alt="" onError={() => setErr(true)} />;
}
