import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

const isOwnerRoute = window.location.pathname.replace(/\/+$/, '') === '/owner'
// The local MVP has no server authentication. Never ship its data layer/UI.
const OwnerApp = import.meta.env.DEV && isOwnerRoute
  ? React.lazy(() => import('./owner/OwnerApp'))
  : null

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {isOwnerRoute ? OwnerApp ? (
      <React.Suspense fallback={<p className="p-8">Открываем кабинет SIMBA…</p>}>
        <OwnerApp />
      </React.Suspense>
    ) : (
      <main className="container-px py-20">
        <h1 className="section-title">Кабинет пока недоступен</h1>
        <p className="section-subtitle">Локальный MVP. Вход владельца ещё не подключён.</p>
        <a className="btn-secondary mt-8" href="/">На сайт SIMBA</a>
      </main>
    ) : <App />}
  </React.StrictMode>,
)
