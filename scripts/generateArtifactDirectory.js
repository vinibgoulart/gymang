// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs');

const dir = '__generated__';

const relayPackages = [
  {
    name: 'web',
    path: `./apps/web/${dir}`,
  },
];

(async () => {
  relayPackages.map((package) => {
    if (!fs.existsSync(package.path)) {
      console.log(`__generated__ folder created on ${package.name}`);
      fs.mkdirSync(package.path);
    } else {
      console.log(`__generated__ folder exists on ${package.name}`);
    }
  });

  process.exit(0);
})();
