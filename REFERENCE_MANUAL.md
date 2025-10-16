# shakeForm API 리퍼런스 매뉴얼

`shakeForm`은 웹 컴포넌트 기술을 기반으로 한 재사용 가능한 폼 컴포넌트입니다. 이 문서는 모든 API, 속성, 메서드, 이벤트 및 스타일링 옵션에 대한 완전한 참조를 제공합니다.

---

## 목차

1. [컴포넌트 개요](#1-컴포넌트-개요)
2. [HTML 속성](#2-html-속성)
3. [JavaScript API](#3-javascript-api)
   - [메서드](#메서드)
   - [프로퍼티](#프로퍼티)
4. [필드 구조](#4-필드-구조)
5. [이벤트](#5-이벤트)
6. [스타일링](#6-스타일링)
   - [CSS 변수](#css-변수)
   - [테마](#테마)
7. [타입 정의](#7-타입-정의)
8. [예제 코드](#8-예제-코드)

---

## 1. 컴포넌트 개요

### 기본 사용법

```html
<script src="shakeForm.js"></script>

<shake-form id="myForm" title="문의하기" submit-text="제출"></shake-form>

<script>
  const form = document.getElementById('myForm');
  form.setFields([
    { name: 'email', label: '이메일', type: 'email', required: true }
  ]);

  form.addEventListener('formsubmit', (e) => {
    console.log(e.detail);
  });
</script>
```

### 기술 스택

- **Web Components**: Custom Elements, Shadow DOM
- **브라우저 호환성**: 모던 브라우저 (Chrome, Firefox, Safari, Edge)
- **의존성**: 없음 (Vanilla JavaScript)

---

## 2. HTML 속성

`shake-form` 요소는 다음 HTML 속성을 지원합니다.

### `title`

- **타입**: `string`
- **기본값**: `''` (빈 문자열)
- **설명**: 폼의 제목을 설정합니다. 빈 문자열이면 제목이 표시되지 않습니다.
- **예시**:
  ```html
  <shake-form title="문의하기"></shake-form>
  ```

### `submit-text`

- **타입**: `string`
- **기본값**: `'Submit'`
- **설명**: 제출 버튼의 텍스트를 설정합니다.
- **예시**:
  ```html
  <shake-form submit-text="전송하기"></shake-form>
  ```

### `theme`

- **타입**: `'light' | 'dark' | 'auto'`
- **기본값**: `'light'`
- **설명**: 폼의 색상 테마를 설정합니다.
  - `light`: 밝은 테마
  - `dark`: 어두운 테마
  - `auto`: 시스템 설정에 따라 자동으로 전환
- **예시**:
  ```html
  <shake-form theme="dark"></shake-form>
  ```

### `width`

- **타입**: `string` (CSS 너비 값)
- **기본값**: `'100%'`
- **설명**: 폼의 너비를 설정합니다. CSS 단위를 사용합니다.
- **예시**:
  ```html
  <shake-form width="600px"></shake-form>
  <shake-form width="80%"></shake-form>
  ```

---

## 3. JavaScript API

### 메서드

#### `setFields(fields: Field[]): void`

폼에 표시될 필드를 설정합니다. 기존 필드를 모두 교체합니다.

**매개변수**:
- `fields`: 필드 객체의 배열 ([필드 구조](#4-필드-구조) 참조)

**예시**:
```javascript
form.setFields([
  { name: 'name', label: '이름', type: 'text', required: true },
  { name: 'email', label: '이메일', type: 'email', required: true }
]);
```

---

#### `getFormData(): object`

현재 폼의 모든 데이터를 객체로 반환합니다.

**반환값**: 필드명을 키로, 입력값을 값으로 하는 객체

**예시**:
```javascript
const data = form.getFormData();
// { name: '홍길동', email: 'hong@example.com' }
```

---

#### `validate(): boolean`

모든 필드의 유효성을 검사합니다. 오류가 있는 필드는 오류 메시지가 표시됩니다.

**반환값**: 모든 필드가 유효하면 `true`, 하나라도 유효하지 않으면 `false`

**예시**:
```javascript
if (form.validate()) {
  console.log('폼이 유효합니다.');
} else {
  console.log('입력 오류가 있습니다.');
}
```

---

#### `reset(): void`

폼을 초기 상태로 리셋합니다. 모든 입력값이 지워지고 오류 메시지가 제거됩니다.

**예시**:
```javascript
form.reset();
```

---

#### `setTheme(theme: 'light' | 'dark' | 'auto'): void`

폼의 테마를 동적으로 변경합니다.

**매개변수**:
- `theme`: 테마 이름

**예시**:
```javascript
form.setTheme('dark');
```

---

#### `loadGoogleFont(fontName: string, weights?: number | number[]): void`

Google Fonts를 동적으로 로드하고 폼에 적용합니다.

**매개변수**:
- `fontName`: Google Font 이름 (예: `'Noto Sans KR'`, `'Roboto'`)
- `weights` (선택): 폰트 두께 (예: `400`, `[400, 700]`)

**예시**:
```javascript
// 기본 두께로 로드
form.loadGoogleFont('Noto Sans KR');

// 특정 두께 지정
form.loadGoogleFont('Roboto', [300, 400, 700]);
```

---

#### `loadWebFont(fontName: string, stylesheetUrl: string): void`

사용자 정의 웹폰트를 로드하고 적용합니다.

**매개변수**:
- `fontName`: 폰트 패밀리 이름
- `stylesheetUrl`: 폰트 CSS 파일의 URL

**예시**:
```javascript
form.loadWebFont('MyCustomFont', 'https://example.com/fonts/custom.css');
```

---

#### `setCSSVariables(variables: object): void`

Shadow DOM 내부의 CSS 변수를 설정하여 스타일을 커스터마이징합니다.

**매개변수**:
- `variables`: CSS 변수명과 값의 객체

**예시**:
```javascript
form.setCSSVariables({
  '--primary-color': '#ff5722',
  '--border-radius': '16px',
  '--font-size-base': '16px'
});
```

---

#### `applyCustomCSS(css: string): void`

Shadow DOM 내부에 커스텀 CSS를 주입합니다. 고급 스타일 커스터마이징에 사용됩니다.

**매개변수**:
- `css`: CSS 문자열

**예시**:
```javascript
form.applyCustomCSS(`
  .form-submit {
    background: linear-gradient(45deg, #FF6B6B, #4ECDC4);
  }
  .form-input:focus {
    transform: scale(1.02);
  }
`);
```

---

### 프로퍼티

#### `DEFAULT_FONT_STACK` (static)

- **타입**: `string`
- **설명**: 기본 폰트 스택 문자열
- **값**: `'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'`

---

## 4. 필드 구조

각 필드는 다음 속성을 가지는 객체입니다.

### 필수 속성

| 속성 | 타입 | 설명 |
|------|------|------|
| `name` | `string` | 필드의 고유 식별자 (데이터의 키로 사용됨) |
| `label` | `string` | 사용자에게 표시될 레이블 텍스트 |
| `type` | `FieldType` | 필드 타입 (아래 참조) |

### 필드 타입 (FieldType)

| 타입 | 설명 | options 필요 |
|------|------|:------------:|
| `'text'` | 텍스트 입력 | ❌ |
| `'email'` | 이메일 입력 (자동 검증) | ❌ |
| `'tel'` | 전화번호 입력 | ❌ |
| `'textarea'` | 여러 줄 텍스트 입력 | ❌ |
| `'select'` | 드롭다운 선택 | ✅ |
| `'radio'` | 라디오 버튼 (단일 선택) | ✅ |
| `'checkbox'` | 체크박스 (다중 선택) | ✅ |

### 선택 속성

| 속성 | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `required` | `boolean` | `false` | 필수 입력 필드 여부 |
| `placeholder` | `string` | `undefined` | 입력 필드의 플레이스홀더 텍스트 |
| `value` | `string \| string[]` | `''` | 기본값 (checkbox는 배열) |
| `options` | `Option[]` | `undefined` | select, radio, checkbox의 선택지 배열 |
| `width` | `string` | `'100%'` | 필드의 너비 (CSS 값) |
| `style` | `string` | `undefined` | 필드 요소에 적용될 인라인 CSS |
| `containerStyle` | `string` | `undefined` | 필드 컨테이너에 적용될 인라인 CSS |

### 유효성 검증 속성

| 속성 | 타입 | 설명 |
|------|------|------|
| `validation.pattern` | `string` | 정규식 패턴 문자열 |
| `validation.message` | `string` | 검증 실패 시 표시될 메시지 |
| `validate` | `(value: any) => boolean \| string` | 커스텀 검증 함수 (true 또는 오류 메시지 반환) |

### Option 타입

선택형 필드(`select`, `radio`, `checkbox`)의 옵션:

```typescript
type Option = string | { value: string; label: string };
```

**예시**:
```javascript
// 문자열 배열 (값과 레이블이 동일)
options: ['옵션1', '옵션2', '옵션3']

// 객체 배열 (값과 레이블이 다름)
options: [
  { value: 'opt1', label: '첫 번째 옵션' },
  { value: 'opt2', label: '두 번째 옵션' }
]
```

### 필드 예시

#### 기본 텍스트 필드
```javascript
{
  name: 'username',
  label: '사용자명',
  type: 'text',
  required: true,
  placeholder: '영문과 숫자만 입력'
}
```

#### 정규식 검증 필드
```javascript
{
  name: 'phone',
  label: '전화번호',
  type: 'tel',
  required: true,
  validation: {
    pattern: '^01[0-9]-\\d{4}-\\d{4}$',
    message: '010-0000-0000 형식으로 입력하세요.'
  }
}
```

#### 커스텀 검증 함수
```javascript
{
  name: 'age',
  label: '나이',
  type: 'text',
  required: true,
  validate: (value) => {
    const age = parseInt(value);
    if (isNaN(age)) return '숫자를 입력하세요.';
    if (age < 18) return '18세 이상만 가입할 수 있습니다.';
    if (age > 120) return '유효한 나이를 입력하세요.';
    return true;
  }
}
```

#### Select 필드
```javascript
{
  name: 'category',
  label: '카테고리',
  type: 'select',
  required: true,
  placeholder: '선택하세요',
  options: [
    { value: 'tech', label: '기술' },
    { value: 'sales', label: '영업' },
    { value: 'support', label: '지원' }
  ]
}
```

#### Checkbox 필드
```javascript
{
  name: 'interests',
  label: '관심 분야',
  type: 'checkbox',
  options: ['프론트엔드', '백엔드', 'DevOps'],
  value: ['프론트엔드'] // 기본 선택값
}
```

#### Radio 필드
```javascript
{
  name: 'gender',
  label: '성별',
  type: 'radio',
  required: true,
  options: [
    { value: 'M', label: '남성' },
    { value: 'F', label: '여성' },
    { value: 'O', label: '기타' }
  ]
}
```

#### 2열 레이아웃 필드
```javascript
[
  {
    name: 'firstName',
    label: '성',
    type: 'text',
    required: true,
    width: 'calc(50% - 8px)'
  },
  {
    name: 'lastName',
    label: '이름',
    type: 'text',
    required: true,
    width: 'calc(50% - 8px)'
  }
]
```

---

## 5. 이벤트

### `formsubmit`

폼이 제출되고 유효성 검사를 통과했을 때 발생합니다.

**이벤트 타입**: `CustomEvent`

**detail 객체**:
```typescript
{
  ...formData,           // 모든 필드의 값
  timestamp: string      // ISO 8601 형식의 타임스탬프
}
```

**예시**:
```javascript
form.addEventListener('formsubmit', (event) => {
  console.log('제출 시각:', event.detail.timestamp);
  console.log('데이터:', event.detail);

  // 서버로 전송
  fetch('/api/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(event.detail)
  });
});
```

---

### `formchange`

폼 내 필드의 값이 변경될 때마다 발생합니다.

**이벤트 타입**: `CustomEvent`

**detail 객체**: 현재 폼 데이터 전체

**예시**:
```javascript
form.addEventListener('formchange', (event) => {
  console.log('현재 데이터:', event.detail);

  // 실시간 자동 저장
  localStorage.setItem('formDraft', JSON.stringify(event.detail));
});
```

---

## 6. 스타일링

### CSS 변수

`setCSSVariables()` 메서드나 `:host` 선택자를 통해 다음 CSS 변수를 커스터마이징할 수 있습니다.

#### 컨테이너 & 레이아웃

| 변수명 | 기본값 | 설명 |
|--------|--------|------|
| `--form-width` | `100%` | 폼 전체 너비 |
| `--container-bg` | `#ffffff` | 컨테이너 배경색 |
| `--container-padding` | `24px` | 컨테이너 내부 여백 |
| `--container-shadow` | `0 4px 12px rgba(0,0,0,0.05)` | 컨테이너 그림자 |
| `--border-radius` | `12px` | 테두리 둥글기 |
| `--border-color` | `#e0e0e0` | 테두리 색상 |
| `--field-gap` | `16px` | 필드 간 간격 |

#### 색상

| 변수명 | 기본값 | 설명 |
|--------|--------|------|
| `--text-color` | `#333333` | 기본 텍스트 색상 |
| `--title-color` | `var(--text-color)` | 제목 색상 |
| `--label-color` | `var(--text-color)` | 레이블 색상 |
| `--primary-color` | `#3f51b5` | 주 색상 |
| `--error-color` | `#e53935` | 오류 색상 |

#### 입력 필드

| 변수명 | 기본값 | 설명 |
|--------|--------|------|
| `--input-bg` | `#ffffff` | 입력 필드 배경색 |
| `--input-text-color` | `var(--text-color)` | 입력 텍스트 색상 |
| `--input-border-color` | `#ced4da` | 입력 필드 테두리 색상 |
| `--input-focus-border` | `var(--primary-color)` | 포커스 시 테두리 색상 |
| `--input-focus-shadow` | `rgba(63, 81, 181, 0.1)` | 포커스 시 그림자 |

#### 버튼

| 변수명 | 기본값 | 설명 |
|--------|--------|------|
| `--button-bg` | `linear-gradient(135deg, #3f51b5 0%, #5c6bc0 100%)` | 버튼 배경 |
| `--button-bg-hover` | `linear-gradient(135deg, #3949ab 0%, #5461ac 100%)` | 버튼 호버 배경 |
| `--button-text-color` | `#ffffff` | 버튼 텍스트 색상 |

#### 폰트

| 변수명 | 기본값 | 설명 |
|--------|--------|------|
| `--font-family` | 시스템 폰트 스택 | 폰트 패밀리 |
| `--font-size-base` | `14px` | 기본 폰트 크기 |
| `--font-size-title` | `28px` | 제목 폰트 크기 |
| `--font-size-button` | `16px` | 버튼 폰트 크기 |
| `--font-weight-medium` | `500` | 중간 두께 |
| `--font-weight-bold` | `700` | 굵은 두께 |

### CSS 변수 적용 예시

#### JavaScript로 적용
```javascript
form.setCSSVariables({
  '--primary-color': '#ff5722',
  '--border-radius': '20px',
  '--font-size-base': '16px',
  '--button-bg': 'linear-gradient(45deg, #FF6B6B, #4ECDC4)'
});
```

#### CSS로 적용
```css
shake-form {
  --primary-color: #2196F3;
  --border-radius: 8px;
  --container-padding: 32px;
}
```

### 테마

#### Light 테마 (기본)
```html
<shake-form theme="light"></shake-form>
```

#### Dark 테마
```html
<shake-form theme="dark"></shake-form>
```

**Dark 테마 CSS 변수**:
- `--container-bg`: `#212121`
- `--text-color`: `#f5f5f5`
- `--border-color`: `#424242`
- `--input-bg`: `#333333`
- `--input-border-color`: `#555555`

#### Auto 테마 (시스템 설정 따름)
```html
<shake-form theme="auto"></shake-form>
```

### 커스텀 CSS

고급 스타일 커스터마이징을 위해 `applyCustomCSS()` 메서드를 사용할 수 있습니다.

```javascript
form.applyCustomCSS(`
  .form-container {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
  }

  .form-input, .form-select, .form-textarea {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.3);
    color: white;
  }

  .form-input::placeholder {
    color: rgba(255, 255, 255, 0.6);
  }

  .form-submit {
    background: white;
    color: #667eea;
    font-weight: bold;
  }

  .form-submit:hover {
    transform: translateY(-3px) scale(1.05);
    box-shadow: 0 10px 25px rgba(0,0,0,0.2);
  }
`);
```

---

## 7. 타입 정의

TypeScript를 사용하는 경우 참고할 수 있는 타입 정의입니다.

```typescript
// 필드 타입
type FieldType = 'text' | 'email' | 'tel' | 'textarea' | 'select' | 'radio' | 'checkbox';

// 옵션 타입
type Option = string | { value: string; label: string };

// 필드 인터페이스
interface Field {
  // 필수
  name: string;
  label: string;
  type: FieldType;

  // 선택
  required?: boolean;
  placeholder?: string;
  value?: string | string[];
  options?: Option[];

  // 스타일
  width?: string;
  style?: string;
  containerStyle?: string;

  // 검증
  validation?: {
    pattern?: string;
    message?: string;
  };
  validate?: (value: any) => boolean | string;
}

// 폼 데이터 인터페이스
interface FormData {
  [key: string]: string | string[];
}

// 제출 이벤트 detail 인터페이스
interface FormSubmitDetail extends FormData {
  timestamp: string;
}

// 이벤트 타입
interface FormSubmitEvent extends CustomEvent {
  detail: FormSubmitDetail;
}

interface FormChangeEvent extends CustomEvent {
  detail: FormData;
}
```

---

## 8. 예제 코드

### 완전한 예제: 회원가입 폼

```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>회원가입</title>
  <script src="shakeForm.js"></script>
  <style>
    body {
      max-width: 600px;
      margin: 50px auto;
      padding: 20px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }

    #result {
      margin-top: 20px;
      padding: 15px;
      background: #f5f5f5;
      border-radius: 8px;
      display: none;
    }

    #result.show {
      display: block;
    }
  </style>
</head>
<body>
  <shake-form
    id="signupForm"
    title="회원가입"
    submit-text="가입하기"
    theme="light">
  </shake-form>

  <div id="result"></div>

  <script>
    const form = document.getElementById('signupForm');
    const resultDiv = document.getElementById('result');

    // 필드 정의
    const fields = [
      {
        name: 'username',
        label: '사용자 ID',
        type: 'text',
        required: true,
        placeholder: '영문 소문자와 숫자 5-12자',
        validation: {
          pattern: '^[a-z0-9]{5,12}$',
          message: 'ID는 5~12자의 영문 소문자와 숫자로만 구성해야 합니다.'
        }
      },
      {
        name: 'email',
        label: '이메일',
        type: 'email',
        required: true,
        placeholder: 'example@email.com'
      },
      {
        name: 'password',
        label: '비밀번호',
        type: 'text',
        required: true,
        placeholder: '8자 이상',
        validate: (value) => {
          if (value.length < 8) return '비밀번호는 8자 이상이어야 합니다.';
          if (!/[A-Z]/.test(value)) return '대문자를 하나 이상 포함해야 합니다.';
          if (!/[0-9]/.test(value)) return '숫자를 하나 이상 포함해야 합니다.';
          return true;
        }
      },
      {
        name: 'firstName',
        label: '성',
        type: 'text',
        required: true,
        width: 'calc(50% - 8px)'
      },
      {
        name: 'lastName',
        label: '이름',
        type: 'text',
        required: true,
        width: 'calc(50% - 8px)'
      },
      {
        name: 'phone',
        label: '연락처',
        type: 'tel',
        required: true,
        placeholder: '010-0000-0000',
        validation: {
          pattern: '^01[0-9]-\\d{4}-\\d{4}$',
          message: '올바른 전화번호 형식이 아닙니다. (예: 010-1234-5678)'
        }
      },
      {
        name: 'gender',
        label: '성별',
        type: 'radio',
        required: true,
        options: [
          { value: 'M', label: '남성' },
          { value: 'F', label: '여성' },
          { value: 'O', label: '기타' }
        ]
      },
      {
        name: 'interests',
        label: '관심 분야 (다중 선택 가능)',
        type: 'checkbox',
        options: [
          '기술',
          '디자인',
          '마케팅',
          '영업',
          '기타'
        ]
      },
      {
        name: 'bio',
        label: '자기소개',
        type: 'textarea',
        placeholder: '간단한 자기소개를 작성해주세요.',
        style: 'min-height: 120px;'
      }
    ];

    form.setFields(fields);

    // 스타일 커스터마이징
    form.setCSSVariables({
      '--primary-color': '#2196F3',
      '--border-radius': '12px',
      '--font-size-base': '15px'
    });

    // 폰트 로드
    form.loadGoogleFont('Noto Sans KR', [400, 700]);

    // 실시간 변경 감지
    form.addEventListener('formchange', (e) => {
      console.log('현재 입력값:', e.detail);
      // 로컬 스토리지에 임시 저장
      localStorage.setItem('signupDraft', JSON.stringify(e.detail));
    });

    // 제출 처리
    form.addEventListener('formsubmit', async (e) => {
      console.log('제출된 데이터:', e.detail);

      // 로딩 표시 (실제로는 버튼 비활성화 등)
      resultDiv.textContent = '처리 중...';
      resultDiv.className = 'show';

      try {
        // 서버로 전송 (예시)
        const response = await fetch('/api/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(e.detail)
        });

        if (response.ok) {
          resultDiv.textContent = '✅ 회원가입이 완료되었습니다!';
          resultDiv.style.background = '#e8f5e9';

          // 임시 저장 데이터 삭제
          localStorage.removeItem('signupDraft');

          // 폼 리셋
          setTimeout(() => form.reset(), 2000);
        } else {
          throw new Error('서버 오류');
        }
      } catch (error) {
        resultDiv.textContent = '❌ 오류가 발생했습니다. 다시 시도해주세요.';
        resultDiv.style.background = '#ffebee';
      }
    });

    // 페이지 로드 시 임시 저장된 데이터 복구
    window.addEventListener('load', () => {
      const draft = localStorage.getItem('signupDraft');
      if (draft && confirm('작성 중이던 내용을 복구하시겠습니까?')) {
        const data = JSON.parse(draft);
        // 각 필드에 값 설정 (실제 구현 시 필요)
        console.log('복구할 데이터:', data);
      }
    });
  </script>
</body>
</html>
```

### 예제: 다크 모드 토글

```html
<button id="themeToggle">🌙 다크 모드</button>
<shake-form id="myForm"></shake-form>

<script>
  const form = document.getElementById('myForm');
  const toggle = document.getElementById('themeToggle');
  let isDark = false;

  toggle.addEventListener('click', () => {
    isDark = !isDark;
    form.setTheme(isDark ? 'dark' : 'light');
    toggle.textContent = isDark ? '☀️ 라이트 모드' : '🌙 다크 모드';
  });
</script>
```

### 예제: 동적 필드 추가/제거

```html
<button id="addField">+ 필드 추가</button>
<button id="removeField">- 필드 제거</button>
<shake-form id="dynamicForm"></shake-form>

<script>
  const form = document.getElementById('dynamicForm');
  let fieldCounter = 0;
  let currentFields = [
    { name: 'name', label: '이름', type: 'text', required: true }
  ];

  form.setFields(currentFields);

  document.getElementById('addField').addEventListener('click', () => {
    fieldCounter++;
    const newField = {
      name: `dynamic_${fieldCounter}`,
      label: `동적 필드 ${fieldCounter}`,
      type: 'text',
      placeholder: '동적으로 추가된 필드입니다'
    };
    currentFields.push(newField);
    form.setFields(currentFields);
  });

  document.getElementById('removeField').addEventListener('click', () => {
    if (currentFields.length > 1) {
      currentFields.pop();
      form.setFields(currentFields);
    } else {
      alert('최소 1개의 필드가 필요합니다.');
    }
  });
</script>
```

### 예제: 조건부 필드 표시

```html
<shake-form id="conditionalForm"></shake-form>

<script>
  const form = document.getElementById('conditionalForm');

  const baseFields = [
    {
      name: 'userType',
      label: '사용자 유형',
      type: 'radio',
      required: true,
      options: [
        { value: 'individual', label: '개인' },
        { value: 'business', label: '사업자' }
      ]
    },
    { name: 'name', label: '이름', type: 'text', required: true }
  ];

  const businessFields = [
    { name: 'companyName', label: '회사명', type: 'text', required: true },
    { name: 'businessNumber', label: '사업자등록번호', type: 'text', required: true }
  ];

  form.setFields(baseFields);

  form.addEventListener('formchange', (e) => {
    const userType = e.detail.userType;

    if (userType === 'business') {
      // 사업자 필드 추가
      form.setFields([...baseFields, ...businessFields]);
    } else if (userType === 'individual') {
      // 개인 필드만 표시
      form.setFields(baseFields);
    }
  });
</script>
```

---

## 추가 참고 자료

- **초보자용 안내서**: [BEGINNER_GUIDE.md](./BEGINNER_GUIDE.md) - 기본 사용법과 간단한 예제
- **개발자용 고급 안내서**: [ADVANCED_GUIDE.md](./ADVANCED_GUIDE.md) - 고급 기능과 상세 API 설명
- **사용 예시 모음**: [EXAMPLES.md](./EXAMPLES.md) - 다양한 실전 예제 코드
- **README**: [README.md](./README.md) - 프로젝트 개요 및 빠른 시작

---

## 버전 정보

- **현재 버전**: 1.0.0
- **최소 브라우저 요구사항**: Chrome 67+, Firefox 63+, Safari 11.1+, Edge 79+
- **라이선스**: MIT

---

## 문의 및 지원

이슈나 개선 제안이 있으시면 프로젝트 저장소에 이슈를 등록해주세요.

**참고**: 이 컴포넌트는 Shadow DOM을 사용하므로, 외부 CSS는 내부 요소에 영향을 주지 않습니다. 스타일링을 위해서는 반드시 제공된 API(`setCSSVariables`, `applyCustomCSS`)를 사용해야 합니다.
