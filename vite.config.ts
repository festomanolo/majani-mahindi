import { defineConfig } from "vite dev";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { execSync } from "child_process";
import os from "os";

/** Pick the first non-loopback IPv4 address on any interface. */
function getLanIp(): string {
  // Try macOS-specific fast path first
  try {
    const out = execSync("ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null", {
      encoding: "utf8",
    }).trim();
    if (out && out !== "") return out;
  } catch {
    // fall through
  }
  // Cross-platform fallback via os.networkInterfaces()
  for (const ifaces of Object.values(os.networkInterfaces())) {
    for (const iface of ifaces ?? []) {
      if (iface.family === "IPv4" && !iface.internal) return iface.address;
    }
  }
  return "localhost";
}

const LAN_IP = getLanIp();

// See https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: true,   // bind to 0.0.0.0 so phones on the same Wi-Fi can connect
    port: 3000,
  },
  define: {
    // Injected at build/serve time so the QR code always shows the real LAN IP
    __LAN_IP__: JSON.stringify(LAN_IP),
    __LAN_PORT__: JSON.stringify("3000"),
  },
  plugins: [
    tailwindcss(),
    tsconfigPaths(),
    tanstackStart({
      server: { entry: "server" },
    }),
    react(),
  ],
});
