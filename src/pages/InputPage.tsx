import { type FormEvent, useMemo, useState } from "react";
import { useNavigate, createSearchParams } from "react-router-dom";

function useInitialName() {
  return useMemo(() => {
    const p = new URLSearchParams(window.location.search);
    return (p.get("name") ?? "").trim();
  }, []);
}

export default function InputPage() {
  const initial = useInitialName();
  const [name, setName] = useState(initial);
  const navigate = useNavigate();

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const target = name.trim() || "스프린터";
    navigate({
      pathname: "/video",
      search: `?${createSearchParams({ name: target })}`,
    });
  };

  return (
    <div className="container">
      <h1>🎉 잠시 후 놀라운 순간이 공개됩니다</h1>
      <p className="hint">당신의 이름은?</p>

      <form className="form card" onSubmit={onSubmit}>
        <input
          className="input"
          placeholder="이름을 입력하세요 (예: 김코드)"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button className="button" type="submit">재생</button>
      </form>
    </div>
  );
}
