"use client";

import type { AppState } from "@/lib/state";
import { claimClubhouseItem } from "@/lib/state";
import {
  CLUBHOUSE_ITEMS, clubhouseActivityTotal, clubhouseChoices,
  clubhouseRewardReady, nextClubhouseMilestone,
} from "@/lib/clubhouse";
import { celebrate, speak } from "@/lib/fx";

const ROOM = "/assets/images/clubhouse/maple-clubhouse-room.webp";

export function Clubhouse({
  state, setState, onClose,
}: {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
  onClose: () => void;
}) {
  const got = new Set(state.clubhouse.unlockedItemIds);
  const choices = clubhouseChoices(state);
  const activity = clubhouseActivityTotal(state);
  const next = nextClubhouseMilestone(state);

  function choose(id: string) {
    setState((s) => claimClubhouseItem(s, id));
    celebrate(state.prefs.motion !== false);
  }

  return (
    <div className="clubhouse-overlay" role="dialog" aria-modal="true" aria-label="Maple Clubhouse">
      <header className="clubhouse-top">
        <button className="bk" onClick={onClose}>← Đóng</button>
        <div>
          <h2>Maple Clubhouse</h2>
          <p>Căn phòng lưu dấu hành trình học</p>
        </div>
        <span className="clubhouse-count">{got.size}/{CLUBHOUSE_ITEMS.length} món</span>
      </header>

      <main className="clubhouse-main">
        <section className="clubhouse-room" aria-label="Căn phòng của bé">
          <img className="clubhouse-bg" src={ROOM} alt="Căn phòng Clubhouse nhìn ra Vancouver" />
          <div className="clubhouse-glow" aria-hidden="true" />
          {CLUBHOUSE_ITEMS.map((item) => got.has(item.id) && (
            <button
              key={item.id}
              className="clubhouse-item"
              style={{
                left: `${item.x}%`, top: `${item.y}%`,
                transform: `translate(-50%, -50%) scale(${item.scale || 1})`,
                zIndex: item.z || 1,
              }}
              onClick={() => speak(item.en, state.prefs.accent, .82)}
              aria-label={`${item.en} — ${item.vi}. Chạm để nghe.`}
            >
              <span>{item.emoji}</span>
              <i>{item.en}</i>
            </button>
          ))}
          {got.size === 0 && (
            <div className="clubhouse-empty">
              <b>Clubhouse đang chờ những kỷ niệm đầu tiên!</b>
              <span>Hoàn thành một hoạt động để mở món đồ đầu tiên.</span>
            </div>
          )}
        </section>

        {clubhouseRewardReady(state) && choices.length > 0 ? (
          <section className="clubhouse-reward">
            <div className="cr-kicker">🎁 PHẦN THƯỞNG MỚI</div>
            <h3>Chọn một món cho Clubhouse</h3>
            <p>Món còn lại không mất — bé vẫn có thể nhận ở mốc sau.</p>
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
              <b>{got.size === CLUBHOUSE_ITEMS.length ? "Clubhouse đã đủ bộ!" : "Tiến tới món quà tiếp theo"}</b>
              <span>{got.size === CLUBHOUSE_ITEMS.length ? "Chạm từng món để nghe tên tiếng Anh." : `${activity}/${next || activity} hoạt động hoàn thành`}</span>
            </div>
            {next && <div className="chp-bar"><i style={{ width: `${Math.min(100, Math.round((activity / next) * 100))}%` }} /></div>}
          </section>
        )}

        {got.size > 0 && (
          <section className="clubhouse-inventory">
            <h3>Bộ sưu tập trong phòng</h3>
            <div>
              {CLUBHOUSE_ITEMS.map((item) => (
                <button
                  key={item.id}
                  className={got.has(item.id) ? "on" : ""}
                  disabled={!got.has(item.id)}
                  onClick={() => speak(item.en, state.prefs.accent, .82)}
                >
                  <span>{got.has(item.id) ? item.emoji : "?"}</span>
                  <small>{got.has(item.id) ? item.en : "Chưa mở"}</small>
                </button>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
