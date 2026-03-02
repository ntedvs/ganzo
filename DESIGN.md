# Stanzo Design System

## Typography

**Single typeface: Host Grotesk**

All text uses Host Grotesk. No secondary font.

### Type Roles

| Role                         | Size | Weight | Transform | Color               |
| ---------------------------- | ---- | ------ | --------- | ------------------- |
| Brand                        | 24px | 500    | —         | #000                |
| Section label                | 11px | 600    | uppercase | #888                |
| Speaker name (transcript)    | 11px | 600    | uppercase | #666                |
| Footer / nav text            | 11px | 600    | uppercase | #888                |
| Check label ("VERIFICATION") | 10px | 700    | uppercase | #999                |
| Source citation              | 10px | 400    | uppercase | #aaa                |
| Data row label               | 13px | 400    | —         | #000                |
| Data row value               | 13px | 500    | —         | #000 (tabular-nums) |
| Sidebar body text            | 13px | 400    | —         | #444                |
| Timestamp                    | 12px | 400    | —         | #999 (tabular-nums) |
| Transcript speech            | 18px | 400    | —         | #111                |
| Fact-check body              | 13px | 400    | —         | #555                |
| Verdict text                 | 12px | 600    | —         | #111                |

### Line Heights

- UI / labels: 1.4
- Body / sidebar text: 1.5
- Transcript speech: 1.5

---

## Color

Light mode only.

```
--bg:           #FFFFFF
--surface:      #FAFAFA   (not yet used, reserved)
--border:       #E5E5E5   (primary borders)
--border-faint: #F0F0F0   (row dividers, subtle separators)

--text-primary:   #000000
--text-secondary: #444444
--text-muted:     #777777 / #888888 / #999999
--text-faint:     #AAAAAA

--live-red: #FF3B30       (blinking live indicator only)
```

No other accent colors. The verdict system uses the monochromatic palette — false claims get a black-bordered badge, not a red color.

---

## Space & Layout

- Base unit: 8px
- Sidebar width: 260px
- Page layout: CSS grid, `260px 1fr`, full viewport height, no overflow on body
- Header padding: 20px 32px
- Sidebar padding: 32px, gap 40px between control groups
- Footer padding: 12px 32px
- Transcript stream padding: 0 32px 32px
- Feed item grid: `80px 1fr`, gap 40px, padding 32px 0 between items

---

## Borders & Radius

- All borders: 1px solid
- **No border-radius on functional elements** (badges, cards, inputs)
- Borders use `--border` or `--border-faint` depending on visual weight needed

---

## Shadows

None. Depth is created through borders and color contrast only.

---

## Components

### Section Label

```
font-size: 11px
font-weight: 600
text-transform: uppercase
letter-spacing: 0.08em
color: #888
margin-bottom: 4px
```

### Data Row

```
display: flex
justify-content: space-between
border-bottom: 1px solid #F0F0F0
padding: 6px 0
font-size: 13px
```

### Feed Item (transcript entry)

```
display: grid
grid-template-columns: 80px 1fr
gap: 40px
padding: 32px 0
border-bottom: 1px solid #F0F0F0
```

### Fact-Check Block (inline, accurate verdict)

```
margin-top: 24px
border-left: 1px solid #E5E5E5
padding-left: 20px

Header: "VERIFICATION" (check-label style) + verdict word (12px, 600, #111)
Body: 13px, #555, max-width 560px
Source: 10px, uppercase, #aaa, margin-top 12px
```

### Verdict Badge (false claim only)

```
display: inline-block
border: 1px solid #000
padding: 1px 6px
font-size: 10px
font-weight: 700
text-transform: uppercase
no border-radius
```

### Ghost Button (footer, sidebar actions)

```
background: none
border: none
font-family: inherit
font-size: 11px
font-weight: 600
text-transform: uppercase
letter-spacing: 0.08em
color: #888
cursor: pointer
padding: 0
hover: color #000
```

### Live Indicator

```
display: inline-flex
align-items: center
gap: 8px
font-size: 11px, font-weight 600, uppercase, letter-spacing 0.05em

Dot: 6px × 6px, border-radius 50%, background #FF3B30
Animation: opacity pulses 0.3→1 on 2s linear loop
```

### Sticky Feed Header

```
position: sticky, top: 0
background: rgba(255,255,255,0.95)
backdrop-filter: blur(4px)
padding: 12px 32px
border-bottom: 1px solid #F0F0F0
z-index: 10
```

---

## Scrollbar

```
width: 4px
track: transparent
thumb: #EEEEEE
```

---

## Motion

Minimal. Only:

- Live indicator dot blink (2s linear, opacity)
- Scroll-to-bottom on new transcript chunks (smooth)
- Button hover color transition (0.2s)

No entrance animations, no layout transitions.

---

## Principles

1. **Uppercase labels are the hierarchy system.** Size and weight differences are subtle; uppercase + letter-spacing does the heavy lifting.
2. **The content is the design.** Transcript text at 18px is the largest element on screen intentionally.
3. **Monochromatic.** The only color is the live red dot. Verdicts use weight and borders, not color.
4. **No decoration.** No shadows, no gradients, no rounded corners on interactive elements.
5. **Tabular data patterns.** Metrics and speaker status use the data-row pattern everywhere.
