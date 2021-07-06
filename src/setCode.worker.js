import { openDB } from 'idb';

self.onmessage = ({ data: { currentLine, currentColumn, url } }) => {
  (async () => {
    const dbName = 'Code';
    const storeName = 'codes';
    const version = 1;

    const db = await openDB(dbName, version, {
      upgrade(db) {
        db.createObjectStore(storeName);
      },
    });

    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);

    if (currentColumn > 1 || currentLine > 1) {
      await store.put(currentLine + ',' + currentColumn, url);
    } else {
      await store.delete(url);
    }
  })();
};
