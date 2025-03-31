import { FC, lazy, Suspense } from 'react'
import { Route, RouteProps, Routes as Switch } from 'react-router-dom'

import PrivateRoute from './PrivateRoute'
import RestrictedRoute from './RestrictedRoute'

export enum RouteType {
  PUBLIC,
  PRIVATE,
  RESTRICTED,
}

type AppRoute = RouteProps & {
  type?: RouteType
}

/* Public routes */
const Home = lazy(() => import('pages/Home'))
const Login = lazy(() => import('pages/Login'))
const Register = lazy(() => import('pages/Register'))
const OAuthCallback = lazy(() => import('components/user/OAuthCallback'))


/* Private routes */
const AddLocation = lazy(() => import('pages/Locations/AddLocation'))
const EditLocation = lazy(() => import('pages/Locations/EditLocation'))
const Profile = lazy(() => import('pages/Profile'))

const ProfileSettings = lazy(() => import('pages/ProfileSettings'))

const GuessPage = lazy(() => import('pages/Guess'))
/* Restricted routes */


/* Error routes */
const Page404 = lazy(() => import('pages/Page404'))

export const AppRoutes: AppRoute[] = [
  

  // Private Routes
  {
    type: RouteType.PRIVATE,
    path: '/profile',
    children: <Profile />,
  },
  {
    type: RouteType.PRIVATE,
    path: '/addlocation',
    children: <AddLocation />,
  },
  {
    type: RouteType.PRIVATE,
    path: '/locations/:id/edit',
    children: <EditLocation />,
  },
  {
    type: RouteType.PRIVATE,
    path: '/profile-settings',
    children: <ProfileSettings />,
  },
  {
    type: RouteType.PRIVATE,
    path: '/guess/:id',
    children: <GuessPage />,
  },
  // Public Routes
  {
    type: RouteType.PUBLIC,
    path: '/',
    children: <Home />,
  },
  {
    type: RouteType.PUBLIC,
    path: '/login',
    children: <Login />,
  },
  {
    type: RouteType.PUBLIC,
    path: '/OAuthCallback',
    children: <OAuthCallback />,
  },
  {
    type: RouteType.PUBLIC,
    path: '/signup',
    children: <Register />,
  },
  // 404 Error
  {
    type: RouteType.PUBLIC,
    path: '*',
    children: <Page404 />,
  },
]

const Routes: FC = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Switch>
        {AppRoutes.map((r) => {
          const { type } = r
          if (type === RouteType.PRIVATE) {
            return (
              <Route
                key={`${r.path}`}
                path={`${r.path}`}
                element={<PrivateRoute>{r.children}</PrivateRoute>}
              />
            )
          }
          if (type === RouteType.RESTRICTED) {
            return (
              <Route
                key={`${r.path}`}
                path={`${r.path}`}
                element={<RestrictedRoute>{r.children}</RestrictedRoute>}
              />
            )
          }

          return (
            <Route key={`${r.path}`} path={`${r.path}`} element={r.children} />
          )
        })}
      </Switch>
    </Suspense>
  )
}

export default Routes
