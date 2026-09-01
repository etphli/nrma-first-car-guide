export default {
  plugins: [
    {
      name: 'lowbeam-entry',
      enforce: 'post',
      transformIndexHtml(html) {
        return html
          .replace('/src/main.jsx', '/src/entry.jsx')
          .replace('<title>NRMA First Car Guide</title>', '<title>LOWBEAM · A calmer first-car decision</title>');
      },
      transform(code, id) {
        if (!id.includes('/src/App.jsx')) return null;

        // Keep the original classroom demo intact while making the old clone
        // reachable only inside the clearly separated /og route namespace.
        return code
          .replace(/const GUIDE = ['"]\/guide['"];?/, "const GUIDE = '/og/guide';")
          .replaceAll('to="/"', 'to="/og"')
          .replaceAll('to:"/"', 'to:"/og"')
          .replaceAll('to: "/"', 'to: "/og"')
          .replaceAll("window.location.pathname === '/'", "window.location.pathname === '/og'")
          .replaceAll('window.location.pathname === "/"', 'window.location.pathname === "/og"');
      },
    },
  ],
};
