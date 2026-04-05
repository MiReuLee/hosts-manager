# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

Mac용 `/etc/hosts` 파일 관리 메뉴바 트레이 앱. 그룹별로 호스트 항목을 관리하고 on/off 토글 가능.

## 명령어

- `pnpm dev` — 개발 서버 실행 (Electron + Vite HMR)
- `pnpm build` — 프로덕션 빌드 (out/ 디렉토리에 출력)
- `pnpm package` — DMG/ZIP 패키징 (`electron-builder --mac`)

## 기술 스택

- **Electron** + **electron-vite** (main/preload/renderer 3중 빌드)
- **React 19** + **TypeScript** (렌더러)
- **Tailwind CSS v4** (`@tailwindcss/postcss` 플러그인, `postcss.config.js`)
- **menubar** 패키지 — 트레이 아이콘 클릭 시 윈도우 표시
- **electron-store** — 앱 상태 JSON 저장 (`~/Library/Application Support/hosts-manager/`)
- **@vscode/sudo-prompt** — hosts 파일 쓰기 시 sudo 권한 요청

## 아키텍처

### 프로세스 구조
- **Main** (`src/main/`) — Electron 메인 프로세스. 트레이, IPC 핸들러, hosts 파일 I/O
- **Preload** (`src/preload/`) — contextBridge로 렌더러에 안전한 API 노출
- **Renderer** (`src/renderer/`) — React UI. 그룹 사이드바 + 항목 리스트 2-패널 레이아웃

### /etc/hosts 관리 전략
앱은 hosts 파일에 마커(`# === Hosts Manager Start/End ===`)로 구분된 영역만 관리. 마커 밖 내용은 보존됨. 비활성 그룹은 `# ` 접두사로 주석 처리.

### 데이터 흐름
1. 모든 변경은 IPC를 통해 메인 프로세스에서 처리
2. `electron-store`에 앱 상태 저장 → `/etc/hosts`에 동기화 (sudo)
3. sudo 쓰기는 임시 파일 작성 후 `sudo cp`로 교체 (`hosts-file.ts`)

### IPC 채널 네이밍
`hosts:` 접두사 사용. 모든 핸들러는 업데이트된 전체 groups 배열을 반환.
