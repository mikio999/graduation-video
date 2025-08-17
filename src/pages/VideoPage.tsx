import { useEffect, useRef, useState } from "react";
import { useSearchParams, Navigate, Link } from "react-router-dom";
import Confetti from "react-confetti";
import { useElementSize } from "../hooks/useElementSize";

export default function VideoPage() {
  const [sp] = useSearchParams();
  const name = (sp.get("name") ?? "").trim();
  const displayName = name || "스프린터";

  const { ref: wrapRef, size } = useElementSize<HTMLDivElement>();
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [t, setT] = useState(0);           // 현재 재생 시간(초)
  const [confettiOn, setConfettiOn] = useState(false);

  // 페이지 진입 시 자동재생만
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.play().catch(() => {});
  }, []);

  if (!name) return <Navigate to="/" replace />;

  // 자막 스위칭 로직
  let caption = "";
  if (t >= 0 && t < 2) {
    caption = "음.. 이렇게 해서..";
  } else if (t >= 7 && t < 9) {
    caption = `${displayName}님께 수료증을 드립니다.`;
  } else if (t >= 9 && t < 10) {
    caption = `(코드잇 일동) 와아아아`;
  } else if (t >= 10) {
    caption = `코드잇 스프린트 수료를 축하합니다 ${displayName}님!!`
  }
  
  else {
    caption = ""; // 그 외 구간 비움(원하면 기본 문구 넣어도 됨)
  }

  return (
    <div className="overlay">
      <div className="video-wrap" ref={wrapRef}>
        <video
          ref={videoRef}
          src="/video.mp4"
          autoPlay
          loop
          muted
          playsInline
          controls={false}
          preload="auto"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          onTimeUpdate={(e) => {
            const ct = (e.target as HTMLVideoElement).currentTime;
            setT(ct);

            // 0:07부터 컨페티 ON
            if (ct >= 7 && !confettiOn) setConfettiOn(true);

            // 루프 감지: 거의 0으로 돌아오면 초기화
            if (ct < 0.2 && confettiOn) {
              setConfettiOn(false);
            }
          }}
        />

        {/* 자막 */}
        {caption && (
          <div
            className="caption"
            style={{
              position: "absolute",
              left: "50%",
              bottom: "8%",
              transform: "translateX(-50%)",
              padding: "10px 16px",
              background: "rgba(0,0,0,.45)",
              color: "#fff",
              fontWeight: 700,
              borderRadius: 12,
              whiteSpace: "nowrap",
              zIndex: 3,
              pointerEvents: "none",
              fontSize: "clamp(16px, 2.2vw, 32px)",
              textAlign: "center",
            }}
          >
            {caption}
          </div>
        )}

        {/* Confetti: 0:07부터 보여주기 */}
        {confettiOn && (
          <div
            className="confetti-layer"
            style={{ position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none" }}
          >
            <Confetti
              width={size.width}
              height={size.height}
              numberOfPieces={220}
              recycle
              gravity={0.25}
            />
          </div>
        )}

        {/* 사운드 켜기 버튼 */}
        <button
          onClick={() => {
            if (!videoRef.current) return;
            videoRef.current.muted = false;
            videoRef.current.play().catch(() => {});
          }}
          style={{
            position: "absolute", bottom: 16, right: 16,
            padding: "8px 12px", borderRadius: 8, border: 0, cursor: "pointer", zIndex: 4
          }}
        >
          🔊 사운드 켜기
        </button>

        {/* 전체화면 버튼 (수동 진입) */}
        <button
          onClick={async () => {
            try {
              if (wrapRef.current?.requestFullscreen) {
                await wrapRef.current.requestFullscreen();
              }
            } catch {}
          }}
          style={{
            position: "absolute", bottom: 16, left: 16,
            padding: "8px 12px", borderRadius: 8, border: 0, cursor: "pointer", zIndex: 4
          }}
        >
          ⛶ 전체화면
        </button>

        <Link
          to="/"
          style={{
            position: "absolute", top: 12, left: 12,
            padding: "8px 10px", borderRadius: 8, background: "rgba(0,0,0,.45)",
            color: "#fff", textDecoration: "none", zIndex: 4
          }}
        >
          ← 이름 다시 입력
        </Link>
      </div>
    </div>
  );
}
