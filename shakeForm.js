class ShakeForm extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this._fields = [];
        this._formData = {};

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    font-family: var(--font-family, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol");
                    width: var(--form-width, 100%);
                    box-sizing: border-box;
                }

                .form-container {
                    font-family: inherit;
                    background-color: var(--container-bg, #ffffff);
                    color: var(--text-color, #333333);
                    padding: var(--container-padding, 24px);
                    border-radius: var(--border-radius, 12px);
                    border: 1px solid var(--border-color, #e0e0e0);
                    box-shadow: var(--container-shadow, 0 4px 12px rgba(0,0,0,0.05));
                    transition: background-color 0.3s, color 0.3s, border-color 0.3s;
                }

                .form-title {
                    font-size: var(--font-size-title, 28px);
                    font-weight: var(--font-weight-bold, 700);
                    margin: 0 0 24px 0;
                    color: var(--title-color, var(--text-color, #333333));
                }

                .fields-wrapper {
                    display: flex;
                    flex-wrap: wrap;
                    gap: var(--field-gap, 16px);
                }

                .field-container {
                    display: flex;
                    flex-direction: column;
                    width: 100%;
                    box-sizing: border-box;
                }

                .field-label {
                    font-size: var(--font-size-base, 14px);
                    font-weight: var(--font-weight-medium, 500);
                    margin-bottom: 8px;
                    color: var(--label-color, var(--text-color, #333333));
                }

                .field-label .required-mark {
                    color: var(--primary-color, #e53935);
                    margin-left: 4px;
                }

                .form-input, .form-textarea, .form-select {
                    width: 100%;
                    padding: 12px;
                    font-family: inherit;
                    font-size: var(--font-size-base, 14px);
                    border: 1px solid var(--input-border-color, #ced4da);
                    border-radius: var(--border-radius, 8px);
                    background-color: var(--input-bg, #ffffff);
                    color: var(--input-text-color, var(--text-color, #333333));
                    transition: border-color 0.2s, box-shadow 0.2s;
                    box-sizing: border-box;
                }

                .form-input:focus, .form-textarea:focus, .form-select:focus {
                    outline: none;
                    border-color: var(--input-focus-border, var(--primary-color, #3f51b5));
                    box-shadow: 0 0 0 3px var(--input-focus-shadow, rgba(63, 81, 181, 0.1));
                }

                .form-input.invalid, .form-textarea.invalid, .form-select.invalid {
                    border-color: var(--error-color, #e53935);
                }

                .error-message {
                    font-size: 12px;
                    color: var(--error-color, #e53935);
                    margin-top: 6px;
                    min-height: 1em;
                }

                .checkbox-group, .radio-group {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                }

                .checkbox-item, .radio-item {
                    display: flex;
                    align-items: center;
                    cursor: pointer;
                }

                .checkbox-item input, .radio-item input {
                    margin-right: 8px;
                }

                .form-submit {
                    width: 100%;
                    padding: 14px;
                    margin-top: 16px;
                    font-size: var(--font-size-button, 16px);
                    font-weight: var(--font-weight-bold, 700);
                    color: var(--button-text-color, #ffffff);
                    background: var(--button-bg, linear-gradient(135deg, #3f51b5 0%, #5c6bc0 100%));
                    border: none;
                    border-radius: var(--border-radius, 8px);
                    cursor: pointer;
                    transition: background 0.3s, transform 0.2s, box-shadow 0.3s;
                }

                .form-submit:hover {
                    background: var(--button-bg-hover, linear-gradient(135deg, #3949ab 0%, #5461ac 100%));
                    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
                    transform: translateY(-2px);
                }

                /* Dark Theme */
                :host([theme="dark"]) .form-container {
                    --container-bg: #212121;
                    --text-color: #f5f5f5;
                    --border-color: #424242;
                    --input-bg: #333333;
                    --input-border-color: #555555;
                }
            </style>
            <div class="form-container">
                <h2 class="form-title"></h2>
                <form class="shake-form-element">
                    <div class="fields-wrapper"></div>
                    <button type="submit" class="form-submit"></button>
                </form>
            </div>
        `;

        this._formElement = this.shadowRoot.querySelector('.shake-form-element');
        this._titleElement = this.shadowRoot.querySelector('.form-title');
        this._submitButton = this.shadowRoot.querySelector('.form-submit');
        this._fieldsWrapper = this.shadowRoot.querySelector('.fields-wrapper');
    }

    static get observedAttributes() {
        return ['title', 'submit-text', 'theme', 'width'];
    }

    static get DEFAULT_FONT_STACK() {
        return '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"';
    }

    connectedCallback() {
        this._updateTitle(this.getAttribute('title') || '');
        this._updateSubmitText(this.getAttribute('submit-text') || 'Submit');
        this.setTheme(this.getAttribute('theme') || 'light');
        if (this.hasAttribute('width')) {
            this.style.setProperty('--form-width', this.getAttribute('width'));
        }

        this._formElement.addEventListener('submit', this._handleSubmit.bind(this));
        this._fieldsWrapper.addEventListener('input', this._handleInput.bind(this));
        this._fieldsWrapper.addEventListener('change', this._handleInput.bind(this));
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue) return;
        switch (name) {
            case 'title':
                this._updateTitle(newValue);
                break;
            case 'submit-text':
                this._updateSubmitText(newValue);
                break;
            case 'theme':
                this.setTheme(newValue);
                break;
            case 'width':
                this.style.setProperty('--form-width', newValue);
                break;
        }
    }

    _updateTitle(text) {
        if (text) {
            this._titleElement.textContent = text;
            this._titleElement.style.display = '';
        } else {
            this._titleElement.style.display = 'none';
        }
    }

    _updateSubmitText(text) {
        this._submitButton.textContent = text;
    }

    setFields(fields) {
        this._fields = fields;
        this._formData = {};
        this._fieldsWrapper.innerHTML = '';
        this._fields.forEach(field => {
            const fieldContainer = this._createField(field);
            this._fieldsWrapper.appendChild(fieldContainer);
            // Initialize form data with default values
            if (field.name) {
                this._formData[field.name] = field.value || (field.type === 'checkbox' ? [] : '');
            }
        });
        this._updateFormData();
    }

    _createField(field) {
        const container = document.createElement('div');
        container.className = 'field-container';
        if (field.width) {
            container.style.width = field.width;
        }
        if (field.containerStyle) {
            container.style.cssText += field.containerStyle;
        }

        const label = document.createElement('label');
        label.className = 'field-label';
        label.setAttribute('for', field.name);
        label.textContent = field.label;
        if (field.required) {
            const requiredMark = document.createElement('span');
            requiredMark.className = 'required-mark';
            requiredMark.textContent = '*';
            label.appendChild(requiredMark);
        }
        container.appendChild(label);

        let inputElement;
        switch (field.type) {
            case 'textarea':
                inputElement = document.createElement('textarea');
                inputElement.className = 'form-textarea';
                break;
            case 'select':
                inputElement = this._createSelect(field);
                break;
            case 'checkbox':
            case 'radio':
                inputElement = this._createChoiceGroup(field);
                break;
            default:
                inputElement = document.createElement('input');
                inputElement.className = 'form-input';
                inputElement.type = field.type;
        }

        if (field.type !== 'checkbox' && field.type !== 'radio') {
            inputElement.id = field.name;
            inputElement.name = field.name;
            if (field.placeholder) inputElement.placeholder = field.placeholder;
            if (field.value) inputElement.value = field.value;
            if (field.style) inputElement.style.cssText = field.style;
        }

        container.appendChild(inputElement);

        const error = document.createElement('div');
        error.className = 'error-message';
        error.id = `error-${field.name}`;
        container.appendChild(error);

        return container;
    }

    _createSelect(field) {
        const select = document.createElement('select');
        select.className = 'form-select';
        select.id = field.name;
        select.name = field.name;

        if (field.placeholder) {
            const placeholderOption = document.createElement('option');
            placeholderOption.value = '';
            placeholderOption.textContent = field.placeholder;
            placeholderOption.disabled = true;
            placeholderOption.selected = !field.value;
            select.appendChild(placeholderOption);
        }

        field.options.forEach(opt => {
            const option = document.createElement('option');
            if (typeof opt === 'string') {
                option.value = opt;
                option.textContent = opt;
            } else {
                option.value = opt.value;
                option.textContent = opt.label;
            }
            if (field.value === option.value) {
                option.selected = true;
            }
            select.appendChild(option);
        });
        return select;
    }

    _createChoiceGroup(field) {
        const group = document.createElement('div');
        group.className = `${field.type}-group`;
        group.id = field.name;

        field.options.forEach(opt => {
            const item = document.createElement('label');
            item.className = `${field.type}-item`;

            const input = document.createElement('input');
            input.type = field.type;
            input.name = field.name;

            let value, label;
            if (typeof opt === 'string') {
                value = label = opt;
            } else {
                value = opt.value;
                label = opt.label;
            }
            input.value = value;

            if (field.type === 'checkbox' && Array.isArray(field.value) && field.value.includes(value)) {
                input.checked = true;
            } else if (field.type === 'radio' && field.value === value) {
                input.checked = true;
            }

            item.appendChild(input);
            item.appendChild(document.createTextNode(label));
            group.appendChild(item);
        });
        return group;
    }

    _handleInput(event) {
        this._updateFormData();
        this.dispatchEvent(new CustomEvent('formchange', {
            detail: this.getFormData()
        }));

        const fieldName = event.target.name;
        if (fieldName) {
            this._validateField(fieldName, false);
        }
    }

    _updateFormData() {
        const formData = new FormData(this._formElement);
        const data = {};
        this._fields.forEach(field => {
            if (field.type === 'checkbox') {
                data[field.name] = formData.getAll(field.name);
            } else {
                data[field.name] = formData.get(field.name) || '';
            }
        });
        this._formData = data;
    }

    getFormData() {
        return { ...this._formData };
    }

    _handleSubmit(event) {
        event.preventDefault();
        if (this.validate()) {
            this.dispatchEvent(new CustomEvent('formsubmit', {
                detail: {
                    ...this.getFormData(),
                    timestamp: new Date().toISOString()
                }
            }));
        }
    }

    validate() {
        let isFormValid = true;
        this._fields.forEach(field => {
            if (!this._validateField(field.name, true)) {
                isFormValid = false;
            }
        });
        return isFormValid;
    }

    _validateField(fieldName, showErrors) {
        const field = this._fields.find(f => f.name === fieldName);
        if (!field) return true;

        const value = this._formData[fieldName];
        const element = this.shadowRoot.querySelector(`[name="${fieldName}"]`);
        const errorElement = this.shadowRoot.querySelector(`#error-${fieldName}`);
        let errorMessage = '';

        if (field.required && (!value || value.length === 0)) {
            errorMessage = `${field.label} 항목은 필수입니다.`;
        } else if (value) {
            if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                errorMessage = '유효한 이메일 주 형식이 아닙니다.';
            } else if (field.validation?.pattern) {
                const regex = new RegExp(field.validation.pattern);
                if (!regex.test(value)) {
                    errorMessage = field.validation.message || '입력 형식이 올바르지 않습니다.';
                }
            } else if (field.validate && typeof field.validate === 'function') {
                const customValidationResult = field.validate(value);
                if (customValidationResult !== true) {
                    errorMessage = customValidationResult;
                }
            }
        }

        if (showErrors) {
            errorElement.textContent = errorMessage;
        }

        const inputElement = element.matches('input, select, textarea') ? element : this.shadowRoot.querySelector(`#${fieldName}`);
        if (errorMessage) {
            inputElement?.classList.add('invalid');
            return false;
        } else {
            inputElement?.classList.remove('invalid');
            return true;
        }
    }

    reset() {
        this._formElement.reset();
        this._fields.forEach(field => {
            const errorElement = this.shadowRoot.querySelector(`#error-${field.name}`);
            if (errorElement) errorElement.textContent = '';
            const inputElement = this.shadowRoot.querySelector(`[name="${field.name}"]`);
            inputElement?.classList.remove('invalid');
        });
        this.setFields(this._fields); // Re-render to apply default values
    }

    setTheme(theme) {
        this.setAttribute('theme', theme);
        if (theme === 'auto') {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
            this._applyAutoTheme(prefersDark.matches);
            prefersDark.addEventListener('change', (e) => this._applyAutoTheme(e.matches));
        } else {
            this.shadowRoot.querySelector('.form-container').style.cssText = '';
        }
    }

    _applyAutoTheme(isDark) {
        if (this.getAttribute('theme') !== 'auto') return;
        this.setAttribute('theme', isDark ? 'dark' : 'light');
    }

    /**
     * Google Fonts를 동적으로 로드하고 폼에 적용합니다.
     * @param {string} fontName - Google Font 이름 (e.g., 'Noto Sans KR')
     * @param {number|number[]} [weights] - 사용할 폰트 두께 (단일 숫자 또는 배열). 생략 시 기본 두께로 로드됩니다.
     */
    loadGoogleFont(fontName, weights) {
        if (!fontName) {
            console.error('loadGoogleFont: fontName을 제공해야 합니다.');
            return;
        }

        const formattedFontName = String(fontName).trim().replace(/\s+/g, '+');

        let fontUrl = `https://fonts.googleapis.com/css2?family=${formattedFontName}&display=swap`;

        if (weights) {
            const weightsArray = Array.isArray(weights) ? weights : [weights];
            if (weightsArray.length > 0) {
                const weightsString = `:wght@${weightsArray.join(';')}`;
                fontUrl = `https://fonts.googleapis.com/css2?family=${formattedFontName}${weightsString}&display=swap`;
            }
        }

        // 기존 폰트 링크 제거
        const existingLinks = document.head.querySelectorAll('link[data-shake-font]');
        existingLinks.forEach(link => link.remove());

        const fontLink = document.createElement('link');
        fontLink.rel = 'stylesheet';
        fontLink.href = fontUrl;
        fontLink.dataset.shakeFont = formattedFontName;

        fontLink.onload = () => {
            document.fonts.ready.then(() => {
                this._setFontFamily(fontName);
            });
        };
        fontLink.onerror = () => {
            console.error(`Google Font를 로드하지 못했습니다: ${fontName}`);
        };

        document.head.appendChild(fontLink);
    }

    loadWebFont(fontName, stylesheetUrl) {
        if (!fontName || !stylesheetUrl) {
            console.error('loadWebFont: fontName과 stylesheetUrl을 모두 제공해야 합니다.');
            return;
        }

        // 기존 폰트 링크 제거
        const existingLinks = document.head.querySelectorAll('link[data-shake-font]');
        existingLinks.forEach(link => link.remove());

        const fontLink = document.createElement('link');
        fontLink.rel = 'stylesheet';
        fontLink.href = stylesheetUrl;
        fontLink.dataset.shakeFont = fontName; // data 속성 추가

        fontLink.onload = () => {
            this._setFontFamily(fontName);
        };
        fontLink.onerror = () => {
            console.error(`웹 폰트를 로드하지 못했습니다: ${stylesheetUrl}`);
        };

        document.head.appendChild(fontLink);
    }

    _setFontFamily(fontName) {
        const sanitizedFontName = String(fontName).replace(/"/g, '\\"');
        const fontStack = `"${sanitizedFontName}", ${ShakeForm.DEFAULT_FONT_STACK}`;
        this.style.setProperty('--font-family', fontStack);
    }

    setCSSVariables(variables) {
        for (const [key, value] of Object.entries(variables)) {
            this.shadowRoot.querySelector('.form-container').style.setProperty(key, value);
        }
    }

    applyCustomCSS(css) {
        const style = document.createElement('style');
        style.textContent = css;
        this.shadowRoot.appendChild(style);
    }
}

customElements.define('shake-form', ShakeForm);
