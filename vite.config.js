export default {
  plugins: [
    {
      name: 'legacy-og-routes',
      enforce: 'post',
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
