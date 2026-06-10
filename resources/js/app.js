import './bootstrap';
import Sortable from 'sortablejs';

/* ─────────────────────────────────────────────
   FIELD DEFINITIONS
───────────────────────────────────────────── */
const FIELD_DEFAULTS = {
    text:        { label: 'Text Input',        placeholder: 'Enter text…',         required: false, cssClass: '', defaultValue: '', minChars: '', maxChars: '' },
    textarea:    { label: 'Text Area',          placeholder: 'Enter text…',         required: false, cssClass: '', defaultValue: '', minChars: '', maxChars: '' },
    number:      { label: 'Number Input',       placeholder: 'Enter number…',       required: false, cssClass: '', defaultValue: '' },
    email:       { label: 'Email Input',        placeholder: 'Enter email…',        required: false, cssClass: '', defaultValue: '' },
    phone:       { label: 'Phone Input',        placeholder: 'Enter phone…',        required: false, cssClass: '' },
    dropdown:    { label: 'Dropdown',           placeholder: 'Select an option…',   required: false, cssClass: '', options: ['Option 1', 'Option 2'] },
    radio:       { label: 'Radio Buttons',      placeholder: '',                    required: false, cssClass: '', options: ['Option 1', 'Option 2'] },
    checkbox:    { label: 'Checkboxes',         placeholder: '',                    required: false, cssClass: '', options: ['Option 1', 'Option 2'] },
    date:        { label: 'Date Picker',        placeholder: '',                    required: false, cssClass: '' },
    file:        { label: 'File Upload',        placeholder: '',                    required: false, cssClass: '' },
    title:       { label: 'Section Title',      placeholder: '',                    required: false, cssClass: '', content: 'Section Title' },
    description: { label: 'Description',        placeholder: '',                    required: false, cssClass: '', content: 'Add your description here.' },
    newline:     { label: 'New Line',           placeholder: '',                    required: false, cssClass: '' },
    pagebreak:   { label: 'Page Break',         placeholder: '',                    required: false, cssClass: '' },
    hidden:      { label: 'Hidden Field',       placeholder: '',                    required: false, cssClass: '', defaultValue: '' },
    state:       { label: 'State',              placeholder: 'Select state…',       required: false, cssClass: '', options: ['Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming'] },
    city:        { label: 'City',               placeholder: 'Enter city…',         required: false, cssClass: '' },
    statecity:   { label: 'State & City',       placeholder: '',                    required: false, cssClass: '' },
};

/* ─────────────────────────────────────────────
   FIELD CANVAS RENDERER
───────────────────────────────────────────── */
function renderFieldPreview(field) {
    const { type, config } = field;
    const lbl = config.label || '';
    const ph  = config.placeholder || '';
    const req = config.required ? '<span class="text-red-500 ml-0.5">*</span>' : '';
    const labelHtml = `<div class="text-sm font-medium text-gray-700 mb-1">${escHtml(lbl)}${req}</div>`;
    const inputCls = 'w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed';

    switch (type) {
        case 'text':
        case 'email':
        case 'phone':
            return `${labelHtml}<input type="text" class="${inputCls}" placeholder="${escHtml(ph)}" disabled>`;
        case 'number':
            return `${labelHtml}<input type="number" class="${inputCls}" placeholder="${escHtml(ph)}" disabled>`;
        case 'textarea':
            return `${labelHtml}<textarea class="${inputCls} resize-none h-20" placeholder="${escHtml(ph)}" disabled></textarea>`;
        case 'dropdown':
        case 'state': {
            const opts = (config.options || []).slice(0, 5).map(o => `<option>${escHtml(o)}</option>`).join('');
            return `${labelHtml}<select class="${inputCls}" disabled><option>${escHtml(ph || 'Select…')}</option>${opts}</select>`;
        }
        case 'city':
            return `${labelHtml}<input type="text" class="${inputCls}" placeholder="${escHtml(ph || 'Enter city…')}" disabled>`;
        case 'statecity':
            return `<div class="grid grid-cols-2 gap-3">
                <div><div class="text-sm font-medium text-gray-700 mb-1">${escHtml(lbl ? lbl + ' – State' : 'State')}${req}</div><select class="${inputCls}" disabled><option>Select state…</option></select></div>
                <div><div class="text-sm font-medium text-gray-700 mb-1">${escHtml(lbl ? lbl + ' – City' : 'City')}${req}</div><input type="text" class="${inputCls}" placeholder="Enter city…" disabled></div>
            </div>`;
        case 'radio': {
            const opts = (config.options || []).map(o =>
                `<label class="flex items-center gap-2 text-sm text-gray-500">
                    <input type="radio" disabled class="accent-blue-600"> ${escHtml(o)}
                </label>`).join('');
            return `${labelHtml}<div class="space-y-1.5">${opts}</div>`;
        }
        case 'checkbox': {
            const opts = (config.options || []).map(o =>
                `<label class="flex items-center gap-2 text-sm text-gray-500">
                    <input type="checkbox" disabled class="accent-blue-600 rounded"> ${escHtml(o)}
                </label>`).join('');
            return `${labelHtml}<div class="space-y-1.5">${opts}</div>`;
        }
        case 'date':
            return `${labelHtml}<input type="date" class="${inputCls}" disabled>`;
        case 'file':
            return `${labelHtml}<div class="border-2 border-dashed border-gray-200 rounded-lg px-4 py-3 text-center text-sm text-gray-400 bg-gray-50">📎 Click to upload or drag a file</div>`;
        case 'title':
            return `<h3 class="text-xl font-bold text-gray-800">${escHtml(config.content || lbl)}</h3>`;
        case 'description':
            return `<p class="text-sm text-gray-500 leading-relaxed">${escHtml(config.content || '')}</p>`;
        case 'newline':
            return `<div class="flex items-center gap-2 text-gray-300 py-1"><div class="flex-1 border-t border-dashed border-gray-200"></div><span class="text-xs font-medium text-gray-400">New Line</span><div class="flex-1 border-t border-dashed border-gray-200"></div></div>`;
        case 'pagebreak':
            return `<div class="flex items-center gap-2 py-1"><div class="flex-1 border-t-2 border-gray-300"></div><span class="text-xs font-semibold text-gray-400 bg-white px-2">PAGE BREAK</span><div class="flex-1 border-t-2 border-gray-300"></div></div>`;
        case 'hidden':
            return `<div class="flex items-center gap-2 px-3 py-2 bg-amber-50 border border-dashed border-amber-200 rounded-lg text-xs text-amber-700">
                <svg class="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/></svg>
                Hidden: <strong>${escHtml(lbl)}</strong>${config.defaultValue ? ` = "${escHtml(config.defaultValue)}"` : ''}
            </div>`;
        default:
            return `${labelHtml}<input type="text" class="${inputCls}" placeholder="${escHtml(ph)}" disabled>`;
    }
}

function buildFieldCard(field) {
    const div = document.createElement('div');
    div.className = 'field-card group';
    div.dataset.fieldId = field.id;

    div.innerHTML = `
        <div class="flex items-start gap-3">
            <div class="drag-handle mt-1 cursor-grab text-gray-300 hover:text-gray-500 transition-colors shrink-0" title="Drag to reorder">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 14zm6-8a2 2 0 1 0-.001-4.001A2 2 0 0 0 13 6zm0 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14z"/>
                </svg>
            </div>
            <div class="flex-1 min-w-0 field-preview-content"></div>
            <div class="flex items-center gap-0.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <button class="action-edit p-1.5 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors" title="Edit field">
                    <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                </button>
                <button class="action-duplicate p-1.5 rounded-lg hover:bg-green-50 text-gray-400 hover:text-green-600 transition-colors" title="Duplicate">
                    <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
                </button>
                <button class="action-delete p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors" title="Delete">
                    <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                </button>
            </div>
        </div>
        <div class="confirm-overlay hidden">
            <span class="text-sm text-gray-600 font-medium">Remove this field?</span>
            <button class="confirm-yes px-3 py-1.5 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors">Remove</button>
            <button class="confirm-no px-3 py-1.5 bg-gray-100 text-gray-600 text-sm rounded-lg hover:bg-gray-200 transition-colors">Cancel</button>
        </div>
    `;

    div.querySelector('.field-preview-content').innerHTML = renderFieldPreview(field);
    return div;
}

/* ─────────────────────────────────────────────
   FIELD OPTIONS PANEL
───────────────────────────────────────────── */
function buildOptionsPanel(field, onUpdate) {
    const { type, config } = field;
    const hasPlaceholder = ['text','textarea','number','email','phone','dropdown','state','city'].includes(type);
    const hasMinMax      = ['text','textarea'].includes(type);
    const hasOptions     = ['dropdown','radio','checkbox'].includes(type);
    const hasDefault     = ['text','number','email','hidden'].includes(type);
    const hasContent     = ['title','description'].includes(type);

    const row = (label, html) =>
        `<div><label class="config-label">${label}</label>${html}</div>`;

    let html = `<div class="flex items-center gap-2 pb-3 border-b border-gray-100 mb-1">
        <span class="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-md text-xs font-bold uppercase tracking-wide">${type}</span>
        <span class="text-sm text-gray-500">Configuration</span>
    </div>`;

    html += row('Label', `<input class="config-input" data-key="label" type="text" value="${escHtml(config.label || '')}">`);

    if (hasContent) {
        html += row('Content', `<textarea class="config-input h-20 resize-none" data-key="content">${escHtml(config.content || '')}</textarea>`);
    }
    if (hasPlaceholder) {
        html += row('Placeholder', `<input class="config-input" data-key="placeholder" type="text" value="${escHtml(config.placeholder || '')}">`);
    }
    if (hasMinMax) {
        html += `<div class="grid grid-cols-2 gap-3">
            ${row('Min Chars', `<input class="config-input" data-key="minChars" type="number" min="0" value="${escHtml(config.minChars || '')}">`)}
            ${row('Max Chars', `<input class="config-input" data-key="maxChars" type="number" min="0" value="${escHtml(config.maxChars || '')}">`)}
        </div>`;
    }
    if (hasDefault) {
        html += row('Default Value', `<input class="config-input" data-key="defaultValue" type="text" value="${escHtml(config.defaultValue || '')}">`);
    }

    if (hasOptions) {
        const optRows = (config.options || []).map((o, i) =>
            `<div class="flex gap-2 items-center" data-index="${i}">
                <input class="config-input flex-1 option-input" type="text" value="${escHtml(o)}" data-index="${i}">
                <button class="remove-option p-1.5 text-gray-300 hover:text-red-500 transition-colors shrink-0" data-index="${i}">
                    <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
            </div>`
        ).join('');
        html += `<div>
            <label class="config-label">Options</label>
            <div id="optionsList" class="space-y-2 mb-2">${optRows}</div>
            <button id="addOptionBtn" class="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/></svg>
                Add option
            </button>
        </div>`;
    }

    html += `<div class="flex items-center justify-between py-1">
        <label class="config-label mb-0">Required</label>
        <label class="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" class="sr-only peer" data-key="required" ${config.required ? 'checked' : ''}>
            <div class="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full"></div>
        </label>
    </div>`;

    html += row('CSS Class', `<input class="config-input" data-key="cssClass" type="text" placeholder="e.g. col-md-6" value="${escHtml(config.cssClass || '')}">`);

    html += `<div class="pt-2 border-t border-gray-100">
        <button id="removeFieldBtn" class="btn-danger w-full">Remove Element</button>
    </div>`;

    const container = document.getElementById('fieldOptionsForm');
    container.innerHTML = html;
    container.classList.remove('hidden');
    document.getElementById('noFieldSelected').classList.add('hidden');

    // Simple inputs
    container.querySelectorAll('[data-key]').forEach(el => {
        const handler = () => {
            const key = el.dataset.key;
            const val = el.type === 'checkbox' ? el.checked : el.value;
            onUpdate(field.id, key, val);
        };
        el.addEventListener('input', handler);
        el.addEventListener('change', handler);
    });

    // Options management
    if (hasOptions) {
        const optsList = container.querySelector('#optionsList');

        optsList.addEventListener('input', e => {
            if (e.target.classList.contains('option-input')) {
                const idx = parseInt(e.target.dataset.index);
                const opts = [...(field.config.options || [])];
                opts[idx] = e.target.value;
                onUpdate(field.id, 'options', opts);
            }
        });

        optsList.addEventListener('click', e => {
            const btn = e.target.closest('.remove-option');
            if (btn) {
                const idx = parseInt(btn.dataset.index);
                const opts = [...(field.config.options || [])];
                opts.splice(idx, 1);
                onUpdate(field.id, 'options', opts);
            }
        });

        container.querySelector('#addOptionBtn').addEventListener('click', () => {
            const opts = [...(field.config.options || []), `Option ${(field.config.options || []).length + 1}`];
            onUpdate(field.id, 'options', opts);
        });
    }

    container.querySelector('#removeFieldBtn').addEventListener('click', () => {
        onUpdate(field.id, '__remove__', true);
    });
}

/* ─────────────────────────────────────────────
   PREVIEW RENDERER
───────────────────────────────────────────── */
function renderPreview(fields, title) {
    document.getElementById('previewFormTitle').textContent = title || 'Form Preview';
    const content = document.getElementById('previewContent');

    if (!fields.length) {
        content.innerHTML = '<p class="text-center text-gray-400 py-8">No fields added yet.</p>';
        return;
    }

    const inCls = 'w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent';

    content.innerHTML = fields.map(f => {
        const { type, config } = f;
        const lbl    = escHtml(config.label || '');
        const ph     = escHtml(config.placeholder || '');
        const reqA   = config.required ? 'required' : '';
        const reqM   = config.required ? '<span class="text-red-500 ml-0.5">*</span>' : '';
        const labHtml = `<label class="block text-sm font-medium text-gray-700 mb-1">${lbl}${reqM}</label>`;

        switch (type) {
            case 'text':   return `<div>${labHtml}<input type="text" class="${inCls}" placeholder="${ph}" ${reqA} ${config.minChars ? `minlength="${config.minChars}"` : ''} ${config.maxChars ? `maxlength="${config.maxChars}"` : ''}></div>`;
            case 'number': return `<div>${labHtml}<input type="number" class="${inCls}" placeholder="${ph}" ${reqA}></div>`;
            case 'email':  return `<div>${labHtml}<input type="email" class="${inCls}" placeholder="${ph}" ${reqA}></div>`;
            case 'phone':  return `<div>${labHtml}<input type="tel" class="${inCls}" placeholder="${ph}" ${reqA}></div>`;
            case 'textarea': return `<div>${labHtml}<textarea class="${inCls} h-24 resize-y" placeholder="${ph}" ${reqA} ${config.minChars ? `minlength="${config.minChars}"` : ''} ${config.maxChars ? `maxlength="${config.maxChars}"` : ''}></textarea></div>`;
            case 'dropdown':
            case 'state': {
                const opts = (config.options || []).map(o => `<option value="${escHtml(o)}">${escHtml(o)}</option>`).join('');
                return `<div>${labHtml}<select class="${inCls}" ${reqA}><option value="">${ph || 'Select…'}</option>${opts}</select></div>`;
            }
            case 'city': return `<div>${labHtml}<input type="text" class="${inCls}" placeholder="${ph || 'Enter city…'}" ${reqA}></div>`;
            case 'statecity': return `<div class="grid grid-cols-2 gap-3">
                <div><label class="block text-sm font-medium text-gray-700 mb-1">State${reqM}</label><select class="${inCls}" ${reqA}><option value="">Select state…</option></select></div>
                <div><label class="block text-sm font-medium text-gray-700 mb-1">City${reqM}</label><input type="text" class="${inCls}" placeholder="Enter city…" ${reqA}></div>
            </div>`;
            case 'radio': {
                const opts = (config.options || []).map(o =>
                    `<label class="flex items-center gap-2 text-sm text-gray-700 cursor-pointer"><input type="radio" name="r_${f.id}" value="${escHtml(o)}" class="accent-blue-600"> ${escHtml(o)}</label>`
                ).join('');
                return `<div>${labHtml}<div class="space-y-2">${opts}</div></div>`;
            }
            case 'checkbox': {
                const opts = (config.options || []).map(o =>
                    `<label class="flex items-center gap-2 text-sm text-gray-700 cursor-pointer"><input type="checkbox" name="c_${f.id}[]" value="${escHtml(o)}" class="accent-blue-600 rounded"> ${escHtml(o)}</label>`
                ).join('');
                return `<div>${labHtml}<div class="space-y-2">${opts}</div></div>`;
            }
            case 'date': return `<div>${labHtml}<input type="date" class="${inCls}" ${reqA}></div>`;
            case 'file': return `<div>${labHtml}<input type="file" class="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" ${reqA}></div>`;
            case 'title': return `<h3 class="text-xl font-bold text-gray-800 pb-2 border-b border-gray-100">${escHtml(config.content || lbl)}</h3>`;
            case 'description': return `<p class="text-sm text-gray-600 leading-relaxed">${escHtml(config.content || '')}</p>`;
            case 'newline': return `<hr class="border-dashed border-gray-300">`;
            case 'pagebreak': return `<div class="flex items-center gap-2"><div class="flex-1 border-t-2 border-gray-300"></div><span class="text-xs font-bold text-gray-400 px-2">PAGE BREAK</span><div class="flex-1 border-t-2 border-gray-300"></div></div>`;
            case 'hidden': return `<input type="hidden" name="${escHtml(config.label || '')}" value="${escHtml(config.defaultValue || '')}">`;
            default: return `<div>${labHtml}<input type="text" class="${inCls}" placeholder="${ph}" ${reqA}></div>`;
        }
    }).join('');
}

/* ─────────────────────────────────────────────
   UTILITIES
───────────────────────────────────────────── */
function escHtml(str) {
    return String(str ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function uid() {
    return 'f_' + Math.random().toString(36).slice(2, 9);
}

function showToast(msg, type = 'success') {
    const toast = document.getElementById('toast');
    toast.className = `toast toast-${type}`;
    const icons = { success: '✓', warning: '⚠', error: '✕' };
    toast.innerHTML = `<span>${icons[type] || '•'}</span> <span>${msg}</span>`;
    toast.classList.remove('hidden');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.classList.add('hidden'), 2800);
}

/* ─────────────────────────────────────────────
   MAIN FORM BUILDER CLASS
───────────────────────────────────────────── */
class FormBuilder {
    constructor() {
        this.fields     = [];
        this.history    = [];
        this.future     = [];
        this.selectedId = null;

        this.canvas    = document.getElementById('dropCanvas');
        this.container = document.getElementById('fieldsContainer');
        this.emptyState= document.getElementById('emptyState');

        this._initSortable();
        this._initPaletteDrag();
        this._initTabs();
        this._initHeader();
        this._initFooter();
        this._initPreview();
        this._initKeyboard();
        this._loadFromStorage();
    }

    /* ── SortableJS for reordering ── */
    _initSortable() {
        this.sortable = Sortable.create(this.container, {
            handle:      '.drag-handle',
            animation:   150,
            ghostClass:  'sortable-ghost',
            dragClass:   'sortable-drag',
            onEnd: (evt) => {
                const moved = this.fields.splice(evt.oldIndex, 1)[0];
                this.fields.splice(evt.newIndex, 0, moved);
                this._pushHistory();
                this._saveToStorage();
            },
        });
    }

    /* ── Drag from palette onto canvas ── */
    _initPaletteDrag() {
        document.querySelectorAll('[data-field-type]').forEach(tile => {
            tile.addEventListener('dragstart', e => {
                e.dataTransfer.setData('fieldType',  tile.dataset.fieldType);
                e.dataTransfer.setData('fieldLabel', tile.dataset.fieldLabel);
                e.dataTransfer.effectAllowed = 'copy';
            });
        });

        this.canvas.addEventListener('dragover', e => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'copy';
            this.canvas.classList.add('border-blue-400', '!border-solid', 'bg-blue-50');
        });

        this.canvas.addEventListener('dragleave', e => {
            if (!this.canvas.contains(e.relatedTarget)) {
                this.canvas.classList.remove('border-blue-400', '!border-solid', 'bg-blue-50');
            }
        });

        this.canvas.addEventListener('drop', e => {
            e.preventDefault();
            this.canvas.classList.remove('border-blue-400', '!border-solid', 'bg-blue-50');
            const type  = e.dataTransfer.getData('fieldType');
            const label = e.dataTransfer.getData('fieldLabel');
            if (type) this.addField(type, label);
        });
    }

    /* ── Main tabs (Editor / Settings) ── */
    _initTabs() {
        document.querySelectorAll('[data-tab]').forEach(btn => {
            btn.addEventListener('click', () => {
                const tab = btn.dataset.tab;
                document.getElementById('editorTab').classList.toggle('hidden',   tab !== 'editor');
                document.getElementById('settingsTab').classList.toggle('hidden', tab !== 'settings');
                document.querySelectorAll('[data-tab]').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });

        // Panel sub-tabs (Add Fields / Field Options)
        document.querySelectorAll('[data-panel]').forEach(btn => {
            btn.addEventListener('click', () => {
                const panel = btn.dataset.panel;
                document.getElementById('addFieldsPanel').classList.toggle('hidden',    panel !== 'add-fields');
                document.getElementById('fieldOptionsPanel').classList.toggle('hidden', panel !== 'field-options');
                document.querySelectorAll('[data-panel]').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
    }

    /* ── Header: title counter ── */
    _initHeader() {
        const titleEl   = document.getElementById('formTitle');
        const counterEl = document.getElementById('titleCounter');
        const update = () => {
            counterEl.textContent = `${titleEl.value.length}/200`;
            this._saveToStorage();
        };
        titleEl.addEventListener('input', update);
        update();
    }

    /* ── Footer: Cancel / Next ── */
    _initFooter() {
        document.getElementById('cancelBtn').addEventListener('click', () => {
            if (!this.fields.length || confirm('Discard all changes and reset?')) {
                this.fields = [];
                this.history = [];
                this.future = [];
                this._render();
                this._saveToStorage();
                showToast('Form cleared', 'warning');
            }
        });

        document.getElementById('nextBtn').addEventListener('click', () => {
            const schema = this._buildSchema();
            document.getElementById('jsonOutput').textContent = JSON.stringify(schema, null, 2);
            document.getElementById('jsonModal').classList.remove('hidden');
            console.log('Form JSON Schema:', schema);
        });
    }

    /* ── Preview mode ── */
    _initPreview() {
        document.getElementById('previewBtn').addEventListener('click', () => {
            renderPreview(this.fields, document.getElementById('formTitle').value);
            document.getElementById('previewModal').classList.remove('hidden');
        });
        document.getElementById('closePreview').addEventListener('click', () => {
            document.getElementById('previewModal').classList.add('hidden');
        });
    }

    /* ── Keyboard shortcuts ── */
    _initKeyboard() {
        document.addEventListener('keydown', e => {
            const active = document.activeElement;
            const isTyping = active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA');
            if (isTyping) return;

            if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key === 'z') { e.preventDefault(); this.undo(); }
            if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.shiftKey && e.key === 'z'))) { e.preventDefault(); this.redo(); }
        });

        document.getElementById('undoBtn').addEventListener('click', () => this.undo());
        document.getElementById('redoBtn').addEventListener('click', () => this.redo());
    }

    /* ─────────────────────────────────────────
       FIELD CRUD
    ───────────────────────────────────────── */
    addField(type, label) {
        const defaults = FIELD_DEFAULTS[type] || {};
        const field = {
            id:     uid(),
            type,
            config: { ...defaults, label: label || defaults.label || type },
        };
        this.fields.push(field);
        this._pushHistory();
        this._appendField(field);
        this._updateEmpty();
        this._saveToStorage();
        showToast(`"${field.config.label}" added`);
    }

    duplicateField(id) {
        const idx = this.fields.findIndex(f => f.id === id);
        if (idx === -1) return;
        const clone = {
            id:     uid(),
            type:   this.fields[idx].type,
            config: JSON.parse(JSON.stringify(this.fields[idx].config)),
        };
        this.fields.splice(idx + 1, 0, clone);
        this._pushHistory();
        this._render();
        this._saveToStorage();
        showToast('Field duplicated');
    }

    removeField(id) {
        this.fields = this.fields.filter(f => f.id !== id);
        if (this.selectedId === id) {
            this.selectedId = null;
            this._clearOptionsPanel();
        }
        this._pushHistory();
        this._render();
        this._saveToStorage();
        showToast('Field removed', 'warning');
    }

    updateFieldConfig(id, key, value) {
        if (key === '__remove__') { this.removeField(id); return; }
        const field = this.fields.find(f => f.id === id);
        if (!field) return;
        field.config[key] = value;

        // Live-update card preview
        const card = this.container.querySelector(`[data-field-id="${id}"]`);
        if (card) card.querySelector('.field-preview-content').innerHTML = renderFieldPreview(field);

        // Re-render options rows if options list changed
        if (key === 'options') {
            buildOptionsPanel(field, (fid, k, v) => this.updateFieldConfig(fid, k, v));
        }

        this._saveToStorage();
    }

    /* ─────────────────────────────────────────
       UNDO / REDO
    ───────────────────────────────────────── */
    _pushHistory() {
        this.history.push(JSON.stringify(this.fields));
        if (this.history.length > 50) this.history.shift();
        this.future = [];
        this._syncUndoRedo();
    }

    undo() {
        if (!this.history.length) return;
        this.future.push(JSON.stringify(this.fields));
        this.fields = JSON.parse(this.history.pop());
        this.selectedId = null;
        this._clearOptionsPanel();
        this._render();
        this._saveToStorage();
        this._syncUndoRedo();
        showToast('Undo', 'warning');
    }

    redo() {
        if (!this.future.length) return;
        this.history.push(JSON.stringify(this.fields));
        this.fields = JSON.parse(this.future.pop());
        this._render();
        this._saveToStorage();
        this._syncUndoRedo();
        showToast('Redo');
    }

    _syncUndoRedo() {
        document.getElementById('undoBtn').disabled = !this.history.length;
        document.getElementById('redoBtn').disabled = !this.future.length;
    }

    /* ─────────────────────────────────────────
       RENDER
    ───────────────────────────────────────── */
    _render() {
        this.container.innerHTML = '';
        this.fields.forEach(f => this._appendField(f));
        this._updateEmpty();
    }

    _appendField(field) {
        const card = buildFieldCard(field);

        card.querySelector('.action-edit').addEventListener('click', () => {
            this._selectField(field, card);
        });

        card.querySelector('.action-duplicate').addEventListener('click', () => {
            this.duplicateField(field.id);
        });

        card.querySelector('.action-delete').addEventListener('click', () => {
            card.querySelector('.confirm-overlay').classList.remove('hidden');
        });

        card.querySelector('.confirm-yes').addEventListener('click', () => {
            this.removeField(field.id);
        });

        card.querySelector('.confirm-no').addEventListener('click', () => {
            card.querySelector('.confirm-overlay').classList.add('hidden');
        });

        this.container.appendChild(card);
    }

    _selectField(field, card) {
        document.querySelectorAll('.field-card.selected').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        this.selectedId = field.id;

        // Switch to Field Options panel
        document.querySelectorAll('[data-panel]').forEach(b => b.classList.remove('active'));
        document.getElementById('panelFieldOptions').classList.add('active');
        document.getElementById('addFieldsPanel').classList.add('hidden');
        document.getElementById('fieldOptionsPanel').classList.remove('hidden');

        buildOptionsPanel(field, (id, key, val) => {
            this.updateFieldConfig(id, key, val);
            if (key !== 'options') this._pushHistory();
        });
    }

    _clearOptionsPanel() {
        const form = document.getElementById('fieldOptionsForm');
        form.innerHTML = '';
        form.classList.add('hidden');
        document.getElementById('noFieldSelected').classList.remove('hidden');
    }

    _updateEmpty() {
        const has = this.fields.length > 0;
        this.emptyState.classList.toggle('hidden', has);
        this.container.classList.toggle('hidden', !has);
        document.getElementById('fieldCount').textContent =
            `${this.fields.length} field${this.fields.length !== 1 ? 's' : ''}`;
    }

    /* ─────────────────────────────────────────
       JSON SCHEMA
    ───────────────────────────────────────── */
    _buildSchema() {
        return {
            title:         document.getElementById('formTitle').value,
            submissionUrl: document.getElementById('submissionUrl').textContent,
            createdAt:     new Date().toISOString(),
            fields: this.fields.map((f, i) => ({
                id:     f.id,
                order:  i + 1,
                type:   f.type,
                config: { ...f.config },
            })),
        };
    }

    /* ─────────────────────────────────────────
       LOCAL STORAGE
    ───────────────────────────────────────── */
    _saveToStorage() {
        try {
            localStorage.setItem('fb_fields', JSON.stringify(this.fields));
            localStorage.setItem('fb_title',  document.getElementById('formTitle').value);
            const el = document.getElementById('saveStatus');
            el.classList.remove('hidden');
            clearTimeout(el._timer);
            el._timer = setTimeout(() => el.classList.add('hidden'), 2000);
        } catch (e) { /* quota exceeded — ignore */ }
    }

    _loadFromStorage() {
        try {
            const saved = localStorage.getItem('fb_fields');
            const title = localStorage.getItem('fb_title');
            if (saved) {
                this.fields = JSON.parse(saved);
                this._render();
            }
            if (title) {
                document.getElementById('formTitle').value = title;
                document.getElementById('titleCounter').textContent = `${title.length}/200`;
            }
        } catch (e) { /* corrupt storage — start fresh */ }
    }
}

/* ─────────────────────────────────────────────
   BOOT
───────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
    window.FormBuilder = new FormBuilder();
});
