// import React from 'react';

// import HomeScreen from './screens/HomeScreen';


// function App() {
//   return (
//     <>
//       <HomeScreen/>
//     </>
//   );
// }

// export default App;

import React from 'react';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import NotFoundScreen from './screens/NotFound';
import DashboardScreen from './screens/DashboardScreen';
import AdminPage from './adminPage';
import HomeScreen from './screens/HomeScreen';
import ResultTable from './table';

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeScreen/>,
    errorElement: <NotFoundScreen/>
  },
  {
    path: "dashboard",
    element: <DashboardScreen/>
  },
  {
    path: "admin/:contactId",
    element: <AdminPage />,
  },
  {
    path: "results/:resultId",
    element: <ResultTable />,
  }
]);

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;
