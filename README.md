# FormCraft — Drag-and-Drop Form Builder

A fully functional drag-and-drop Form Builder built with **Laravel 9**, **Tailwind CSS v3**, **SortableJS**, and **Vite**. Users can visually construct HTML forms by dragging field types from a right-side palette onto a canvas, configure each field, reorder them, and export the schema as JSON.

---

## Setup Steps

### Prerequisites
- PHP ≥ 8.1
- Composer
- Node.js ≥ 18 + npm

### Install & Run

```bash
# 1. Install PHP dependencies
composer install

# 2. Copy environment file
cp .env.example .env

# 3. Generate application key
php artisan key:generate

# 4. Install Node dependencies & build assets
npm install
npm run build

# 5. Start the development server
php artisan serve
```

Then open [http://127.0.0.1:8000](http://127.0.0.1:8000) in your browser.

> **No database required.** The form builder is entirely frontend-driven with no backend persistence.

---

## Drag-and-Drop Library Choice

**[SortableJS](https://sortablejs.github.io/Sortable/)** — chosen for the following reasons:

| Criterion | Rationale |
|---|---|
| **Zero framework dependency** | Works with vanilla JS, no React/Vue required — fits the Laravel Blade constraint |
| **Native HTML5 DnD for palette → canvas** | Implemented with the browser's native `dragstart`/`drop` events for dragging new field tiles onto the canvas |
| **SortableJS for canvas reordering** | Handles the complex in-canvas drag-to-reorder behavior with smooth animations, ghost placeholders, and correct index tracking |
| **Bundle size** | ~30 KB minified — lightweight compared to alternatives like `@dnd-kit` (React-only) or `interact.js` |
| **Active maintenance** | 29k+ GitHub stars, regularly updated |

---

## Assumptions Made

1. **No backend persistence** — form state is stored in `localStorage` and exported to JSON on demand. The submission URL is a display label only.
2. **Build step required** — assets are compiled with Vite. The `public/build/` directory is committed so the app works immediately after `php artisan serve` without running `npm run build` again.
3. **State & City dropdowns** — State field shows a predefined US states list; City is a free-text input (dynamic city-by-state lookup would require an API).
4. **Settings tab** — renders as a placeholder as per requirement ("only Form Editor tab needs to be functional").
5. **Delete confirmation** — implemented as an inline overlay on the field card (bonus feature from §7).
6. **PHP 8.1 used** — Laravel 9.x requires PHP ^8.0.2 but its bundled Symfony packages need PHP 8.1+ features (enums, first-class callables). PHP 8.1 is installed at `C:\xampp\php81\php.exe`.

---

## Features Implemented

### Core (Required)
- [x] Two-column layout: drop canvas (left) + field palette (right)
- [x] Form title input with live character counter (max 200)
- [x] Submission URL display label
- [x] Form Editor / Settings tab bar
- [x] Dashed-border drop zone with empty-state hint text
- [x] Add Fields + Field Options sub-tabs in right panel
- [x] All 18 field types draggable from palette (2-column grid)
- [x] Click palette tile also adds field (not just drag)
- [x] Placed fields rendered as highlighted cards with three action icons
- [x] Drag handle for canvas reordering via SortableJS
- [x] Edit icon → opens Field Options panel with live preview updates
- [x] Duplicate icon → inserts copy directly below original with all config preserved
- [x] Delete icon → inline confirmation overlay before removal
- [x] Field Options: Label, Placeholder, Min/Max Chars, Options list (add/remove rows), Required toggle, CSS Class, Default Value, Remove Element
- [x] Cancel button (reset form) + Next button (shows JSON schema modal + console.log)
- [x] Responsive layout ≥ 1024px
- [x] Tailwind CSS — no inline styles; uses Laravel Blade component for palette tiles

### Bonus Features
- [x] **Undo / Redo** — Ctrl+Z / Ctrl+Y (up to 50 history states), also toolbar buttons
- [x] **Form Preview Mode** — modal renders the built form as a live, interactive HTML form
- [x] **LocalStorage Persistence** — fields and title survive a page refresh
- [x] **Delete Confirmation** — inline overlay on the card before removing
- [x] **Drag-over Visual Feedback** — canvas highlights with blue border and background on active drag-over

---

## Sample JSON Output

The following is produced by clicking **Next** on a sample form:

```json
{
  "title": "Customer Feedback Form",
  "submissionUrl": "http://127.0.0.1:8000/forms/submit",
  "createdAt": "2026-06-10T10:30:00.000Z",
  "fields": [
    {
      "id": "f_abc1234",
      "order": 1,
      "type": "title",
      "config": {
        "label": "Section Title",
        "placeholder": "",
        "required": false,
        "cssClass": "",
        "content": "Customer Feedback"
      }
    },
    {
      "id": "f_def5678",
      "order": 2,
      "type": "text",
      "config": {
        "label": "Full Name",
        "placeholder": "Enter your full name",
        "required": true,
        "cssClass": "",
        "defaultValue": "",
        "minChars": "2",
        "maxChars": "100"
      }
    },
    {
      "id": "f_ghi9012",
      "order": 3,
      "type": "email",
      "config": {
        "label": "Email Address",
        "placeholder": "you@example.com",
        "required": true,
        "cssClass": "",
        "defaultValue": ""
      }
    },
    {
      "id": "f_jkl3456",
      "order": 4,
      "type": "dropdown",
      "config": {
        "label": "How did you hear about us?",
        "placeholder": "Select an option…",
        "required": false,
        "cssClass": "",
        "options": ["Google Search", "Social Media", "Friend Referral", "Advertisement"]
      }
    },
    {
      "id": "f_mno7890",
      "order": 5,
      "type": "radio",
      "config": {
        "label": "Overall satisfaction",
        "placeholder": "",
        "required": true,
        "cssClass": "",
        "options": ["Very Satisfied", "Satisfied", "Neutral", "Dissatisfied"]
      }
    },
    {
      "id": "f_pqr1234",
      "order": 6,
      "type": "checkbox",
      "config": {
        "label": "Which features do you use?",
        "placeholder": "",
        "required": false,
        "cssClass": "",
        "options": ["Dashboard", "Reports", "Integrations", "API Access"]
      }
    },
    {
      "id": "f_stu5678",
      "order": 7,
      "type": "textarea",
      "config": {
        "label": "Additional Comments",
        "placeholder": "Share any feedback…",
        "required": false,
        "cssClass": "",
        "defaultValue": "",
        "minChars": "",
        "maxChars": "500"
      }
    },
    {
      "id": "f_vwx9012",
      "order": 8,
      "type": "file",
      "config": {
        "label": "Attach Screenshot (optional)",
        "placeholder": "",
        "required": false,
        "cssClass": ""
      }
    },
    {
      "id": "f_yza3456",
      "order": 9,
      "type": "hidden",
      "config": {
        "label": "source",
        "placeholder": "",
        "required": false,
        "cssClass": "",
        "defaultValue": "feedback-page"
      }
    }
  ]
}
```

---

## Project Structure

```
form-builder/
├── resources/
│   ├── views/
│   │   ├── form-builder.blade.php      # Main view (layout, canvas, palette, modals)
│   │   └── components/
│   │       └── palette-tile.blade.php  # Blade component: draggable palette tile
│   ├── css/
│   │   └── app.css                     # Tailwind directives + @layer component classes
│   └── js/
│       └── app.js                      # FormBuilder class (all DnD + state logic)
├── routes/
│   └── web.php                         # Single route → form-builder view
├── tailwind.config.js                  # Content paths + @tailwindcss/forms plugin
├── postcss.config.js                   # tailwindcss + autoprefixer
└── vite.config.js                      # Laravel Vite plugin
```
