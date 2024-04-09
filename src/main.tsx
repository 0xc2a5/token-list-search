import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const maxAge = 1000 * 60 * 60 * 24 * 7 // 1 week

const queryClient = new QueryClient({
    defaultOptions: {
        queries: { gcTime: maxAge },
    }
});

const persister = createSyncStoragePersister({
    storage: window.localStorage,
});

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <PersistQueryClientProvider
            client={queryClient}
            persistOptions={{ maxAge, persister }}
        >
            <App />
        </PersistQueryClientProvider>
    </React.StrictMode>,
)
