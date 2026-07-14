const inputArea = document.getElementById('input-area');
const output = document.getElementById('output');
const outputHtml = document.getElementById('output-html');
const outputContainer = document.getElementById('output-container');
const convertBtn = document.getElementById('convertBtn');
const copyBtn = document.getElementById('copyBtn');
const clearBtn = document.getElementById('clearBtn');
const themeCheckbox = document.getElementById('themeCheckbox');
const status = document.getElementById('status');
const modes = document.getElementsByName('mode');
const htmlRoot = document.documentElement;

const setStatus = (message, isError = false) => {
    status.textContent = message;
    status.classList.toggle('error', isError);
};

const clearResult = () => {
    inputArea.innerHTML = '';
    output.textContent = '';
    outputHtml.replaceChildren();
    outputContainer.hidden = true;
    copyBtn.classList.add('hidden');
    setStatus('');
};

const savedTheme = localStorage.getItem('theme') || 'dark';
htmlRoot.setAttribute('data-theme', savedTheme);
themeCheckbox.checked = savedTheme === 'dark';

themeCheckbox.addEventListener('change', (event) => {
    const newTheme = event.target.checked ? 'dark' : 'light';
    htmlRoot.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
});

modes.forEach((modeInput) => modeInput.addEventListener('change', (event) => {
    inputArea.classList.toggle('markdown-input', event.target.value === 'md2html');
    clearResult();
}));

convertBtn.addEventListener('click', async () => {
    const mode = document.querySelector('input[name="mode"]:checked').value;
    let content = mode === 'html2md' ? inputArea.innerHTML : inputArea.innerText;

    if (mode === 'html2md') {
        content = content.replace(/^(<br>|&nbsp;|\s)+/gi, '').replace(/(<br>|&nbsp;|\s)+$/gi, '');
    }

    if (!content || content === '<br>') {
        setStatus('Paste or enter some content before converting.', true);
        return;
    }

    convertBtn.setAttribute('aria-busy', 'true');
    convertBtn.disabled = true;
    setStatus('Converting…');

    try {
        const endpoint = mode === 'html2md' ? '/api/convert' : '/api/reverse';
        const body = mode === 'html2md' ? { html: content } : { markdown: content };
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });
        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            throw new Error(data.error || `Conversion failed (${response.status}).`);
        }

        outputContainer.hidden = false;
        copyBtn.classList.remove('hidden');

        if (mode === 'html2md') {
            output.textContent = data.markdown;
            output.classList.remove('hidden');
            outputHtml.classList.add('hidden');
        } else {
            outputHtml.innerHTML = data.html;
            outputHtml.classList.remove('hidden');
            output.classList.add('hidden');
        }

        setStatus('Conversion complete.');
        outputContainer.scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
        outputContainer.hidden = true;
        copyBtn.classList.add('hidden');
        setStatus(error.message || 'Conversion failed.', true);
    } finally {
        convertBtn.removeAttribute('aria-busy');
        convertBtn.disabled = false;
    }
});

copyBtn.addEventListener('click', async () => {
    const mode = document.querySelector('input[name="mode"]:checked').value;

    try {
        if (mode === 'md2html' && navigator.clipboard.write && window.ClipboardItem) {
            const item = new ClipboardItem({
                'text/html': new Blob([outputHtml.innerHTML], { type: 'text/html' }),
                'text/plain': new Blob([outputHtml.innerText], { type: 'text/plain' }),
            });
            await navigator.clipboard.write([item]);
        } else {
            const text = mode === 'html2md' ? output.textContent : outputHtml.innerText;
            await navigator.clipboard.writeText(text);
        }

        const originalText = copyBtn.innerText;
        copyBtn.innerText = 'Copied!';
        setStatus('Result copied to the clipboard.');
        setTimeout(() => { copyBtn.innerText = originalText; }, 2000);
    } catch (error) {
        setStatus('Could not access the clipboard. Copy the result manually.', true);
    }
});

clearBtn.addEventListener('click', clearResult);
