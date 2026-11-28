'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import './simba-ai-avatar.css';
import { DigitalLionField } from './DigitalLionField';

export type AvatarState = 'idle' | 'hover' | 'pressed' | 'active' | 'thinking' | 'success' | 'error';
export interface SimbaAIAvatarProps {
  state?: AvatarState;
  defaultState?: AvatarState;
  onStateChange?: (state: AvatarState) => void;
  onActivate?: () => void;
  size?: number;
  /** Optional expanded size. Omit to keep layout dimensions fixed. */
  activeSize?: number;
  assetSrc?: string;
  interactive?: boolean;
  paused?: boolean;
  className?: string;
  label?: string;
  variant?: 'metal' | 'digital';
  dispersion?: number;
  surface?: 'dark' | 'light';
}

const labels: Record<AvatarState, string> = {
  idle: 'готов к работе', hover: 'готов к активации', pressed: 'активация',
  active: 'активен', thinking: 'обрабатывает запрос', success: 'действие выполнено', error: 'требуется внимание',
};

export function SimbaAIAvatar({ state, defaultState = 'idle', onStateChange, onActivate,
  size = 84, activeSize, assetSrc = '/lion-core.png', interactive = true, paused = false,
  className = '', label = 'Simba AI', variant = 'metal', dispersion = .65, surface = 'dark',
}: SimbaAIAvatarProps) {
  const [internal, setInternal] = useState<AvatarState>(defaultState);
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [activating, setActivating] = useState(false);
  const [settled, setSettled] = useState(false);
  const [visible, setVisible] = useState(true);
  const root = useRef<HTMLDivElement>(null);
  const clickTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const changeRef = useRef(onStateChange);
  changeRef.current = onStateChange;
  const base = state ?? internal;
  const current = base === 'success' && settled ? 'active' : base;
  const visual = pressed ? 'pressed' : hovered && current === 'idle' ? 'hover' : current;
  const expanded = !['idle', 'hover', 'pressed'].includes(current);

  useEffect(() => {
    setSettled(false);
    if (base !== 'success') return;
    const timer = setTimeout(() => {
      setSettled(true);
      if (state === undefined) setInternal('active');
      changeRef.current?.('active');
    }, 1150);
    return () => clearTimeout(timer);
  }, [base, state]);

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    let inView = true;
    const sync = () => setVisible(inView && !document.hidden);
    const observer = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; sync(); });
    observer.observe(element);
    document.addEventListener('visibilitychange', sync);
    sync();
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', sync); clearTimeout(clickTimer.current); };
  }, []);

  useEffect(() => {
    const speed = activating ? 4 : visual === 'thinking' ? 2.3 : visual === 'hover' || hovered ? 1.6 : 1;
    root.current?.querySelectorAll('.simba-rotation').forEach(element => {
      element.getAnimations().forEach(animation => animation.updatePlaybackRate(speed));
    });
  }, [visual, hovered, activating, visible, paused]);

  const activate = () => {
    if (current === 'thinking') return;
    setPressed(false);
    setActivating(true);
    if (state === undefined) setInternal('active');
    onStateChange?.('active');
    onActivate?.();
    clearTimeout(clickTimer.current);
    clickTimer.current = setTimeout(() => setActivating(false), 480);
  };

  const artwork = variant === 'digital' ? <DigitalLionField assetSrc={assetSrc} state={visual}
    tone={current === 'error' ? 'error' : expanded ? 'violet' : 'cyan'} paused={paused || !visible} dispersion={Math.max(0,Math.min(1,dispersion))} surface={surface}/> : <>
    <span className="simba-halo" data-layer="Halo" />
    <svg className="simba-field" viewBox="0 0 320 320" fill="none" aria-hidden="true">
      <g data-layer="OrbitOuter" className="simba-rotation simba-orbit-outer">
        <path className="simba-arc-heavy" d="M 51 71 A 141 141 0 0 1 207 27" />
        <path className="simba-arc" d="M 258 59 A 141 141 0 0 1 298 187" />
        <path className="simba-arc" d="M 249 270 A 141 141 0 0 1 138 299" />
        <path className="simba-arc-faint" d="M 76 273 A 141 141 0 0 1 20 142" strokeDasharray="2 9" />
      </g>
      <g data-layer="OrbitInner" className="simba-rotation simba-orbit-inner">
        <path className="simba-arc-faint" d="M 109 43 A 126 126 0 0 1 282 191 M 172 285 A 126 126 0 0 1 39 123" />
        <path className="simba-arc" d="M 51 95 A 126 126 0 0 1 77 64 M 263 233 A 126 126 0 0 1 233 263" />
      </g>
      <g className="simba-trails">
        <path d="M 3 210 C 34 183 54 185 86 181 M 235 145 C 270 138 304 119 317 101" />
        <path d="M 10 232 C 30 239 63 228 91 217 M 234 105 C 271 86 295 84 307 88" />
      </g>
      <g data-layer="OrbitNodes" className="simba-rotation simba-orbit-nodes">
        <circle className="simba-node" cx="224" cy="35" r="2.8" />
        <circle className="simba-node" cx="290" cy="215" r="1.9" />
        <circle className="simba-node" cx="37" cy="221" r="2.3" />
        <circle className="simba-node-dim" cx="96" cy="35" r="1.2" />
        <circle className="simba-node-dim" cx="188" cy="301" r="1.4" />
      </g>
      <g data-layer="EnergySweep" className="simba-energy simba-rotation">
        <path d="M 82 43 A 141 141 0 0 1 135 21" />
        <circle cx="135" cy="21" r="2" />
      </g>
      <g className="simba-success-echo"><path d="M 59 63 A 140 140 0 0 1 285 96 M 296 188 A 140 140 0 0 1 90 281 M 29 211 A 140 140 0 0 1 36 93" /></g>
    </svg>
    <svg className="simba-core" data-layer="LionCore" viewBox="0 0 320 320" aria-hidden="true">
      <image href={assetSrc} x="34" y="24" width="252" height="252" />
      <svg x="34" y="24" width="252" height="252" viewBox="0 0 1254 1254">
        <g data-layer="EyesGlow" className="simba-eyes">
          <path d="M490 511 Q511 514 534 536 Q501 540 490 511Z M785 511 Q764 514 741 536 Q774 540 785 511Z" />
        </g>
      </svg>
    </svg>
  </>;

  return <div ref={root} className={`simba-avatar ${className}`} data-state={visual} data-variant={variant} data-tone={current === 'error' ? 'error' : expanded ? 'violet' : 'cyan'}
    data-paused={paused || !visible} data-activating={activating}
    style={{ '--simba-size': `${expanded && activeSize ? activeSize : size}px` } as CSSProperties}>
    {interactive ? <button type="button" className="simba-surface"
      aria-label={`${label}: ${labels[visual]}`} aria-pressed={expanded} aria-busy={current === 'thinking'}
      aria-disabled={current === 'thinking'}
      onPointerEnter={e => { if (e.pointerType === 'mouse' && matchMedia('(hover: hover)').matches) setHovered(true); }}
      onPointerLeave={() => { setHovered(false); setPressed(false); }}
      onPointerDown={e => { if (e.button === 0 && current !== 'thinking') setPressed(true); }}
      onPointerUp={() => setPressed(false)} onPointerCancel={() => setPressed(false)}
      onBlur={() => { setPressed(false); setHovered(false); }}
      onKeyDown={e => { if ((e.key === ' ' || e.key === 'Enter') && current !== 'thinking') setPressed(true); }}
      onKeyUp={() => setPressed(false)} onClick={activate}>{artwork}</button>
      : <div className="simba-surface" role="img" aria-label={`${label}: ${labels[visual]}`}>{artwork}</div>}
  </div>;
}
