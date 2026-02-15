import { createBrowserRouter, Navigate } from 'react-router';
import { ProtectedLayout } from './components/ProtectedLayout';
import { Login } from './pages/Login';
import { News } from './pages/News';
import { Inventory } from './pages/Inventory';
import { NewItem } from './pages/NewItem';
import { EditItem } from './pages/EditItem';
import { Invoice } from './pages/Invoice';
import { CreateInvoice } from './pages/CreateInvoice';
import { Sales } from './pages/Sales';

export const router = createBrowserRouter([
  {
    path: '/login',
    Component: Login,
  },
  {
    path: '/',
    Component: ProtectedLayout,
    children: [
      { 
        index: true, 
        element: <Navigate to="/news" replace />
      },
      { 
        path: 'news', 
        Component: News 
      },
      { 
        path: 'inventory', 
        Component: Inventory 
      },
      { 
        path: 'inventory/new', 
        Component: NewItem 
      },
      { 
        path: 'inventory/edit/:id', 
        Component: EditItem 
      },
      { 
        path: 'invoice', 
        Component: Invoice 
      },
      { 
        path: 'invoice/create', 
        Component: CreateInvoice 
      },
      { 
        path: 'sales', 
        Component: Sales 
      },
    ],
  },
]);