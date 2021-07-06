import { openDB } from 'idb';

self.onmessage = ({ data: { value, key } }) => {
  (async () => {
    const dbName = 'Config';
    const storeName = 'configs';
    const version = 1;

    const db = await openDB(dbName, version, {
      upgrade(db) {
        db.createObjectStore(storeName);
      },
    });

    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);

    await store.put(value, key);
  })();
};
