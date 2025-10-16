# shakeForm 개발자용 고급 안내서

이 문서는 `shakeForm` 웹 컴포넌트의 고급 기능과 커스터마이징 방법을 다룹니다. JavaScript API, 동적 제어, 스타일링 심화 등 개발자를 위한 상세 정보를 제공합니다.

---

## 📚 목차

1. [주요 API 요약](#1-주요-api-요약)
2. [필드(Field) 상세 설정](#2-필드-상세-설정)
3. [동적 제어 및 이벤트 핸들링](#3-동적-제어-및-이벤트-핸들링)
4. [고급 스타일링](#4-고급-스타일링)
5. [유효성 검증 심화](#5-유효성-검증-심화)
6. [전체 코드 예시](#6-전체-코드-예시)

---

## 1. 주요 API 요약

`shake-form` 요소의 인스턴스에서 다음 메서드들을 사용할 수 있습니다.

- `setFields(fields: Field[])`: 폼 필드를 정의하거나 교체합니다.
- `getFormData(): object`: 현재 폼 데이터를 객체 형태로 반환합니다.
- `validate(): boolean`: 모든 필드의 유효성을 검사하고 결과를 반환합니다.
- `reset()`: 폼을 초기 상태로 리셋합니다.
- `setTheme(theme: 'light' | 'dark' | 'auto')`: 테마를 동적으로 변경합니다.
- `loadGoogleFont(fontName: string, weights?: number[])`: Google Fonts를 로드하고 적용합니다.
- `loadWebFont(fontName: string, url: string, options?: object)`: 사용자 정의 웹폰트를 로드합니다.
- `applyFontFamily(fontFamily: string)`: 폰트 패밀리를 적용합니다.
- `setCSSVariables(variables: object)`: Shadow DOM 내부의 CSS 변수를 설정합니다.
- `applyCustomCSS(css: string)`: Shadow DOM 내부에 커스텀 CSS 스타일 시트를 주입합니다.

---

## 2. 필드(Field) 상세 설정

`setFields`에 전달되는 필드 객체는 다양한 속성을 가질 수 있습니다.

### 필드 타입

- **기본**: `text`, `email`, `tel`, `textarea`
- **선택형**: `select`, `checkbox`, `radio`

### 필드 구조 (TypeScript 기준)

```typescript
interface Field {
  // 필수
  name: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'textarea' | 'select' | 'checkbox' | 'radio';

  // 선택
  required?: boolean;
  placeholder?: string;
  value?: string | string[]; // 기본값 (checkbox는 배열)
  options?: { value: string; label: string }[] | string[]; // select, radio, checkbox 옵션

  // 스타일링
  width?: string; // 예: '50%', 'calc(50% - 8px)'
  style?: string; // 필드 자체에 적용될 인라인 스타일
  containerStyle?: string; // 필드를 감싸는 컨테이너에 적용될 스타일

  // 고급
  validation?: {
    pattern?: string; // 정규식 패턴
    message?: string; // 오류 메시지
  };
  validate?: (value: any) => boolean | string; // 커스텀 유효성 검사 함수
}
```

### 예시: 2열 레이아웃 및 `select` 옵션

`width` 속성을 활용하여 필드를 나란히 배치할 수 있습니다. `options`는 객체 배열 또는 문자열 배열로 지정 가능합니다.

```javascript
const fields = [
  { name: 'firstName', label: '성', type: 'text', required: true, width: 'calc(50% - 8px)' },
  { name: 'lastName', label: '이름', type: 'text', required: true, width: 'calc(50% - 8px)' },
  {
    name: 'category',
    label: '카테고리',
    type: 'select',
    required: true,
    // 값과 레이블이 다른 경우 객체 배열 사용
    options: [
      { value: 'tech', label: '기술' },
      { value: 'sales', label: '영업' },
    ]
  }
];
form.setFields(fields);
```

---

## 3. 동적 제어 및 이벤트 핸들링

### 이벤트

- `formsubmit`: 유효성 검사를 통과한 폼이 제출될 때 발생. `event.detail`에 폼 데이터(타임스탬프 포함)가 담겨 있습니다.
- `formchange`: 폼 내부의 값이 변경될 때마다 발생. `event.detail`에 현재 전체 폼 데이터가 담겨 있습니다.

### 예시: 동적으로 필드 추가 및 리셋

```html
<button id="add-field">필드 추가</button>
<button id="reset-form">리셋</button>
<shake-form id="dynamic-form"></shake-form>

<script>
  const form = document.getElementById('dynamic-form');
  let currentFields = [{ name: 'email', label: '이메일', type: 'email' }];
  form.setFields(currentFields);

  document.getElementById('add-field').addEventListener('click', () => {
    const newField = {
      name: `field_${Date.now()}`,
      label: '동적 필드',
      type: 'text'
    };
    currentFields.push(newField);
    form.setFields(currentFields); // setFields를 다시 호출하여 폼을 갱신
  });

  document.getElementById('reset-form').addEventListener('click', () => {
    form.reset();
  });

  form.addEventListener('formsubmit', (e) => {
    console.log('제출 데이터:', e.detail);
    // fetch('/api/submit', { method: 'POST', body: JSON.stringify(e.detail) });
  });
</script>
```

---

## 4. 고급 스타일링

### CSS 변수 활용 (권장)

가장 안전하고 쉬운 방법입니다. `setCSSVariables` 메서드로 주요 디자인 토큰을 변경할 수 있습니다.

```javascript
form.setCSSVariables({
  // 색상
  '--primary-color': '#6a11cb',
  '--button-bg': 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',
  '--button-text-color': '#fff',

  // 폰트
  '--font-size-base': '15px',
  '--font-weight-bold': '600',

  // 레이아웃
  '--container-padding': '30px',
  '--field-gap': '20px',
  '--border-radius': '8px',
});
```

### 커스텀 CSS 주입

`applyCustomCSS`를 사용하면 Shadow DOM 내부에 직접 스타일을 주입하여 세밀한 제어가 가능합니다.

```javascript
const css = `
  .form-input:focus {
    box-shadow: 0 0 10px rgba(var(--primary-rgb), 0.3);
  }
  .form-submit {
    transition: transform 0.2s ease;
  }
  .form-submit:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(0,0,0,0.15);
  }
`;
form.applyCustomCSS(css);
```

---

## 5. 유효성 검증 심화

필드별로 정규식(`pattern`) 또는 커스텀 함수(`validate`)를 사용하여 복잡한 유효성 검증 로직을 구현할 수 있습니다.

### 정규식 사용

```javascript
const fields = [{
  name: 'userId',
  label: '사용자 ID',
  type: 'text',
  required: true,
  validation: {
    pattern: '^[a-z0-9_]{5,15}$',
    message: 'ID는 5~15자의 영문 소문자, 숫자, 밑줄(_)만 사용할 수 있습니다.'
  }
}];
```

### 커스텀 함수 사용

함수는 `true` 또는 `에러 메시지(string)`를 반환해야 합니다.

```javascript
const fields = [{
  name: 'password_confirm',
  label: '비밀번호 확인',
  type: 'password',
  required: true,
  validate: (value) => {
    const password = form.getFormData().password;
    return value === password || '비밀번호가 일치하지 않습니다.';
  }
}];
```

---

## 6. 전체 코드 예시

아래는 Google Fonts 로드, CSS 변수 설정, 2열 레이아웃, 커스텀 유효성 검증을 모두 포함하는 종합 예시입니다.

```html
<shake-form id="advanced-form"></shake-form>

<script>
  const form = document.getElementById('advanced-form');

  // 1. 폰트 및 테마 설정
  form.setAttribute('title', '고급 신청서');
  form.loadGoogleFont('Inter', [400, 700]);
  form.setTheme('auto');

  // 2. CSS 변수로 스타일 커스터마이징
  form.setCSSVariables({
    '--primary-color': '#3498db',
    '--container-bg': '#f8f9fa',
    '--border-radius': '5px',
  });

  // 3. 필드 정의 (레이아웃 및 유효성 검증 포함)
  const fields = [
    { name: 'name', label: '이름', type: 'text', required: true, width: 'calc(50% - 10px)' },
    {
      name: 'nickname',
      label: '닉네임',
      type: 'text',
      required: true,
      width: 'calc(50% - 10px)',
      validation: {
        pattern: '^\\S{3,10}$',
        message: '공백 없이 3~10자로 입력해주세요.'
      }
    },
    { name: 'email', label: '이메일', type: 'email', required: true },
    {
      name: 'subscribe',
      label: '뉴스레터 구독',
      type: 'checkbox',
      options: ['마케팅 정보 수신에 동의합니다.']
    },
    {
      name: 'message',
      label: '남기실 말씀',
      type: 'textarea',
      style: 'min-height: 120px; font-family: monospace;'
    }
  ];
  form.setFields(fields);

  // 4. 이벤트 리스너
  form.addEventListener('formsubmit', (e) => {
    console.log('Submitted Data:', e.detail);
    alert('신청이 완료되었습니다.');
  });
</script>
```
