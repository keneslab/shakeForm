# shakeForm 사용 예시

이 문서는 `shake-form` 웹 컴포넌트의 다양한 사용 예시를 제공합니다. `README.md`에서 설명하는 기본 개념을 바탕으로, 실제 코드 예제를 통해 컴포넌트를 어떻게 활용할 수 있는지 보여줍니다.

## 목차

1. [전체 필드 구성 예시](#1-전체-필드-구성-예시)
2. [유효성 검증 예시](#2-유효성-검증-예시)
3. [테마 시스템 예시](#3-테마-시스템-예시)
4. [폰트 커스터마이징 예시](#4-폰트-커스터마이징-예시)
5. [스타일 커스터마이징 예시](#5-스타일-커스터마이징-예시)
    - [CSS 변수 사용](#css-변수-사용)
    - [커스텀 CSS 주입](#커스텀-css-주입)
    - [필드별 스타일 적용](#필드별-스타일-적용)
6. [동적 제어 예시](#6-동적-제어-예시)

---

## 1. 전체 필드 구성 예시

모든 종류의 필드를 포함하는 종합적인 폼 구성 예시입니다.

```html
<shake-form id="full-form" title="종합 신청서"></shake-form>

<script>
  const fullForm = document.getElementById('full-form');

  const allFields = [
    // Text
    { name: 'fullName', label: '성명', type: 'text', required: true, placeholder: '홍길동' },
    // Email
    { name: 'email', label: '이메일', type: 'email', required: true, placeholder: 'example@email.com' },
    // Tel
    { name: 'phone', label: '연락처', type: 'tel', placeholder: '010-1234-5678' },
    // Select
    {
      name: 'inquiryType',
      label: '문의 유형',
      type: 'select',
      required: true,
      options: [
        { value: 'product', label: '제품 문의' },
        { value: 'service', label: '서비스 문의' },
        { value: 'support', label: '기술 지원' },
        { value: 'other', label: '기타' }
      ]
    },
    // Radio
    {
      name: 'experience',
      label: '경력',
      type: 'radio',
      required: true,
      options: [
        { value: 'entry', label: '신입' },
        { value: 'junior', label: '주니어 (1-3년)' },
        { value: 'senior', label: '시니어 (3년 이상)' }
      ]
    },
    // Checkbox
    {
      name: 'interests',
      label: '관심 분야 (다중 선택)',
      type: 'checkbox',
      options: [
        { value: 'frontend', label: '프론트엔드' },
        { value: 'backend', label: '백엔드' },
        { value: 'devops', label: '데브옵스' },
        { value: 'ai', label: '인공지능' }
      ]
    },
    // Textarea
    {
      name: 'message',
      label: '문의 내용',
      type: 'textarea',
      required: true,
      placeholder: '문의 내용을 자세히 입력해주세요.',
      style: 'min-height: 150px;'
    }
  ];

  fullForm.setFields(allFields);

  fullForm.addEventListener('formsubmit', (e) => {
    alert('폼이 제출되었습니다!');
    console.log(e.detail);
  });
</script>
```

## 2. 유효성 검증 예시

정규식을 사용하여 사용자 정의 유효성 검증 규칙을 추가하는 방법입니다.

```javascript
const validationFields = [
  {
    name: 'userId',
    label: '사용자 ID',
    type: 'text',
    required: true,
    validation: {
      pattern: '^[a-z0-9]{5,12}$',
      message: 'ID는 5~12자의 영문 소문자와 숫자로만 구성해야 합니다.'
    }
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
  }
];

form.setFields(validationFields);
```

## 3. 테마 시스템 예시

HTML 속성 또는 JavaScript API를 사용하여 테마를 변경하고, 시스템 설정에 따라 자동으로 테마가 바뀌도록 할 수 있습니다.

### HTML로 테마 설정

```html
<!-- 다크 테마 -->
<shake-form theme="dark"></shake-form>

<!-- 시스템 설정 자동 감지 -->
<shake-form theme="auto"></shake-form>
```

### JavaScript로 테마 제어

```html
<div id="theme-controls">
  <button onclick="changeTheme('light')">☀️ Light</button>
  <button onclick="changeTheme('dark')">🌙 Dark</button>
  <button onclick="changeTheme('auto')">🔄 Auto</button>
</div>
<shake-form id="theme-form"></shake-form>

<script>
  const themeForm = document.getElementById('theme-form');
  function changeTheme(theme) {
    themeForm.setTheme(theme);
  }
</script>
```

## 4. 폰트 커스터마이징 예시

Google Fonts 또는 직접 호스팅하는 웹폰트를 로드하여 폼에 적용할 수 있습니다.

### Google Fonts 사용

```javascript
const form = document.querySelector('shake-form');

// 'Noto Sans KR' 폰트의 400, 700 굵기를 로드하고 적용
form.loadGoogleFont('Noto Sans KR', [400, 700]);

// 폰트 크기 조절
form.setCSSVariables({
  '--font-size-base': '16px',
  '--font-size-title': '26px'
});
```

### 웹폰트 직접 로드

```javascript
const form = document.querySelector('shake-form');

// Pretendard 폰트를 CDN에서 로드하여 적용
form.loadWebFont(
  'Pretendard',
  'https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/woff2/Pretendard-Regular.woff2',
  { weight: '400', style: 'normal' }
);
form.loadWebFont(
  'Pretendard',
  'https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/woff2/Pretendard-Bold.woff2',
  { weight: '700', 'style': 'normal' }
);
```

## 5. 스타일 커스터마이징 예시

### CSS 변수 사용

가장 쉽고 권장되는 방법입니다. 주요 스타일 속성을 변경할 수 있습니다.

```javascript
const form = document.querySelector('shake-form');

// 브랜드 색상으로 버튼과 포커스 색상 변경
form.setCSSVariables({
  '--button-bg': '#e74c3c',
  '--button-bg-hover': '#c0392b',
  '--input-focus-border': '#e74c3c',
  '--border-radius': '20px',
  '--container-padding': '40px'
});
```

### 커스텀 CSS 주입

`applyCustomCSS` 메서드를 사용하여 복잡한 스타일을 적용합니다.

```javascript
const form = document.querySelector('shake-form');

const customCSS = `
  /* 입력 필드 포커스 시 애니메이션 */
  .form-input:focus, .form-textarea:focus {
    transform: scale(1.02);
    box-shadow: 0 0 15px rgba(52, 152, 219, 0.2);
  }

  /* 그라데이션 버튼 */
  .form-submit {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    transition: transform 0.2s, box-shadow 0.2s;
  }
  .form-submit:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
  }
`;

form.applyCustomCSS(customCSS);
```

### 필드별 스타일 적용

`setFields`를 통해 개별 필드의 스타일을 지정할 수 있습니다. `width` 속성을 사용하면 필드의 너비를 조절하여 다양한 레이아웃을 만들 수 있습니다.

#### 필드 레이아웃 예시 (2열 구성)

`width` 속성을 `50%`에 가깝게 설정하여 두 필드를 한 줄에 나란히 배치할 수 있습니다. (컨테이너의 `gap`을 고려하여 `calc` 사용)

```javascript
const layoutFields = [
  {
    name: 'firstName',
    label: '성 (First Name)',
    type: 'text',
    required: true,
    width: 'calc(50% - 8px)' // 폼 내부 gap(16px)의 절반을 뺌
  },
  {
    name: 'lastName',
    label: '이름 (Last Name)',
    type: 'text',
    required: true,
    width: 'calc(50% - 8px)'
  },
  {
    name: 'email',
    label: '이메일',
    type: 'email',
    required: true,
    width: '100%' // 너비를 100%로 설정하여 단독 라인 차지
  }
];

form.setFields(layoutFields);
```

#### 개별 필드 디자인 강조

`containerStyle`과 `style`을 사용하여 특정 필드를 시각적으로 강조할 수 있습니다.

```javascript
const styledFields = [
  {
    name: 'specialField',
    label: '강조된 필드',
    type: 'text',
    // 컨테이너에 배경과 패딩 적용
    containerStyle: 'background: #f0f8ff; padding: 15px; border-radius: 8px; border-left: 4px solid #3498db;',
    // 입력 필드 자체에 스타일 적용
    style: 'border: 1px solid #3498db;'
  },
  {
    name: 'message',
    label: '메시지 (고정폭 폰트)',
    type: 'textarea',
    style: 'min-height: 120px; font-family: "Courier New", monospace; background: #333; color: #eee; border-radius: 0;'
  }
];

form.setFields(styledFields);
```

## 6. 동적 제어 예시

버튼 클릭 등으로 폼의 속성이나 필드를 동적으로 변경하는 예시입니다.

```html
<button id="change-title-btn">제목 변경</button>
<button id="add-field-btn">필드 추가</button>
<button id="reset-btn">폼 리셋</button>

<shake-form id="dynamic-form"></shake-form>

<script>
  const dynamicForm = document.getElementById('dynamic-form');
  let fields = [
    { name: 'name', label: '이름', type: 'text', required: true }
  ];
  dynamicForm.setFields(fields);

  // 제목 변경
  document.getElementById('change-title-btn').addEventListener('click', () => {
    dynamicForm.setAttribute('title', '새로운 제목 ' + new Date().toLocaleTimeString());
  });

  // 필드 추가
  document.getElementById('add-field-btn').addEventListener('click', () => {
    const newField = {
      name: 'field' + (fields.length + 1),
      label: '추가된 필드 ' + (fields.length + 1),
      type: 'text'
    };
    fields.push(newField);
    dynamicForm.setFields(fields);
  });

  // 폼 리셋
  document.getElementById('reset-btn').addEventListener('click', () => {
    dynamicForm.reset();
  });
</script>
```
