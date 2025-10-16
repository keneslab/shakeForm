# shakeForm 초보자용 안내서

이 문서는 웹사이트에 멋진 폼을 가장 쉽게 추가하는 방법을 안내합니다. 코드를 잘 몰라도 괜찮습니다. 아래 예제를 복사해서 붙여넣고, 몇 가지 속성만 수정하면 바로 사용할 수 있습니다.

---

## ✨ `shakeForm`은 무엇인가요?

웹사이트에 '문의하기', '신청하기' 같은 폼을 만들어주는 부품(컴포넌트)입니다. 이메일, 이름, 문의 내용 등을 입력받고 '제출' 버튼을 누르면 입력된 데이터를 한번에 모아줍니다.

## 🚀 가장 빠른 시작 (복사 & 붙여넣기)

아래 코드를 웹페이지의 HTML 파일 원하는 곳에 그대로 붙여넣으세요. 이것만으로도 바로 작동하는 기본 문의 폼이 만들어집니다.

```html
<!-- 1. shakeForm 스크립트 추가 (페이지 당 한 번만) -->
<script src="shakeForm.js"></script>

<!-- 2. 폼을 표시하고 싶은 곳에 아래 태그 추가 -->
<shake-form
  title="무엇이든 물어보세요"
  submit-text="문의 제출하기"
  width="100%"
>
</shake-form>

<script>
  // 3. 폼에 어떤 질문을 넣을지 결정합니다.
  const myForm = document.querySelector('shake-form');

  const myFields = [
    { name: 'name', label: '이름', type: 'text', required: true, placeholder: '이름을 입력하세요' },
    { name: 'email', label: '회신받을 이메일', type: 'email', required: true, placeholder: 'email@example.com' },
    { name: 'message', label: '문의 내용', type: 'textarea', required: true, placeholder: '여기에 문의 내용을 자유롭게 작성해주세요.' }
  ];

  myForm.setFields(myFields);

  // 4. 사용자가 폼을 제출하면 브라우저 개발자 도구(F12)의 콘솔에 데이터가 표시됩니다.
  myForm.addEventListener('formsubmit', (event) => {
    console.log('폼 데이터:', event.detail);
    alert('문의가 성공적으로 제출되었습니다!');
  });
</script>
```

> **결과 확인**: 사용자가 폼을 제출하면 `alert` 창이 뜨고, 브라우저의 개발자 도구(F12키 > Console 탭)에서 제출된 내용을 확인할 수 있습니다. 이 데이터는 나중에 개발자가 이메일로 보내거나 서버에 저장하도록 만들 수 있습니다.

---

## 🎨 간단한 디자인 변경하기

`shake-form` 태그에 몇 가지 속성을 추가하거나 수정해서 폼의 모양을 바꿀 수 있습니다.

| 바꿀 내용 | 속성 | 예시 | 설명 |
|---|---|---|---|
| **폼 제목** | `title` | `title="고객 지원 문의"` | 폼 상단에 표시되는 제목을 변경합니다. |
| **제출 버튼 글자** | `submit-text` | `submit-text="보내기"` | 제출 버튼의 텍스트를 변경합니다. |
| **디자인 테마** | `theme` | `theme="dark"` | 어두운 배경의 폼으로 변경합니다. (`light`는 밝은 테마) |
| **폼 전체 너비** | `width` | `width="800px"` | 폼의 가로 너비를 조절합니다. `100%`로 설정하면 꽉 찬 너비가 됩니다. |

### 예시: 어두운 테마의 폼으로 변경하기

```html
<shake-form
  title="저녁에 어울리는 다크 폼"
  submit-text="전송"
  theme="dark"
>
</shake-form>
<!-- <script> ... </script> 부분은 위와 동일합니다. -->
```

---

## 📝 질문(입력 필드) 변경하기

폼에 표시될 질문 항목들은 `<script>` 코드 안의 `myFields` 배열에서 관리합니다. 새로운 질문을 추가하거나 기존 질문을 수정할 수 있습니다.

각 질문은 `{ }` 안에 정의하며, 주요 속성은 다음과 같습니다.

| 속성 | 설명 |
|---|---|
| `name` | 데이터의 이름표 (영어로, 띄어쓰기 없이 작성) |
| `label` | 사용자에게 보여질 질문 제목 |
| `type` | 질문의 종류 (`text`, `email`, `textarea` 등) |
| `required` | `true`로 설정하면 필수 입력 항목이 됩니다. |
| `placeholder` | 입력칸에 미리 표시될 안내 문구 |

### 예시: '연락처' 질문 추가하기

`myFields` 배열에 아래와 같이 `{ }` 한 덩어리를 추가하면 '연락처' 입력칸이 새로 생깁니다.

```javascript
  const myFields = [
    { name: 'name', label: '이름', type: 'text', required: true, placeholder: '이름을 입력하세요' },
    { name: 'email', label: '회신받을 이메일', type: 'email', required: true, placeholder: 'email@example.com' },
    // 아래 내용을 새로 추가!
    { name: 'phone', label: '연락처', type: 'tel', required: false, placeholder: '010-1234-5678' },
    { name: 'message', label: '문의 내용', type: 'textarea', required: true, placeholder: '여기에 문의 내용을 자유롭게 작성해주세요.' }
  ];

  myForm.setFields(myFields);
```

이것으로 충분합니다! 더 복잡한 기능(선택 박스, 2단 레이아웃, 글꼴 변경 등)이 필요하다면 개발자에게 **`ADVANCED_GUIDE.md`** 문서를 전달해주세요.
