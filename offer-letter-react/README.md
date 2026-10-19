# Offer Letter Generator (React)

React + Vite version of the UX Interfacely offer letter generator. Same features as the
old `index.html` / `script.js` version: generate a 4-page letter, edit it in place,
download it as PDF, email it, auto-save it, and search past letters.

## 1. One-time setup

1. Put your **`signature.png`** (the company stamp/signature image) into the `public/` folder.
   `logonew.png` (the cropped logo) is already there.
2. Copy `.env.example` to `.env` and fill in the key:

   ```
   VITE_API_BASE=https://offer-letter-ux.onrender.com
   VITE_API_KEY=<the same key your old script.js sent in the x-api-key header>
   ```

## 2. Run locally

```
npm install
npm run dev
```

## 3. Deploy on Vercel

- Framework preset: **Vite** (auto-detected). Build command `npm run build`, output folder `dist`.
- In Vercel -> Project -> Settings -> Environment Variables, add `VITE_API_BASE` and
  `VITE_API_KEY`, then redeploy.
- `ALLOWED_ORIGIN` on Render must be your Vercel site URL (same as before).

Note: anything starting with `VITE_` is bundled into the browser code, so the key is
visible to anyone who opens dev tools - exactly as it was in the old script.js.

## Project layout

```
public/            logonew.png, signature.png
src/
  main.jsx         entry point
  App.jsx          state + handlers (generate, PDF, email, auto-save, edit mode)
  index.css        all styling (letter sizes follow the Style Sizes doc)
  components/
    SearchHeader.jsx   logo, search box, title
    OfferForm.jsx      the form fields
    Letter.jsx         the 4 letter pages
    SalaryTable.jsx    salary table incl. the ending CTC row
  lib/
    salary.js      calculation rules (PF depends on date of joining)
    format.js      rupees, dates, number-to-words, LPA
    validate.js    required-field checks
    api.js         calls to the Render backend
    pdf.js         html2canvas + jsPDF export
    company.js     company name, images
```

## Where to change things

- Salary rules / PF cut-off date: `src/lib/salary.js`
- Letter wording: `src/components/Letter.jsx`
- Sizes and colours: `src/index.css`
