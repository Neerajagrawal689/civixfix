const fs = require('fs');
const app = fs.readFileSync('src/App.jsx', 'utf8');
const sidebar = fs.readFileSync('src/components/layout/Sidebar.jsx', 'utf8');
const appRoutes = [...app.matchAll(/<Route path="([^"]+)"/g)].map(m => m[1]);
const sidebarLinks = [...sidebar.matchAll(/path:\s*'([^']+)'/g)].map(m => m[1]);
console.log('App Routes:', appRoutes);
console.log('Sidebar Links:', [...new Set(sidebarLinks)]);
