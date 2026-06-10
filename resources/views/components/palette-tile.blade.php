@props(['type', 'label', 'icon'])

<div
    class="palette-tile"
    draggable="true"
    data-field-type="{{ $type }}"
    data-field-label="{{ $label }}"
    onclick="window.FormBuilder && window.FormBuilder.addField('{{ $type }}', '{{ $label }}')"
>
    <span class="w-6 h-6 flex items-center justify-center bg-blue-50 text-blue-600 rounded font-bold text-xs shrink-0">
        {{ $icon }}
    </span>
    <span class="truncate">{{ $label }}</span>
</div>
