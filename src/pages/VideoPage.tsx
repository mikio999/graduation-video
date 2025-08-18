import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams, Navigate, Link } from "react-router-dom";
import Confetti from "react-confetti";
import { useElementSize } from "../hooks/useElementSize";

const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

export default function VideoPage() {
  const [sp] = useSearchParams();
  const name = (sp.get("name") ?? "").trim();
  if (!name) return <Navigate to="/" replace />;

  const displayName = name || "스프린터";
  const { ref: wrapRef, size } = useElementSize<HTMLDivElement>();
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [t, setT] = useState(0);           // 현재 재생 시간(초)
  const [confettiOn, setConfettiOn] = useState(false);

  // 페이지 진입 시 자동재생(모바일 정책: muted/playsInline 필요)
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.play().catch(() => {});
  }, []);

  // 타이밍 자막
  const caption = useMemo(() => {
    if (t >= 0 && t < 2) return "잠시 중대 발표가 있겠습니다...";
    if (t >= 3 && t < 5) return "(두근두근)";
    if (t >= 7 && t < 9.5) return `오늘의 주인공, ${displayName}님께 영광의 수료증을 수여합니다!`;
    if (t >= 9.5 && t < 11) return `(코드잇 일동) 와아아아`;
    if (t >= 11) return `코드잇 스프린트 수료를 축하합니다 ${displayName}님!!`;
    return "";
  }, [t, displayName]);

  return (
    <div className="overlay">
      {/* overlay가 가짜 전체화면 역할을 하므로 네이티브 fullscreen은 쓰지 않음(모바일에서 자막 가려짐 방지) */}
      <div className="video-wrap" ref={wrapRef} /* 100dvh는 CSS에서 적용 */>
        <video
          ref={videoRef}
          src="/video.mp4"
          autoPlay
          loop
          muted
          playsInline
          controls={false}
          preload="auto"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            // 필요시 포커스 조정 (중앙보다 살짝 위)
            objectPosition: "50% 48%",
          }}
          onTimeUpdate={(e) => {
            const ct = (e.target as HTMLVideoElement).currentTime;
            setT(ct);
            if (ct >= 7 && !confettiOn) setConfettiOn(true); // 0:07부터 confetti
            if (ct < 0.2 && confettiOn) setConfettiOn(false); // 루프 초기화
          }}
        />

        {/* Confetti: 자막보다 아래(zIndex:1), 클릭 방해 X */}
        {confettiOn && (
          <Confetti
            width={size.width}
            height={size.height}
            numberOfPieces={220}
            recycle
            gravity={0.25}
            style={{ position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none" }}
          />
        )}

        {/* 자막: safe-area 반영 + 반응형 글자크기 */}
        {caption && (
          <div
            className="caption"
            style={{
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
              bottom: "calc(max(6%, env(safe-area-inset-bottom, 0px) + 16px))",
              padding: "12px 16px",
              background: "rgba(0,0,0,.55)",
              color: "#fff",
              fontWeight: 700,
              borderRadius: 12,
              zIndex: 3,
              pointerEvents: "none",
              textAlign: "center",
              whiteSpace: "normal",
              wordBreak: "keep-all",
              fontSize: "clamp(14px, 2.2vw + 0.4vh, 28px)",
              lineHeight: 1.35,
              maxWidth: "min(900px, calc(100% - 32px))",
            }}
          >
            {caption}
          </div>
        )}

        {/* 사운드 켜기 */}
        <button
          onClick={() => {
            if (!videoRef.current) return;
            videoRef.current.muted = false;
            videoRef.current.play().catch(() => {});
          }}
          style={{
            position: "absolute",
            right: 16,
            bottom: "calc(env(safe-area-inset-bottom, 0px) + 16px)",
            padding: "8px 12px",
            borderRadius: 8,
            border: 0,
            cursor: "pointer",
            zIndex: 4,
            background: "rgba(0,0,0,.5)",
            color: "#fff",
          }}
        >
          🔊 사운드 켜기
        </button>

        {/* 데스크톱에서만 네이티브 전체화면 버튼(모바일은 숨김) */}
        {!isMobile && (
          <button
            onClick={async () => {
              try {
                if (wrapRef.current?.requestFullscreen) {
                  await wrapRef.current.requestFullscreen();
                }
              } catch {}
            }}
            style={{
              position: "absolute",
              left: 16,
              bottom: "calc(env(safe-area-inset-bottom, 0px) + 16px)",
              padding: "8px 12px",
              borderRadius: 8,
              border: 0,
              cursor: "pointer",
              zIndex: 4,
              background: "rgba(0,0,0,.5)",
              color: "#fff",
            }}
          >
            ⛶ 전체화면
          </button>
        )}

        {/* 뒤로가기 */}
        <Link
          to="/"
          style={{
            position: "absolute",
            top: "calc(env(safe-area-inset-top, 0px) + 12px)",
            left: 12,
            padding: "8px 10px",
            borderRadius: 8,
            background: "rgba(0,0,0,.45)",
            color: "#fff",
            textDecoration: "none",
            zIndex: 4,
          }}
        >
          ← 이름 다시 입력
        </Link>
      </div>
    </div>
  );
}
