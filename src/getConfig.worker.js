import { openDB } from "idb";

self.onmessage = ({ data: { } }) => {
    (async () => {
        const dbName = "Config";
        const storeName = "configs";
        const version = 1;

        const db = await openDB(dbName, version, {
            upgrade(db) {
                db.createObjectStore(storeName);
            },
        });

        const transaction = db.transaction(storeName, "readwrite");
        const store = transaction.objectStore(storeName);

        const theme = (await store.get("theme")) ?? "Onedark";
        const fontFamily = (await store.get("fontFamily")) ?? "Monospace";
        const fontSize = (await store.get("fontSize")) ?? 14;

        self.postMessage({
            theme,
            fontFamily,
            fontSize,
        });
    })();
};
