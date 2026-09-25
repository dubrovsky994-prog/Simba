import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import './public-v2-reference.css'
import './simba-master.css'
import './simba-refinements.css'

const routePath = window.location.pathname.replace(/\/+$/, '') || '/'
const isOwnerRoute = routePath === '/owner'
const isPersonalSpaceRoute = routePath === '/space'
// The local MVP has no server authentication. Never ship its data layer/UI.
const OwnerApp = import.meta.env.DEV && isOwnerRoute
  ? React.lazy(() => import('./owner/OwnerApp'))
  : null
const PersonalSpace = import.meta.env.DEV && isPersonalSpaceRoute
  ? React.lazy(() => import('./features/personal-space/PersonalSpace').then((module) => ({ default: module.PersonalSpace })))
  : null

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {isPersonalSpaceRoute ? PersonalSpace ? (
      <React.Suspense fallback={<p className="p-8">Открываем пространство SIMBA…</p>}>
        <PersonalSpace />
      </React.Suspense>
    ) : (
      <main className="container-px py-20">
        <h1 className="section-title">Пространство пока недоступно</h1>
        <p className="section-subtitle">Локальный preview. Доступ и данные владельца ещё не подключены.</p>
        <a className="btn-secondary mt-8" href="/">На сайт SIMBA</a>
      </main>
    ) : isOwnerRoute ? OwnerApp ? (
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
