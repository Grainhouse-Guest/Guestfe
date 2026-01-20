---
description: 로컬 테스트 시 사용하는 계정 정보 및 테스트 방법
---

# 테스트 계정 정보

## 관리자 계정
- **아이디**: admin
- **비밀번호**: 12341234

## 테스트 절차

// turbo-all

1. 개발 서버 실행
```bash
cd /Users/gwagseongjun/Desktop/guest-service/Guestfe && npm run dev
```

2. 브라우저에서 http://localhost:5173 접속

3. 위 계정 정보로 로그인

## 주요 테스트 페이지
- 게스트 리스트: 게스트 추가/수정/삭제
- 도어 체크인: 입장 처리/취소
- 스탭 관리: 계정 생성/수정/삭제 (관리자만)
- 대시보드: 통계 확인 (관리자만)
