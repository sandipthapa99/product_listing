import { Route, Routes } from 'react-router-dom';
import ProductDetails from '../components/ProductDetails';
import NoProduct from '../components/NoProduct';
import RootLayout from '../components/RootLayout';

interface AppRoute {
  path: string;
  element: React.ReactNode;
  children?: AppRoute[];
}
const routes: AppRoute[] = [
  {
    path: '/',
    element: <RootLayout />,

    children: [
      {
        path: '',
        element: <NoProduct />,
      },
      {
        path: 'products/:id',
        element: <ProductDetails />,
      },
    ],
  },
];

export const AppRoutes = () => (
  <Routes>
    {routes.map((route) => (
      <Route key={route.path} path={route.path} element={route.element}>
        {route?.children?.map((childRoute) => (
          <Route
            key={childRoute.path}
            path={childRoute.path}
            element={childRoute.element}
          />
        ))}
      </Route>
    ))}
  </Routes>
);
