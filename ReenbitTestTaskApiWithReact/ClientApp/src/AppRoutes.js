import { Counter } from "./components/Counter";
import { FetchData } from "./components/FetchData";
import { Home } from "./components/Home";
import { Form } from "./components/Form";

const AppRoutes = [
  {
    index: true,
    element: <Home />
  },
  {
        path: '/form',
        element: <Form />
  },
  {
    path: '/counter',
    element: <Counter />
  },
  {
    path: '/fetch-data',
    element: <FetchData />
  }
];

export default AppRoutes;
