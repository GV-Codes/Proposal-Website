# Pranav Payroll Services — Payroll Vendor Advisor

A static HTML/CSS/JavaScript vendor comparison and proposal tool. No backend, paid API, build step, or server-side dependency is required.

## Files
- `index.html` — page structure and client proposal
- `style.css` — responsive layout and print styling
- `script.js` — vendor rates, calculations, and proposal population

## Run locally
Open `index.html` in a modern browser.

## Deploy to GitHub Pages or Vercel
1. Create a GitHub repository.
2. Upload `index.html`, `style.css`, and `script.js` to the repository root.
3. In Vercel, choose **Add New → Project**, import the repository, and deploy.
4. Use the default static deployment settings; no build command or output directory is needed.

## Pricing calculation assumptions
- Base fee: fixed monthly vendor charge.
- Per-employee fee: monthly charge multiplied by employee count.
- Timekeeping: monthly per-employee charge, included only when selected.
- Delivery: per-payroll-run charge multiplied by annual payroll runs, divided by 12.
- Payroll runs/year: weekly 52, biweekly 26, semimonthly 24, monthly 12, quarterly 4.
- 1.5% gross profit margin: client price = vendor cost ÷ (1 − 0.015). This makes gross profit equal to 1.5% of the client selling price.
- Annual amounts are monthly amounts multiplied by 12.

## PDF proposal
Select a vendor, enter a client company name, then choose **Print / Save proposal as PDF**. In the browser print dialog, select **Save as PDF**.

## Important demo note
The nine vendor rates are demonstration inputs supplied for this prototype. Confirm vendor contracts, billing definitions, taxes, setup fees, and any additional charges before quoting a real client. This tool does not transmit or store client data on a server.
