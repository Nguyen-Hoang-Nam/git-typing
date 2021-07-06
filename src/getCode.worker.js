import { openDB } from 'idb';

self.onmessage = ({ data: { url, rawCode } }) => {
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

    const lineColumn = await store.get(url);
    let code = '';
    let currentLine = 1;
    let currentColumn = 1;

    if (lineColumn) {
      [currentLine, currentColumn] = lineColumn.split(',');
      currentLine = parseInt(currentLine);
      currentColumn = parseInt(currentColumn);

      const allLines = rawCode.split('\n').slice(0, currentLine);
      allLines[currentLine - 1] = allLines[currentLine - 1].substring(
        0,
        currentColumn - 1
      );
      code = allLines.join('\n');
    }

    self.postMessage({
      code,
      currentLine,
      currentColumn,
    });
  })();
};
