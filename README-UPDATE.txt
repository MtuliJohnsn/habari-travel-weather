# HABARI Travel Weather update

This update adds browser-permission-based local weather, current conditions, refreshed responsive styling, and improved metadata.

## Install the update
Copy the files in this ZIP into the root of your `weatherapplication` project, keeping the folder structure. Replace files when prompted.

Files:
- `src/App.jsx`
- `src/App.css`
- `src/index.css`
- `index.html`
- `public/manifest.webmanifest`

Then run:
```bash
npm run build
npm run dev -- --host 0.0.0.0
```

## Location privacy
The app requests browser geolocation only after a visitor presses **Use my current location**. Coordinates are sent to Open-Meteo to retrieve weather. The app does not save coordinates.

## Notes
- Live forecast coverage is up to 16 days.
- Weather data is provided by Open-Meteo.
- Activity scores are simple planning estimates, not safety advice.
- Replace the example canonical URL in `index.html` with the final production domain before publishing.
