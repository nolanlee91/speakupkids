"use client";

import { useState } from "react";
import type { AppState } from "@/lib/state";
import { claimClubhouseItem } from "@/lib/state";
import {
  CLUBHOUSE_ITEMS, CLUBHOUSE_MILESTONES, SEASON_SOUVENIRS, clubhouseLearnTotal, clubhouseChoices,
  clubhouseRewardReady, earnedSeasonSouvenirs, nextClubhouseMilestone,
} from "@/lib/clubhouse";
import { STICKERS } from "@/lib/games";
import { BADGES, earnedBadges, keepsakeCount } from "@/lib/rewards";
import { celebrate, playSuccessSound, speak } from "@/lib/fx";
import { StickerArt } from "./reward-art";

const ROOM = "/assets/images/clubhouse/maple-clubhouse-room.webp";
const BDG = "/assets/images/badges/";

export function Clubhouse({
  state, setState, onClose,
}: {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
  onClose: () => void;
}) {
  const [tab, setTab] = useState<"room" | "journal">("room");
  const got = new Set(state.clubhouse.unlockedItemIds);
  const gotStickers = new Set(state.stickers || []);
  const souvenirs = earnedSeasonSouvenirs(state);
  const souvenirIds = new Set(souvenirs.map((item) => item.id));
  const roomItems = CLUBHOUSE_ITEMS.filter((item) => got.has(item.id));
  const choices = clubhouseChoices(state);
  const learned = clubhouseLearnTotal(state);
  const next = nextClubhouseMilestone(state);
  const badges = earnedBadges(state);
  const roomTarget = CLUBHOUSE_MILESTONES.length;

  function choose(id: string) {
    setState((s) => claimClubhouseItem(s, id));
    celebrate(state.prefs.motion !== false);
    playSuccessSound();
  }

  return (
    <div className="clubhouse-overlay" role="dialog" aria-modal="true" aria-label="Maple Clubhouse">
      <header className="clubhouse-top">
        <button className="bk" onClick={onClose}>← Đóng</button>
        <div>
          <h2>Maple Clubhouse</h2>
          <p>Căn phòng lưu dấu hành trình học</p>
        </div>
        <span className="clubhouse-count">{keepsakeCount(state)} kỷ vật</span>
      </header>

      <main className="clubhouse-main">
        <nav className="clubhouse-tabs" aria-label="Khu Clubhouse">
          <button className={tab === "room" ? "on" : ""} onClick={() => setTab("room")}>🏡 My Room</button>
          <button className={tab === "journal" ? "on" : ""} onClick={() => setTab("journal")}>📖 My Journal</button>
        </nav>

        {tab === "room" ? (
          <>
            <section className="clubhouse-room" aria-label="Căn phòng của bé">
              <img className="clubhouse-bg" src={ROOM} alt="Căn phòng Clubhouse nhìn ra Vancouver" />
              <div className="clubhouse-glow" aria-hidden="true" />
              <span className="clubhouse-dust dust-one" aria-hidden="true">✦</span>
              <span className="clubhouse-dust dust-two" aria-hidden="true">✦</span>
              <button className="clubhouse-maple" onClick={() => speak("Welcome to our clubhouse!", state.prefs.accent, .86)}>
                <img src="/assets/images/gen/maple-pose-cheer.webp" alt="Maple trong Clubhouse" />
                <span>Welcome! Chạm vào đồ vật nhé.</span>
              </button>
              {roomItems.map((item, index) => (
                <button
                  key={item.id}
                  className="clubhouse-item"
                  style={{
                    left: `${item.x}%`, top: `${item.y}%`,
                    transform: `translate(-50%, -50%) scale(${item.scale || 1})`,
                    zIndex: item.z || 1,
                    animationDelay: `${index * 90}ms`,
                  }}
                  onClick={() => speak(item.en, state.prefs.accent, .82)}
                  aria-label={`${item.en} — ${item.vi}. Chạm để nghe.`}
                >
                  <span>{item.emoji}</span>
                  <i>{item.en}</i>
                </button>
              ))}
              {roomItems.length === 0 && (
                <div className="clubhouse-empty">
                  <b>Clubhouse đang chờ kỷ vật đầu tiên!</b>
                  <span>Hoàn thành một Unit Learn để mở món đồ đầu tiên.</span>
                </div>
              )}
            </section>

            {clubhouseRewardReady(state) && choices.length > 0 ? (
              <section className="clubhouse-reward">
                <div className="cr-kicker">🎁 MỐC LEARN MỚI</div>
                <h3>Chọn một món trang trí</h3>
                <p>Món còn lại không mất — bé vẫn có thể nhận ở mốc Learn sau.</p>
                <div className="clubhouse-choices">
                  {choices.map((item) => (
                    <button key={item.id} onClick={() => choose(item.id)}>
                      <span className="cc-art">{item.emoji}</span>
                      <b>{item.en}</b>
                      <small>{item.vi}</small>
                      <em>{item.source}</em>
                      <strong>Chọn món này</strong>
                    </button>
                  ))}
                </div>
              </section>
            ) : (
              <section className="clubhouse-progress">
                <div>
                  <b>{next ? "Tiến tới món trang trí tiếp theo" : "Đã hoàn thành các mốc Learn hiện tại"}</b>
                  <span>{next ? `${learned}/${next} Unit Learn hoàn thành` : "Chạm từng món để nghe tên tiếng Anh."}</span>
                </div>
                {next && <div className="chp-bar"><i style={{ width: `${Math.min(100, Math.round((learned / next) * 100))}%` }} /></div>}
              </section>
            )}

            <section className="clubhouse-inventory">
              <h3>Kỷ vật đang trưng bày · {roomItems.length}/{roomTarget}</h3>
              <div>
                {roomItems.map((item) => (
                  <button key={item.id} className="on" onClick={() => speak(item.en, state.prefs.accent, .82)}>
                    <span>{item.emoji}</span><small>{item.en}</small>
                  </button>
                ))}
                {Array.from({ length: Math.max(0, roomTarget - roomItems.length) }, (_, i) => (
                  <button key={`locked-${i}`} disabled><span>?</span><small>Chưa mở</small></button>
                ))}
              </div>
            </section>
          </>
        ) : (
          <section className="keepsake-journal">
            <header>
              <div><span>📖</span><div><h3>My Journey Journal</h3><p>Kỷ vật dài hạn từ hành trình học cùng Maple</p></div></div>
              <strong>{keepsakeCount(state)} kỷ vật</strong>
            </header>

            <div className="journal-group">
              <div className="jg-head"><b>Sticker</b><span>Hoàn thành trọn một chủ đề Practice</span><em>{gotStickers.size}/{STICKERS.length}</em></div>
              <div className="sticker-slots">
                {STICKERS.map((sticker) => (
                  <div key={sticker.id} className={`slot ${gotStickers.has(sticker.id) ? "filled" : ""}`}>
                    <span className="slot-art">{gotStickers.has(sticker.id) ? <StickerArt id={sticker.id} emoji={sticker.emoji} /> : "?"}</span>
                    <span className="slot-name">{gotStickers.has(sticker.id) ? sticker.name : "Chưa mở"}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="journal-group">
              <div className="jg-head"><b>Huy hiệu</b><span>Những thành tích lớn đã đạt</span><em>{badges.length}/{BADGES.length}</em></div>
              <div className="journal-badges">
                {BADGES.map((badge) => (
                  <div key={badge.id} className={badge.has(state) ? "on" : ""}>
                    <img src={`${BDG}${badge.img}`} alt="" />
                    <b>{badge.has(state) ? badge.name : "Chưa mở"}</b>
                    <small>{badge.description}</small>
                  </div>
                ))}
              </div>
            </div>

            <div className="journal-group">
              <div className="jg-head"><b>Adventure Souvenirs</b><span>Mỗi season hoàn thành nhận đúng một kỷ vật</span><em>{souvenirs.length}/{SEASON_SOUVENIRS.length}</em></div>
              <div className="journal-souvenirs">
                {SEASON_SOUVENIRS.map((item) => (
                  <button key={item.id} className={souvenirIds.has(item.id) ? "on" : ""} disabled={!souvenirIds.has(item.id)}
                    onClick={() => speak(item.en, state.prefs.accent, .82)}>
                    <span>{souvenirIds.has(item.id) ? item.emoji : "?"}</span>
                    <b>{souvenirIds.has(item.id) ? item.en : `Season ${Number(item.seasonId.slice(1))}`}</b>
                    <small>{souvenirIds.has(item.id) ? item.vi : "Chưa hoàn thành"}</small>
                  </button>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
