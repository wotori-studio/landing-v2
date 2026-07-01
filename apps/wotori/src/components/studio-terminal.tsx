"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Ambient "studio runtime" console — a self-contained IDE window that types
 * wotori-themed log lines forever. Ported and re-themed from the dimira/agency
 * BusinessCard terminal, kept in full: window chrome (title bar + status),
 * character-by-character typing with human jitter, rolling history, blinking
 * caret, and a file-path footer.
 */

const LOG_SCRIPT: string[] = [
  "[BOOT] wotori-runtime v0.3.0",
  "[BOOT] mounting creative pipeline",
  "[ OK ] webgl context acquired",
  "[ OK ] shader compiler ready",
  "[INIT] voxel world streaming online",
  "[INIT] avatar rig loaded: 62 bones",
  "[INIT] real-time 3D scene graph built",
  "[ OK ] depth + bloom passes attached",
  "[SCAN] disciplines: web3 · 3D · brand",
  "[SCAN] palette: teal / ink / cream",
  "[SCAN] type: single mono family",
  "[CORE] manifesto compiled",
  "[CORE] we build worlds brands live in",
  "[CORE] form follows feeling",
  "[SRV ] protocol design — online",
  "[SRV ] dApps + wallets — online",
  "[SRV ] landing pages + webGL — online",
  "[SRV ] avatars + real-time 3D — online",
  "[SRV ] automation + prototyping — online",
  "[CHAIN] solana rpc ping ok",
  "[CHAIN] stellar horizon ping ok",
  "[NET ] gateway wotori.io:443",
  "[NET ] keepalive 90s",
  "[AUTH] session anon-7c4f",
  "[AUTH] token chain ok",
  "[FILE] /studio/wotori/manifesto.md",
  "[FILE] /studio/wotori/work/ekza.tsx",
  "[FILE] /studio/wotori/work/omoba.glb",
  "[FILE] /studio/wotori/avatars/rig.fbx",
  "[GIT ] branch=main head=9502611",
  "[GIT ] last: i18n + ui polish",
  "[BENCH] avg fps 60",
  "[BENCH] gpu 21% mem 388mb",
  "[FX  ] grass sway 1.45 rad/s",
  "[FX  ] cloud drift 0.12 rad/s",
  "[FX  ] avatar idle blend active",
  "[STAT] uptime 00:03:11",
  "[STAT] requests 0 errors 0",
  "[CONN] discord relay ready",
  "[CONN] telegram bridge ok",
  "[CONN] mail relay ready",
  "[ENV ] node 20.x  next 14.1",
  "[ENV ] react 18  three 0.169",
  "[LANG] vocabulary loaded: en / ru / jp",
  "[LANG] keyword: build worlds",
  "[NOTE] lean team · fast shipping",
  "[NOTE] open for projects",
  "[ECHO] hello, builder",
  "[OUT ] reach wotorimovako@gmail.com",
  "[OUT ] ready for command...",
  "[LOOP] heartbeat 1s",
  "[LOOP] heartbeat 2s",
  "[QUEUE] background indexer idle",
  "[EXPR] dream > spec > ship",
  "[EXPR] make things people remember",
];

const VISIBLE_HISTORY = 4;

export default function StudioTerminal() {
  const [history, setHistory] = useState<string[]>([]);
  const [current, setCurrent] = useState("");
  const lineIdx = useRef(0);
  const charIdx = useRef(0);

  useEffect(() => {
    // Respect reduced-motion: show a static window of lines, no typing.
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setHistory(LOG_SCRIPT.slice(0, VISIBLE_HISTORY));
      setCurrent(LOG_SCRIPT[VISIBLE_HISTORY]);
      return;
    }

    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const step = () => {
      if (cancelled) return;
      const target = LOG_SCRIPT[lineIdx.current];
      if (charIdx.current < target.length) {
        charIdx.current += 1;
        setCurrent(target.slice(0, charIdx.current));
        timer = setTimeout(step, 14 + Math.random() * 34);
      } else {
        setHistory((prev) => [...prev, target].slice(-VISIBLE_HISTORY));
        setCurrent("");
        charIdx.current = 0;
        lineIdx.current = (lineIdx.current + 1) % LOG_SCRIPT.length;
        const pause =
          Math.random() < 0.18
            ? 900 + Math.random() * 1400
            : 180 + Math.random() * 520;
        timer = setTimeout(step, pause);
      }
    };

    timer = setTimeout(step, 600);
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, []);

  return (
    <aside className="ws-terminal" aria-hidden="true">
      <header className="ws-terminal__bar">
        <span className="ws-terminal__dots">
          <i />
          <i />
          <i />
        </span>
        <span className="ws-terminal__title">wotori-runtime — /studio</span>
        <span className="ws-terminal__status">ACTIVE</span>
      </header>

      <div className="ws-terminal__body" aria-label="Studio log" aria-live="polite">
        {history.map((line, i) => (
          <p key={`${i}-${line}`}>{line}</p>
        ))}
        <p className="ws-terminal__active">
          {current}
          <span className="ws-terminal__caret">_</span>
        </p>
      </div>

      <footer className="ws-terminal__foot">
        <span>/studio/wotori/</span>
        <span>wotorimovako@gmail.com</span>
        <span>INS</span>
      </footer>
    </aside>
  );
}
