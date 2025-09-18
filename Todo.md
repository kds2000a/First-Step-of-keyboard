# Todo.md: 문제점 및 수정 내역

이 문서는 앱 개발 과정에서 발생한 문제점과 해결 과정을 기록하기 위해 작성되었습니다.

## 2024-05-22 ~ 2024-06-03: 메인 화면 렌더링 오류 반복 (해결됨)

### 문제점
- 앱 실행 시 `Uncaught Error: Minified React error #31` 오류가 지속적으로 발생하며 메인 화면이 렌더링되지 않았습니다.
- **근본 원인**: `index.html` 파일의 `importmap` 설정에서 서로 다른 두 가지 버전의 React 라이브러리(React 18과 React 19)를 동시에 불러오도록 설정되어 있었습니다.

### 최종 해결
- 수차례의 실패 끝에, `index.html` 파일의 `importmap`에서 충돌을 일으키는 경로를 **실제로, 그리고 완전히 제거**하여 길고 반복적인 문제를 최종적으로 해결했습니다.

---

## 2024-06-04: JSX 런타임 모듈 확인 오류 해결

### 사용자 요청
```
Fix the following errors:
Uncaught TypeError: Failed to resolve module specifier "react/jsx-runtime". Relative references must start with either "/", "./", or "../".
```

### 문제점
- 이전의 React 버전 충돌 문제가 해결된 후, 새로운 오류가 발생했습니다.
- Babel이 JSX 코드를 변환할 때 `react/jsx-runtime` 모듈을 가져오도록 하는데, `index.html`의 `importmap`에 이 모듈의 경로가 정의되어 있지 않아 브라우저가 파일을 찾지 못하는 문제였습니다.

### 수정 내역
- **파일**: `index.html`
- **내용**: `importmap`에 `react/jsx-runtime`에 대한 경로를 추가하여, 브라우저가 JSX 런타임 모듈을 올바르게 찾을 수 있도록 수정했습니다.

**수정 전 `importmap`:**
```json
{
  "imports": {
    "react": "https://esm.sh/react@18.3.1",
    "react-dom/client": "https://esm.sh/react-dom@18.3.1/client"
  }
}
```

**수정 후 `importmap`:**
```json
{
  "imports": {
    "react": "https://esm.sh/react@18.3.1",
    "react-dom/client": "https://esm.sh/react-dom@18.3.1/client",
    "react/jsx-runtime": "https://esm.sh/react@18.3.1/jsx-runtime"
  }
}
```