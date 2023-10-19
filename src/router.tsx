import { ErrorBoundary } from 'react-error-boundary'
import { Navigate, Outlet, createBrowserRouter, redirect } from 'react-router-dom'
import { useQueryErrorResetBoundary, QueryClientProvider, QueryClient } from '@tanstack/react-query'

import Day from 'pages/Day'
import Week from 'pages/Week'
import Year from 'pages/Year'
import Error from 'components/Error'
import Login from 'components/Login'
import Settings from 'pages/Settings'
import NavBar from 'components/NavBar'
import { getUserId } from 'helpers/auth'
import { DayProvider } from 'context/day'
import { WeekProvider } from 'context/week'
import { YearProvider } from 'context/year'
import { LoadingProvider } from 'context/loading'
import NetworkStatus from 'components/NetworkStatus'
import UpdateLoadingIndicator from 'components/UpdateLoadingIndicator'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      networkMode: 'always',
      retryDelay: 300,
      useErrorBoundary: true,
    },
    mutations: {
      networkMode: 'always',
      useErrorBoundary: true,
    },
  },
})

async function assureAuth() {
  const userId = await getUserId()
  if (!userId) {
    throw redirect('/login')
  }

  return userId
}

function Root() {
  const { reset } = useQueryErrorResetBoundary()
  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary onReset={reset} fallbackRender={Error}>
        <LoadingProvider>
          <div className="min-h-screen mx-auto max-w-screen-2xl">
            <Outlet />
            <NavBar />
            <NetworkStatus />
            <UpdateLoadingIndicator />
          </div>
        </LoadingProvider>
      </ErrorBoundary>
    </QueryClientProvider>
  )
}

function AuthRoot() {
  const { reset } = useQueryErrorResetBoundary()
  return (
    <ErrorBoundary onReset={reset} fallbackRender={Error}>
      <Outlet />
      <NetworkStatus />
    </ErrorBoundary>
  )
}

export default createBrowserRouter([
  {
    path: '/login',
    element: <AuthRoot />,
    children: [
      {
        path: '/login',
        element: <Login />,
        loader: async () => {
          const userId = await getUserId()
          if (userId) {
            throw redirect('/')
          }
          return null
        },
      },
    ],
  },
  {
    path: '/',
    element: <Root />,
    errorElement: <Error />,
    loader: async () => {
      await assureAuth()
      return null
    },
    children: [
      {
        path: '/day',
        element: (
          <DayProvider>
            <Day />
          </DayProvider>
        ),
      },
      {
        path: '/week',
        element: (
          <WeekProvider>
            <Week />
          </WeekProvider>
        ),
      },
      {
        path: '/year',
        element: (
          <YearProvider>
            <Year />
          </YearProvider>
        ),
      },
      {
        path: '/settings',
        element: <Settings />,
      },
      {
        path: '/',
        element: <Navigate to="/day" />,
      },
    ],
  },
])
