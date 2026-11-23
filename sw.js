// ISOMOVE telah berpindah ke /mathmotion/isomove/. Service worker lama ini membuang cache lamanya dan menyahdaftar diri.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k.startsWith('isomove')).map(k => caches.delete(k))))
      .then(() => self.registration.unregister())
      .then(() => self.clients.matchAll({ type: 'window' }))
      .then(cs => cs.forEach(c => c.navigate('/mathmotion/isomove/')))
  );
});
