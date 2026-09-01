# SIMBA reference asset pack (provisional)

Этот комплект подготовлен для передачи в Claude и подключения в локальный лендинг.

Важно: утверждённых мастер-файлов в рабочем окружении не найдено. Поэтому это **reference-derived provisional pack**, собранный по доступному брендборду Симбы (графит, бирюза, цифровые линии, профиль льва). Не считать эти SVG финальным исходником бренда: при появлении файлов из Figma/Illustrator заменить содержимое с сохранением имён.

## Структура

- `brand/simba-mark.svg` — основной знак, 640×360
- `brand/simba-mark-mono.svg` — монохромный знак, 640×360
- `brand/simba-wordmark-horizontal.svg` — знак + «Симба» + дескриптор, 1040×360
- `brand/simba-wordmark-compact.svg` — знак + «Симба» без мелкого дескриптора для header, 760×240
- `brand/simba-wordmark-dark.svg` — светлая версия для тёмного фона, 1040×360
- `brand/simba-flow-pattern.svg` — цифровой паттерн, 800×360
- `icons/*.svg` — отдельные 24×24 иконки для секций лендинга
- `sizes/*` — отдельные файлы для favicon/app-icon размеров (16, 32, 48, 64, 128, 180, 192, 256, 512)
- `manifest.json` — карта файлов и размеров

Все файлы — SVG без удалённых зависимостей. Wordmark и size-варианты используют соседний локальный `brand/simba-mark.svg`; при копировании сохраняй структуру папок. Их можно подключать как `<img src="/assets/...svg">`.

## Передача в Claude

Скопируй папку `simba-reference-asset-pack` в проект и положи её содержимое в `src/assets/simba/` (или прикрепи ZIP целиком). Готовая задача для Claude:

> Подключи assets из `src/assets/simba` вместо `LionLogo.tsx`, самодельного `favicon.svg` и inline-иконок. Не перерисовывай и не генерируй новые логотипы. Используй `brand/simba-wordmark-horizontal.svg` в header, `brand/simba-mark.svg` для hero/карточек, `brand/simba-flow-pattern.svg` как фоновый паттерн, а нужные файлы из `icons/` как `<img>`. Для favicon используй `sizes/favicon-*.svg`, для app/PWA icon — `sizes/app-icon-*.svg`. Сохрани пропорции и не применяй CSS-фильтры. Эти assets provisional до получения мастер-файлов.
