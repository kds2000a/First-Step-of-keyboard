# Todo.md: 문제점 및 수정 내역

이 문서는 앱 개발 과정에서 발생한 문제점과 해결 과정을 기록하기 위해 작성되었습니다.

## 2024-05-22 ~ 2024-06-04: 렌더링 오류 최종 해결

### 문제점 요약
- **1차 오류**: `Uncaught Error: Minified React error #31`
  - **원인**: `index.html`의 `importmap`에 React 18과 React 19 버전이 충돌하는 경로가 함께 존재했습니다. 이 문제가 수정되지 않은 파일로 인해 계속 재발했습니다.
- **2차 오류**: `Uncaught TypeError: Failed to resolve module specifier "react/jsx-runtime"`
  - **원인**: 1차 오류 해결 후, Babel JSX 변환에 필요한 `react/jsx-runtime` 모듈의 경로가 `importmap`에 누락되어 있었습니다.

### 최종 해결 조치
- `index.html`의 `importmap`을 아래와 같이 정리하여 모든 렌더링 문제를 최종적으로 해결했습니다.

**수정 전 `importmap` (문제가 있는 상태):**
```json
{
  "imports": {
    "react": "https://esm.sh/react@18.3.1",
    "react-dom/client": "https://esm.sh/react-dom@18.3.1/client",
    "react/jsx-runtime": "https://esm.sh/react@18.3.1/jsx-runtime",
    "react-dom/": "https://aistudiocdn.com/react-dom@^19.1.1/",
    "react/": "https://aistudiocdn.com/react@^19.1.1/"
  }
}
```

**수정 후 `importmap` (최종 버전):**
```json
{
  "imports": {
    "react": "https://esm.sh/react@18.3.1",
    "react-dom/client": "https://esm.sh/react-dom@18.3.1/client",
    "react/jsx-runtime": "https://esm.sh/react@18.3.1/jsx-runtime"
  }
}
```