<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Form Builder</title>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body class="bg-gray-100 min-h-screen font-sans antialiased">

<div id="app" class="min-h-screen flex flex-col">

    {{-- ===== HEADER ===== --}}
    <header class="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-20">
        <div class="max-w-screen-xl mx-auto px-6 py-3 flex items-center gap-4">
            <div class="flex items-center gap-2 shrink-0">
                <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                    </svg>
                </div>
                <span class="font-bold text-gray-800 text-lg">FormCraft</span>
            </div>

            <div class="flex-1 max-w-xl">
                <div class="relative">
                    <input
                        type="text"
                        id="formTitle"
                        maxlength="200"
                        placeholder="Untitled Form"
                        value="Untitled Form"
                        class="w-full px-3 py-1.5 text-lg font-semibold border-0 border-b-2 border-transparent focus:border-blue-500 focus:outline-none bg-transparent text-gray-800 placeholder-gray-400 transition-colors"
                    />
                    <span id="titleCounter" class="absolute right-0 top-1/2 -translate-y-1/2 text-xs text-gray-400">12/200</span>
                </div>
                <p class="text-xs text-gray-400 mt-0.5">
                    Submission URL: <code class="bg-gray-100 px-1 py-0.5 rounded text-blue-600" id="submissionUrl">{{ url('/') }}/forms/submit</code>
                </p>
            </div>

            <div class="flex items-center gap-2 ml-auto">
                {{-- Undo/Redo --}}
                <button id="undoBtn" title="Undo (Ctrl+Z)" disabled
                    class="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"/>
                    </svg>
                </button>
                <button id="redoBtn" title="Redo (Ctrl+Y)" disabled
                    class="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M21 10H11a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6"/>
                    </svg>
                </button>

                {{-- Preview toggle --}}
                <button id="previewBtn"
                    class="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors border border-gray-200">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                        <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                    </svg>
                    Preview
                </button>
            </div>
        </div>

        {{-- Tab bar --}}
        <div class="max-w-screen-xl mx-auto px-6 flex items-center gap-1 bg-gray-50 border-t border-gray-100 py-1">
            <button id="tabEditor" class="tab-btn active" data-tab="editor">Form Editor</button>
            <button id="tabSettings" class="tab-btn" data-tab="settings">Settings</button>
        </div>
    </header>

    {{-- ===== MAIN CONTENT ===== --}}
    <main class="flex-1 max-w-screen-xl mx-auto w-full px-6 py-6 flex flex-col" style="min-height: 0;">

        {{-- Editor Tab --}}
        <div id="editorTab" class="flex gap-6 flex-1" style="min-height: 0;">

            {{-- ===== LEFT: DROP CANVAS ===== --}}
            <div class="flex-1 flex flex-col min-w-0">
                {{-- Canvas header --}}
                <div class="flex items-center justify-between mb-3">
                    <h2 class="text-sm font-semibold text-gray-500 uppercase tracking-wider">Canvas</h2>
                    <span id="fieldCount" class="text-xs text-gray-400">0 fields</span>
                </div>

                {{-- Drop zone --}}
                <div
                    id="dropCanvas"
                    class="flex-1 bg-white rounded-2xl border-2 border-dashed border-gray-200 overflow-y-auto transition-colors duration-200"
                    style="min-height: 480px;"
                >
                    {{-- Empty state --}}
                    <div id="emptyState" class="drop-zone-empty h-full flex flex-col items-center justify-center gap-3 p-8">
                        <div class="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center">
                            <svg class="w-8 h-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/>
                            </svg>
                        </div>
                        <div class="text-center">
                            <p class="text-gray-500 font-medium">Drag elements from the right panel to build your form →</p>
                            <p class="text-gray-400 text-sm mt-1">Or click any field type in the palette to add it</p>
                        </div>
                    </div>

                    {{-- Fields container --}}
                    <div id="fieldsContainer" class="p-4 space-y-3 hidden"></div>
                </div>
            </div>

            {{-- ===== RIGHT: PALETTE + OPTIONS ===== --}}
            <div class="w-72 shrink-0 flex flex-col" style="min-height: 0;">
                {{-- Panel tabs --}}
                <div class="bg-gray-100 rounded-xl p-1 flex gap-1 mb-3">
                    <button id="panelAddFields" class="tab-btn active flex-1 text-center" data-panel="add-fields">Add Fields</button>
                    <button id="panelFieldOptions" class="tab-btn flex-1 text-center" data-panel="field-options">Field Options</button>
                </div>

                {{-- Add Fields panel --}}
                <div id="addFieldsPanel" class="flex-1 bg-white rounded-2xl border border-gray-100 overflow-y-auto shadow-sm">
                    <div class="p-4">
                        <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Input Fields</p>
                        <div class="grid grid-cols-2 gap-2" id="paletteGrid">

                            @php
                            $fields = [
                                ['type'=>'text',        'label'=>'Text Input',    'icon'=>'T'],
                                ['type'=>'textarea',    'label'=>'Text Area',     'icon'=>'¶'],
                                ['type'=>'number',      'label'=>'Number Input',  'icon'=>'#'],
                                ['type'=>'email',       'label'=>'Email Input',   'icon'=>'@'],
                                ['type'=>'phone',       'label'=>'Phone Input',   'icon'=>'☏'],
                                ['type'=>'dropdown',    'label'=>'Dropdown',      'icon'=>'▼'],
                                ['type'=>'radio',       'label'=>'Radio Buttons', 'icon'=>'◉'],
                                ['type'=>'checkbox',    'label'=>'Checkboxes',    'icon'=>'☑'],
                                ['type'=>'date',        'label'=>'Date Picker',   'icon'=>'📅'],
                                ['type'=>'file',        'label'=>'File Upload',   'icon'=>'↑'],
                            ];
                            $structural = [
                                ['type'=>'title',       'label'=>'Title',         'icon'=>'H'],
                                ['type'=>'description', 'label'=>'Description',   'icon'=>'≡'],
                                ['type'=>'newline',     'label'=>'New Line',      'icon'=>'↵'],
                                ['type'=>'pagebreak',   'label'=>'Page Break',    'icon'=>'⊣'],
                                ['type'=>'hidden',      'label'=>'Hidden Field',  'icon'=>'○'],
                            ];
                            $location = [
                                ['type'=>'state',       'label'=>'State',         'icon'=>'◎'],
                                ['type'=>'city',        'label'=>'City',          'icon'=>'◎'],
                                ['type'=>'statecity',   'label'=>'State & City',  'icon'=>'◎'],
                            ];
                            @endphp

                            @foreach($fields as $f)
                            <x-palette-tile :type="$f['type']" :label="$f['label']" :icon="$f['icon']" />
                            @endforeach
                        </div>

                        <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 mt-4">Layout & Structural</p>
                        <div class="grid grid-cols-2 gap-2">
                            @foreach($structural as $f)
                            <x-palette-tile :type="$f['type']" :label="$f['label']" :icon="$f['icon']" />
                            @endforeach
                        </div>

                        <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 mt-4">Location</p>
                        <div class="grid grid-cols-2 gap-2">
                            @foreach($location as $f)
                            <x-palette-tile :type="$f['type']" :label="$f['label']" :icon="$f['icon']" />
                            @endforeach
                        </div>
                    </div>
                </div>

                {{-- Field Options panel --}}
                <div id="fieldOptionsPanel" class="flex-1 bg-white rounded-2xl border border-gray-100 overflow-y-auto shadow-sm hidden">
                    <div id="noFieldSelected" class="flex flex-col items-center justify-center h-full text-center p-8 text-gray-400">
                        <svg class="w-10 h-10 mb-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                        </svg>
                        <p class="text-sm font-medium">Click the edit icon on a field to configure it</p>
                    </div>
                    <div id="fieldOptionsForm" class="p-4 space-y-4 hidden"></div>
                </div>
            </div>
        </div>

        {{-- Settings Tab (non-functional placeholder) --}}
        <div id="settingsTab" class="hidden flex-1">
            <div class="bg-white rounded-2xl border border-gray-100 p-8 text-center text-gray-400 shadow-sm">
                <svg class="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                <p class="font-medium text-gray-500">Settings</p>
                <p class="text-sm mt-1">Form settings will appear here.</p>
            </div>
        </div>

    </main>

    {{-- ===== FOOTER ===== --}}
    <footer class="bg-white border-t border-gray-200 sticky bottom-0 z-20">
        <div class="max-w-screen-xl mx-auto px-6 py-3 flex items-center justify-between">
            <button id="cancelBtn" class="btn-outline">Cancel</button>
            <div class="flex items-center gap-3">
                <span id="saveStatus" class="text-xs text-gray-400 hidden">
                    <span class="inline-block w-2 h-2 bg-green-500 rounded-full mr-1"></span>Auto-saved
                </span>
                <button id="nextBtn" class="btn-primary">
                    Next →
                </button>
            </div>
        </div>
    </footer>

</div>

{{-- ===== PREVIEW MODAL ===== --}}
<div id="previewModal" class="hidden fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 class="font-bold text-gray-800 text-lg" id="previewFormTitle">Form Preview</h2>
            <button id="closePreview" class="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
                </svg>
            </button>
        </div>
        <div id="previewContent" class="flex-1 overflow-y-auto p-6 space-y-5"></div>
        <div class="px-6 py-4 border-t border-gray-100 flex justify-end">
            <button class="btn-primary" onclick="document.getElementById('previewModal').classList.add('hidden')">Close Preview</button>
        </div>
    </div>
</div>

{{-- ===== JSON MODAL ===== --}}
<div id="jsonModal" class="hidden fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 class="font-bold text-gray-800">Form JSON Schema</h2>
            <button onclick="document.getElementById('jsonModal').classList.add('hidden')" class="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
                </svg>
            </button>
        </div>
        <pre id="jsonOutput" class="flex-1 overflow-y-auto p-6 text-xs bg-gray-900 text-green-400 font-mono rounded-b-2xl whitespace-pre-wrap"></pre>
    </div>
</div>

{{-- ===== TOAST ===== --}}
<div id="toast" class="toast hidden"></div>

</body>
</html>
