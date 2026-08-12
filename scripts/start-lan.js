const os = require('os');
const { spawn } = require('child_process');

function getLanIP() {
  const ifaces = os.networkInterfaces();
  const candidates = [];
  for (const name of Object.keys(ifaces)) {
    for (const info of ifaces[name] || []) {
      if (info.family === 'IPv4' && !info.internal) {
        candidates.push({ name, address: info.address });
      }
    }
  }
  const preferred = candidates.find((c) => /^192\.168\./.test(c.address));
  const picked = preferred || candidates[0];
  if (!picked) throw new Error('No LAN IPv4 interface found');
  console.log(`Using packager host: ${picked.address} (${picked.name})`);
  return picked.address;
}

const ip = getLanIP();
const child = spawn(
  'npx.cmd',
  ['expo', 'start', '--lan'],
  {
    env: { ...process.env, REACT_NATIVE_PACKAGER_HOSTNAME: ip },
    stdio: 'inherit',
    shell: false,
  }
);

child.on('exit', (code) => process.exit(code || 0));
child.on('error', (err) => {
  console.error(err);
  process.exit(1);
});