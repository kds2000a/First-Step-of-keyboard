import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { createRoot } from 'react-dom/client';

type Screen = 'main' | 'keyboard_menu' | 'korean_menu' | 'typing' | 'mouse' | 'progress';
type PracticeMode = 'korean_cv' | 'korean_word' | 'english';

const KOREAN_WORDS = ['사과', '바나나', '딸기', '포도', '수박', '오렌지', '엄마', '아빠', '하늘', '바다', '코끼리', '호랑이'];
const ENGLISH_WORDS = [
    { en: 'run', ko: '달리다' },
    { en: 'walk', ko: '걷다' },
    { en: 'eat', ko: '먹다' },
    { en: 'drink', ko: '마시다' },
    { en: 'sleep', ko: '자다' },
    { en: 'read', ko: '읽다' },
    { en: 'write', ko: '쓰다' },
    { en: 'sing', ko: '노래하다' },
    { en: 'dance', ko: '춤추다' },
    { en: 'swim', ko: '수영하다' },
    { en: 'jump', ko: '점프하다' },
    { en: 'fly', ko: '날다' },
    { en: 'play', ko: '놀다' },
    { en: 'study', ko: '공부하다' },
    { en: 'work', ko: '일하다' },
    { en: 'think', ko: '생각하다' },
    { en: 'see', ko: '보다' },
    { en: 'hear', ko: '듣다' },
    { en: 'speak', ko: '말하다' },
    { en: 'make', ko: '만들다' },
    { en: 'give', ko: '주다' },
    { en: 'take', ko: '가지다' },
    { en: 'open', ko: '열다' },
    { en: 'close', ko: '닫다' },
    { en: 'help', ko: '돕다' }
];

const KOREAN_101_LAYOUT = [
    [
        { base: '`', shift: '~', code: 'Backquote', flex: 1 }, { base: '1', shift: '!', code: 'Digit1', flex: 1 }, { base: '2', shift: '@', code: 'Digit2', flex: 1 }, { base: '3', shift: '#', code: 'Digit3', flex: 1 }, { base: '4', shift: '$', code: 'Digit4', flex: 1 }, { base: '5', shift: '%', code: 'Digit5', flex: 1 }, { base: '6', shift: '^', code: 'Digit6', flex: 1 }, { base: '7', shift: '&', code: 'Digit7', flex: 1 }, { base: '8', shift: '*', code: 'Digit8', flex: 1 }, { base: '9', shift: '(', code: 'Digit9', flex: 1 }, { base: '0', shift: ')', code: 'Digit0', flex: 1 }, { base: '-', shift: '_', code: 'Minus', flex: 1 }, { base: '=', shift: '+', code: 'Equal', flex: 1 }, { display: 'Backspace', code: 'Backspace', flex: 2 }
    ],
    [
        { display: 'Tab', code: 'Tab', flex: 1.5 }, { base: 'ㅂ', shift: 'ㅃ', code: 'KeyQ', flex: 1 }, { base: 'ㅈ', shift: 'ㅉ', code: 'KeyW', flex: 1 }, { base: 'ㄷ', shift: 'ㄸ', code: 'KeyE', flex: 1 }, { base: 'ㄱ', shift: 'ㄲ', code: 'KeyR', flex: 1 }, { base: 'ㅅ', shift: 'ㅆ', code: 'KeyT', flex: 1 }, { base: 'ㅛ', shift: null, code: 'KeyY', flex: 1 }, { base: 'ㅕ', shift: null, code: 'KeyU', flex: 1 }, { base: 'ㅑ', shift: null, code: 'KeyI', flex: 1 }, { base: 'ㅐ', shift: 'ㅒ', code: 'KeyO', flex: 1 }, { base: 'ㅔ', shift: 'ㅖ', code: 'KeyP', flex: 1 }, { base: '[', shift: '{', code: 'BracketLeft', flex: 1 }, { base: ']', shift: '}', code: 'BracketRight', flex: 1 }, { base: '\\', shift: '|', code: 'Backslash', flex: 1.5 }
    ],
    [
        { display: 'Caps Lock', code: 'CapsLock', flex: 1.8 }, { base: 'ㅁ', shift: null, code: 'KeyA', flex: 1 }, { base: 'ㄴ', shift: null, code: 'KeyS', flex: 1 }, { base: 'ㅇ', shift: null, code: 'KeyD', flex: 1 }, { base: 'ㄹ', shift: null, code: 'KeyF', flex: 1 }, { base: 'ㅎ', shift: null, code: 'KeyG', flex: 1 }, { base: 'ㅗ', shift: null, code: 'KeyH', flex: 1 }, { base: 'ㅓ', shift: null, code: 'KeyJ', flex: 1 }, { base: 'ㅏ', shift: null, code: 'KeyK', flex: 1 }, { base: 'ㅣ', shift: null, code: 'KeyL', flex: 1 }, { base: ';', shift: ':', code: 'Semicolon', flex: 1 }, { base: "'", shift: '"', code: 'Quote', flex: 1 }, { display: 'Enter', code: 'Enter', flex: 2.2 }
    ],
    [
        { display: 'Shift', code: 'ShiftLeft', flex: 2.5 }, { base: 'ㅋ', shift: null, code: 'KeyZ', flex: 1 }, { base: 'ㅌ', shift: null, code: 'KeyX', flex: 1 }, { base: 'ㅊ', shift: null, code: 'KeyC', flex: 1 }, { base: 'ㅍ', shift: null, code: 'KeyV', flex: 1 }, { base: 'ㅠ', shift: null, code: 'KeyB', flex: 1 }, { base: 'ㅜ', shift: null, code: 'KeyN', flex: 1 }, { base: 'ㅡ', shift: null, code: 'KeyM', flex: 1 }, { base: ',', shift: '<', code: 'Comma', flex: 1 }, { base: '.', shift: '>', code: 'Period', flex: 1 }, { base: '/', shift: '?', code: 'Slash', flex: 1 }, { display: 'Shift', code: 'ShiftRight', flex: 2.5 }
    ],
    [
        { display: 'Ctrl', code: 'ControlLeft', flex: 1.5 }, { display: 'Alt', code: 'AltLeft', flex: 1.5 }, { display: 'Space', code: 'Space', flex: 6 }, { display: 'Alt', code: 'AltRight', flex: 1.5 }, { display: 'Ctrl', code: 'ControlRight', flex: 1.5 }
    ]
];
const ENGLISH_101_LAYOUT = [
    [
        { base: '`', shift: '~', code: 'Backquote', flex: 1 }, { base: '1', shift: '!', code: 'Digit1', flex: 1 }, { base: '2', shift: '@', code: 'Digit2', flex: 1 }, { base: '3', shift: '#', code: 'Digit3', flex: 1 }, { base: '4', shift: '$', code: 'Digit4', flex: 1 }, { base: '5', shift: '%', code: 'Digit5', flex: 1 }, { base: '6', shift: '^', code: 'Digit6', flex: 1 }, { base: '7', shift: '&', code: 'Digit7', flex: 1 }, { base: '8', shift: '*', code: 'Digit8', flex: 1 }, { base: '9', shift: '(', code: 'Digit9', flex: 1 }, { base: '0', shift: ')', code: 'Digit0', flex: 1 }, { base: '-', shift: '_', code: 'Minus', flex: 1 }, { base: '=', shift: '+', code: 'Equal', flex: 1 }, { display: 'Backspace', code: 'Backspace', flex: 2 }
    ],
    [
        { display: 'Tab', code: 'Tab', flex: 1.5 }, { base: 'q', shift: 'Q', code: 'KeyQ', flex: 1 }, { base: 'w', shift: 'W', code: 'KeyW', flex: 1 }, { base: 'e', shift: 'E', code: 'KeyE', flex: 1 }, { base: 'r', shift: 'R', code: 'KeyR', flex: 1 }, { base: 't', shift: 'T', code: 'KeyT', flex: 1 }, { base: 'y', shift: 'Y', code: 'KeyY', flex: 1 }, { base: 'u', shift: 'U', code: 'KeyU', flex: 1 }, { base: 'i', shift: 'I', code: 'KeyI', flex: 1 }, { base: 'o', shift: 'O', code: 'KeyO', flex: 1 }, { base: 'p', shift: 'P', code: 'KeyP', flex: 1 }, { base: '[', shift: '{', code: 'BracketLeft', flex: 1 }, { base: ']', shift: '}', code: 'BracketRight', flex: 1 }, { base: '\\', shift: '|', code: 'Backslash', flex: 1.5 }
    ],
    [
        { display: 'Caps Lock', code: 'CapsLock', flex: 1.8 }, { base: 'a', shift: 'A', code: 'KeyA', flex: 1 }, { base: 's', shift: 'S', code: 'KeyS', flex: 1 }, { base: 'd', shift: 'D', code: 'KeyD', flex: 1 }, { base: 'f', shift: 'F', code: 'KeyF', flex: 1 }, { base: 'g', shift: 'G', code: 'KeyG', flex: 1 }, { base: 'h', shift: 'H', code: 'KeyH', flex: 1 }, { base: 'j', shift: 'J', code: 'KeyJ', flex: 1 }, { base: 'k', shift: 'K', code: 'KeyK', flex: 1 }, { base: 'l', shift: 'L', code: 'KeyL', flex: 1 }, { base: ';', shift: ':', code: 'Semicolon', flex: 1 }, { base: "'", shift: '"', code: 'Quote', flex: 1 }, { display: 'Enter', code: 'Enter', flex: 2.2 }
    ],
    [
        { display: 'Shift', code: 'ShiftLeft', flex: 2.5 }, { base: 'z', shift: 'Z', code: 'KeyZ', flex: 1 }, { base: 'x', shift: 'X', code: 'KeyX', flex: 1 }, { base: 'c', shift: 'C', code: 'KeyC', flex: 1 }, { base: 'v', shift: 'V', code: 'KeyV', flex: 1 }, { base: 'b', shift: 'B', code: 'KeyB', flex: 1 }, { base: 'n', shift: 'N', code: 'KeyN', flex: 1 }, { base: 'm', shift: 'M', code: 'KeyM', flex: 1 }, { base: ',', shift: '<', code: 'Comma', flex: 1 }, { base: '.', shift: '>', code: 'Period', flex: 1 }, { base: '/', shift: '?', code: 'Slash', flex: 1 }, { display: 'Shift', code: 'ShiftRight', flex: 2.5 }
    ],
    [
        { display: 'Ctrl', code: 'ControlLeft', flex: 1.5 }, { display: 'Alt', code: 'AltLeft', flex: 1.5 }, { base: ' ', shift: ' ', code: 'Space', flex: 6, display: 'Space' }, { display: 'Alt', code: 'AltRight', flex: 1.5 }, { display: 'Ctrl', code: 'ControlRight', flex: 1.5 }
    ]
];

const HANGUL_OFFSET = 0xAC00;
const CHOSEONG = ['ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
const JUNGSEONG = ['ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅘ', 'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ', 'ㅝ', 'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ', 'ㅣ'];
const JONGSEONG = ['', 'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ', 'ㄶ', 'ㄷ', 'ㄹ', 'ㄺ', 'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ', 'ㄿ', 'ㅀ', 'ㅁ', 'ㅂ', 'ㅄ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
const COMPLEX_VOWELS: Record<string, string> = { 'ㅘ': 'ㅗㅏ', 'ㅙ': 'ㅗㅐ', 'ㅚ': 'ㅗㅣ', 'ㅝ': 'ㅜㅓ', 'ㅞ': 'ㅜㅔ', 'ㅟ': 'ㅜㅣ', 'ㅢ': 'ㅡㅣ' };
const COMPLEX_CONSONANTS: Record<string, string> = { 'ㄳ': 'ㄱㅅ', 'ㄵ': 'ㄴㅈ', 'ㄶ': 'ㄴㅎ', 'ㄺ': 'ㄹㄱ', 'ㄻ': 'ㄹㅁ', 'ㄼ': 'ㄹㅂ', 'ㄽ': 'ㄹㅅ', 'ㄾ': 'ㄹㅌ', 'ㄿ': 'ㄹㅍ', 'ㅀ': 'ㄹㅎ', 'ㅄ': 'ㅂㅅ' };

function decomposeHangul(word: string): string[] {
  let result: string[] = [];
  for (const char of word) {
    if (char >= '가' && char <= '힣') {
      const charCode = char.charCodeAt(0) - HANGUL_OFFSET;
      const choseongIndex = Math.floor(charCode / (21 * 28));
      const jungseongIndex = Math.floor((charCode % (21 * 28)) / 28);
      const jongseongIndex = charCode % 28;

      result.push(CHOSEONG[choseongIndex]);

      const vowel = JUNGSEONG[jungseongIndex];
      if (COMPLEX_VOWELS[vowel]) {
        result.push(...COMPLEX_VOWELS[vowel].split(''));
      } else {
        result.push(vowel);
      }

      if (jongseongIndex > 0) {
        const consonant = JONGSEONG[jongseongIndex];
         if (COMPLEX_CONSONANTS[consonant]) {
            result.push(...COMPLEX_CONSONANTS[consonant].split(''));
         } else {
            result.push(consonant);
         }
      }
    } else {
        result.push(char);
    }
  }
  return result;
}

// --- Helper Components ---

const GuidingCharacter = () => (
    <svg viewBox="0 -10 100 110" className="guiding-character" aria-label="Cute rabbit character">
        <g>
            <circle cx="50" cy="50" r="40" fill="#FFDDC1"/>
            <circle cx="35" cy="45" r="5" fill="#333"/>
            <circle cx="65" cy="45" r="5" fill="#333"/>
            <path d="M45 60 Q50 70 55 60" stroke="#333" strokeWidth="2" fill="none"/>
            <ellipse cx="30" cy="15" rx="10" ry="20" fill="#FFDDC1" transform="rotate(-15 30 15)"/>
            <ellipse cx="70" cy="15" rx="10" ry="20" fill="#FFDDC1" transform="rotate(15 70 15)"/>
            <ellipse cx="30" cy="15" rx="7" ry="15" fill="#FFC0CB" transform="rotate(-15 30 15)"/>
            <ellipse cx="70" cy="15" rx="7" ry="15" fill="#FFC0CB" transform="rotate(15 70 15)"/>
        </g>
    </svg>
);

const StarDisplay = ({ count }: { count: number }) => (
    <div className="star-display" aria-label={`You have ${count} stars`}>
        <svg className="star-icon" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
        <span>{count}</span>
    </div>
);

const BackButton = ({ onClick }: { onClick: () => void }) => (
    <button className="btn btn-secondary btn-back" onClick={onClick}>뒤로가기</button>
);

const Sparkle: React.FC<{ x: number, y: number }> = ({ x, y }) => (
    <div className="sparkle" style={{ left: `${x}px`, top: `${y}px` }} />
);

const SoundControls = ({ isMuted, onMuteToggle, volumeLevel, onVolumeChange }: { isMuted: boolean, onMuteToggle: () => void, volumeLevel: number, onVolumeChange: (level: number) => void}) => (
    <div className="sound-controls">
        <button onClick={onMuteToggle} className="btn-icon mute-btn" aria-label={isMuted ? 'Unmute' : 'Mute'}>
            {isMuted ? (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>
            )}
        </button>
        <div className="volume-control" role="group" aria-label="Volume control">
            {Array.from({ length: 5 }).map((_, index) => (
                <button
                    key={index}
                    className={`volume-bar ${index < volumeLevel ? 'active' : ''}`}
                    onClick={() => onVolumeChange(index + 1)}
                    aria-label={`Set volume to ${index + 1}`}
                />
            ))}
        </div>
    </div>
);

// --- Main Screens ---

const MainMenu = ({ onSelectMode }: { onSelectMode: (screen: Screen) => void }) => (
    <div className="screen">
        <GuidingCharacter />
        <h1>타이핑 어드벤처</h1>
        <div className="button-group">
            <button className="btn" onClick={() => onSelectMode('keyboard_menu')}>키보드 연습</button>
            <button className="btn" onClick={() => onSelectMode('mouse')}>마우스 연습</button>
            <button className="btn btn-secondary" onClick={() => onSelectMode('progress')}>학습 리포트</button>
        </div>
    </div>
);

const KeyboardMenu = ({ onSelectPractice, onBack }: { onSelectPractice: (screen: Screen) => void, onBack: () => void }) => (
    <div className="screen">
        <BackButton onClick={onBack} />
        <h2>키보드 연습</h2>
        <div className="button-group">
            <button className="btn" onClick={() => onSelectPractice('korean_menu')}>한글</button>
            <button className="btn" onClick={() => onSelectPractice('typing')}>English</button>
        </div>
    </div>
);

const KoreanMenu = ({ onSelectMode, onBack }: { onSelectMode: (mode: PracticeMode) => void, onBack: () => void }) => (
     <div className="screen">
        <BackButton onClick={onBack} />
        <h2>한글 연습</h2>
        <div className="button-group">
            <button className="btn" onClick={() => onSelectMode('korean_cv')}>자음/모음</button>
            <button className="btn" onClick={() => onSelectMode('korean_word')}>낱말 연습</button>
        </div>
    </div>
);

const CHEERING_MESSAGES = [
    '정말 잘하고 있어!',
    '최고야!',
    '와, 대단한걸!',
    '거의 다 왔어!',
    '지금처럼만 하면 돼!',
    '리듬을 타봐!',
    '신난다!',
    '정확해!'
];
const SUPPORT_MESSAGES = [
    '괜찮아, 다시 해보자!',
    '실수는 배움의 과정이야!',
    '조금만 더 집중해볼까?',
    '거의 맞았어!',
    '할 수 있어!',
    '천천히 해봐, 괜찮아.'
];
const INITIAL_MESSAGE = '글자를 힘차게 눌러보자!';

const TypingPractice = ({ mode, onCorrect, onBack, isMuted, volumeLevel }: { mode: PracticeMode, onCorrect: (char: string) => void, onBack: () => void, isMuted: boolean, volumeLevel: number }) => {
    const [displayWord, setDisplayWord] = useState('');
    const [displayTranslation, setDisplayTranslation] = useState('');
    const [targetSequence, setTargetSequence] = useState<string[]>([]);
    const [typedCount, setTypedCount] = useState(0);
    const [charEndIndices, setCharEndIndices] = useState<number[]>([]);
    const [feedback, setFeedback] = useState<Record<number, {type: 'correct' | 'incorrect', key?: string}>>({});
    const [message, setMessage] = useState(INITIAL_MESSAGE);
    const wordQueue = useRef({ list: [] as any[], index: 0 });
    const koreanVoice = useRef<SpeechSynthesisVoice | null>(null);

    useEffect(() => {
        const loadVoices = () => {
            const voices = window.speechSynthesis.getVoices();
            koreanVoice.current = voices.find(v => v.lang === 'ko-KR' || v.lang.startsWith('ko-')) || null;
        };
        loadVoices();
        window.speechSynthesis.onvoiceschanged = loadVoices;
        return () => {
            window.speechSynthesis.onvoiceschanged = null;
            window.speechSynthesis.cancel();
        };
    }, []);

    const speak = useCallback((text: string) => {
        if (isMuted) return;
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'ko-KR';
        utterance.volume = volumeLevel / 5;
        if (koreanVoice.current) {
            utterance.voice = koreanVoice.current;
        }
        utterance.pitch = 1.1;
        utterance.rate = 0.9;
        window.speechSynthesis.speak(utterance);
    }, [isMuted, volumeLevel]);

    useEffect(() => {
        if (message !== INITIAL_MESSAGE) {
            speak(message);
        }
    }, [message, speak]);


    const isKoreanMode = useMemo(() => mode.startsWith('korean'), [mode]);
    const layout = isKoreanMode ? KOREAN_101_LAYOUT : ENGLISH_101_LAYOUT;
    const nextChar = targetSequence[typedCount];

    const generateNewWord = useCallback(() => {
        setMessage(INITIAL_MESSAGE);
        setTypedCount(0);
        setDisplayTranslation('');
        setFeedback({});
        
        if (wordQueue.current.index >= wordQueue.current.list.length) {
            const sourceList = mode === 'english' ? ENGLISH_WORDS : KOREAN_WORDS;
            const shuffledList = [...sourceList].sort(() => Math.random() - 0.5);
            wordQueue.current = { list: shuffledList, index: 0 };
        }
        
        const newWordData = wordQueue.current.list[wordQueue.current.index];
        wordQueue.current.index++;

        if (mode === 'korean_cv' || mode === 'korean_word') {
            const newWord = newWordData;
            setDisplayWord(newWord);
            const decomposed = decomposeHangul(newWord);
            setTargetSequence(decomposed);

            if (mode === 'korean_word') {
                const indices: number[] = [];
                let currentIndex = -1;
                for (const char of newWord) {
                    currentIndex += decomposeHangul(char).length;
                    indices.push(currentIndex);
                }
                setCharEndIndices(indices);
            }
        } else { // english
            const wordObj = newWordData;
            setDisplayWord(wordObj.en);
            setDisplayTranslation(wordObj.ko);
            setTargetSequence(wordObj.en.split(''));
        }
    }, [mode]);

    useEffect(() => {
        wordQueue.current = { list: [], index: 0 };
        generateNewWord();
    }, [generateNewWord]);

    const { targetKey, needsShift } = useMemo(() => {
        if (!nextChar) return { targetKey: null, needsShift: false };
        for (const key of layout.flat()) {
            if (key.base === nextChar) {
                return { targetKey: key, needsShift: false };
            }
            if (key.shift === nextChar) {
                return { targetKey: key, needsShift: true };
            }
        }
        return { targetKey: null, needsShift: false };
    }, [nextChar, layout]);

    const handleKeyPress = useCallback((e: KeyboardEvent) => {
        if (!targetKey || e.repeat) return;
        if (e.altKey || e.ctrlKey || e.metaKey) return;
        e.preventDefault();

        const correctKeyPressed = e.code === targetKey.code && e.shiftKey === needsShift;
        
        if (correctKeyPressed) {
             setMessage(INITIAL_MESSAGE);
             if (mode === 'korean_word') {
                const currentCharIndex = charEndIndices.findIndex(endIndex => typedCount <= endIndex);
                if (currentCharIndex !== -1 && feedback[currentCharIndex]?.type === 'incorrect') {
                    setFeedback(prev => {
                        const newFeedback = {...prev};
                        delete newFeedback[currentCharIndex];
                        return newFeedback;
                    });
                }
            }
            onCorrect(nextChar);
            const newTypedCount = typedCount + 1;
            setTypedCount(newTypedCount);
            
            if (mode === 'korean_word') {
                const charCompletedIndex = charEndIndices.indexOf(newTypedCount - 1);
                if (charCompletedIndex !== -1) {
                    setFeedback(prev => ({...prev, [charCompletedIndex]: { type: 'correct' }}));
                }
            }

            if (newTypedCount === targetSequence.length) {
                setMessage(CHEERING_MESSAGES[Math.floor(Math.random() * CHEERING_MESSAGES.length)]);
                setTimeout(generateNewWord, 500);
            }
        } else {
            setMessage(SUPPORT_MESSAGES[Math.floor(Math.random() * SUPPORT_MESSAGES.length)]);
            if (mode === 'korean_word') {
                const currentCharIndex = charEndIndices.findIndex(endIndex => typedCount <= endIndex);
                if (currentCharIndex !== -1) {
                    const incorrectKeyInfo = layout.flat().find(k => k.code === e.code);
                    const incorrectChar = incorrectKeyInfo?.shift && e.shiftKey ? incorrectKeyInfo.shift : (incorrectKeyInfo?.base || e.key);
                    setFeedback(prev => ({...prev, [currentCharIndex]: { type: 'incorrect', key: incorrectChar || '?' }}));
                }
            }
        }
    }, [nextChar, onCorrect, typedCount, targetSequence, generateNewWord, targetKey, needsShift, mode, layout, charEndIndices, feedback]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [handleKeyPress]);

    return (
        <div className="screen">
            <BackButton onClick={onBack} />
            <h2 className="practice-message" aria-live="assertive">{message}</h2>
            {mode === 'korean_word' ? (
                <div className="word-display-syllable" aria-live="polite">
                    {displayWord.split('').map((char, index) => (
                        <span key={index} className="syllable-container">
                            <span className={`syllable-char ${charEndIndices[index] < typedCount ? 'typed' : ''}`}>
                                {char}
                            </span>
                            {feedback[index] && (
                                <span className={`feedback-indicator ${feedback[index]?.type}`}>
                                    {feedback[index]?.type === 'correct' && 'O'}
                                    {feedback[index]?.type === 'incorrect' && `X (${feedback[index]?.key})`}
                                </span>
                            )}
                        </span>
                    ))}
                </div>
            ) : (
                <>
                    <div className="word-display" aria-live="polite">
                        {displayWord}
                    </div>
                    {displayTranslation && <div className="translation-display">{displayTranslation}</div>}
                    <div className="jamo-display">
                        {targetSequence.map((jamo, index) => (
                            <span key={index} className={index < typedCount ? 'typed' : (index === typedCount ? 'current' : 'untyped')}>
                                {jamo === ' ' ? '\u00A0' : jamo}
                            </span>
                        ))}
                    </div>
                </>
            )}
            <div className="virtual-keyboard">
                {layout.map((row, rowIndex) => (
                    <div className="key-row" key={rowIndex}>
                        {row.map((key) => {
                            const isHighlighted = targetKey?.code === key.code;
                            const isShiftHighlighted = needsShift && (key.code === 'ShiftLeft' || key.code === 'ShiftRight');
                            
                            return (
                                <div 
                                    className={`key ${isHighlighted || isShiftHighlighted ? 'highlight' : ''} ${key.display ? 'special-key' : ''}`} 
                                    key={key.code}
                                    style={{ flexGrow: key.flex }}
                                >
                                    {key.display ? (
                                        <span className="base-char">{key.display}</span>
                                    ) : (
                                        <>
                                            {key.shift && <span className="shift-char">{key.shift}</span>}
                                            <span className="base-char">{key.base}</span>
                                        </>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
};

const FRUITS = ['🍓', '🍊', '🍌', '🍇', '🍉', '🥝', '🍍', '🍑'];

const MousePractice = ({ onCorrect, onBack }: { onCorrect: (e: React.MouseEvent) => void, onBack: () => void }) => {
    const [fruitPos, setFruitPos] = useState({ x: 50, y: 50 });
    const [currentFruit, setCurrentFruit] = useState(FRUITS[0]);
    const [isVisible, setIsVisible] = useState(true);

    const moveFruit = useCallback(() => {
        setIsVisible(false);
        setTimeout(() => {
            const area = document.querySelector('.mouse-practice-area');
            if (area) {
                const rect = area.getBoundingClientRect();
                const x = Math.random() * (rect.width - 80);
                const y = Math.random() * (rect.height - 80);
                setFruitPos({ x, y });
                setCurrentFruit(FRUITS[Math.floor(Math.random() * FRUITS.length)]);
                setIsVisible(true);
            }
        }, 300);
    }, []);

    const handleClick = (e: React.MouseEvent) => {
        if (!isVisible) return;
        onCorrect(e);
        moveFruit();
    };

    return (
        <div className="screen">
            <BackButton onClick={onBack} />
            <h2>과일을 잡아봐!</h2>
            <div className="mouse-practice-area">
                {isVisible && (
                    <div 
                        className="fruit" 
                        style={{ left: fruitPos.x, top: fruitPos.y }} 
                        onClick={handleClick}
                        role="button"
                        aria-label={`catch the ${currentFruit}`}
                    >
                        {currentFruit}
                    </div>
                )}
            </div>
        </div>
    );
};

const ProgressReport = ({ stars, progressData, onBack }: { stars: number, progressData: Record<string, number>, onBack: () => void }) => {
    const sortedProgress = useMemo(() => {
        return Object.entries(progressData)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 10);
    }, [progressData]);

    const maxCount = sortedProgress.length > 0 ? sortedProgress[0][1] : 0;

    return (
        <div className="screen">
            <BackButton onClick={onBack} />
            <h2>학습 리포트</h2>
            <h3>오늘 모은 별: {stars}개! 🌟</h3>
            <div className="progress-report">
                <h4>많이 연습한 글자</h4>
                <div className="progress-chart">
                    {sortedProgress.map(([char, count]) => (
                        <div className="progress-bar-container" key={char}>
                            <span className="progress-label">{char}</span>
                            <div className="progress-bar" style={{ width: `${(count / (maxCount || 1)) * 80}%` }}>
                                {count}번
                            </div>
                        </div>
                    ))}
                     {sortedProgress.length === 0 && <p>아직 연습 기록이 없어요!</p>}
                </div>
            </div>
        </div>
    );
};


// --- App Component ---

const App = () => {
    const [screen, setScreen] = useState<Screen>('main');
    const [practiceMode, setPracticeMode] = useState<PracticeMode>('english');
    const [stars, setStars] = useState(0);
    const [correctInputs, setCorrectInputs] = useState(0);
    const [progressData, setProgressData] = useState<Record<string, number>>({});
    const [sparkles, setSparkles] = useState<{ id: number; x: number; y: number }[]>([]);
    const [isMuted, setIsMuted] = useState(false);
    const [volumeLevel, setVolumeLevel] = useState(2);

    useEffect(() => {
        if (isMuted && typeof window !== 'undefined' && 'speechSynthesis' in window) {
            window.speechSynthesis.cancel();
        }
    }, [isMuted]);

    const handleMuteToggle = () => {
        const nextMuted = !isMuted;
        if (nextMuted && typeof window !== 'undefined' && 'speechSynthesis' in window) {
            window.speechSynthesis.cancel();
        }
        setIsMuted(nextMuted);
    };

    const handleVolumeChange = (level: number) => {
        if (isMuted) setIsMuted(false);
        setVolumeLevel(level);
    };

    const addSparkle = (e: MouseEvent) => {
        const newSparkle = { id: Date.now(), x: e.clientX, y: e.clientY };
        setSparkles(prev => [...prev, newSparkle]);
        setTimeout(() => {
            setSparkles(prev => prev.filter(s => s.id !== newSparkle.id));
        }, 500);
    };

    const handleCorrectInput = useCallback((char?: string, e?: MouseEvent) => {
        const newCount = correctInputs + 1;
        setCorrectInputs(newCount);
        if (newCount > 0 && newCount % 10 === 0) {
            setStars(prev => prev + 1);
        }
        if (char) {
            setProgressData(prev => ({...prev, [char]: (prev[char] || 0) + 1}));
        }
        if (e) {
            addSparkle(e);
        }
    }, [correctInputs]);

    const handleSelectMode = (selectedScreen: Screen) => {
        if (selectedScreen === 'typing') {
            setPracticeMode('english');
        }
        setScreen(selectedScreen);
    };

    const handleSelectPractice = (mode: PracticeMode) => {
        setPracticeMode(mode);
        setScreen('typing');
    };

    const goBack = () => {
       if (screen === 'typing' || screen === 'mouse' || screen === 'progress') setScreen('main');
       if (screen === 'korean_menu') setScreen('keyboard_menu');
       if (screen === 'keyboard_menu') setScreen('main');
    };

    const renderScreen = () => {
        switch (screen) {
            case 'keyboard_menu':
                return <KeyboardMenu onSelectPractice={handleSelectMode} onBack={goBack} />;
            case 'korean_menu':
                return <KoreanMenu onSelectMode={handleSelectPractice} onBack={goBack} />;
            case 'typing':
                return <TypingPractice mode={practiceMode} onCorrect={(char) => handleCorrectInput(char)} onBack={goBack} isMuted={isMuted} volumeLevel={volumeLevel} />;
            case 'mouse':
                return <MousePractice onCorrect={(e) => handleCorrectInput(undefined, e as unknown as MouseEvent)} onBack={goBack} />;
            case 'progress':
                return <ProgressReport stars={stars} progressData={progressData} onBack={goBack} />;
            case 'main':
            default:
                return <MainMenu onSelectMode={handleSelectMode} />;
        }
    };

    return (
        <div className="app-container">
            <div className="top-controls">
                <SoundControls 
                    isMuted={isMuted}
                    onMuteToggle={handleMuteToggle}
                    volumeLevel={volumeLevel}
                    onVolumeChange={handleVolumeChange}
                />
                <StarDisplay count={stars} />
            </div>
            {renderScreen()}
            <div className="sparkle-container">
                {sparkles.map(s => <Sparkle key={s.id} x={s.x} y={s.y} />)}
            </div>
        </div>
    );
};

const container = document.getElementById('root');
if (container) {
    const root = createRoot(container);
    root.render(<App />);
}



