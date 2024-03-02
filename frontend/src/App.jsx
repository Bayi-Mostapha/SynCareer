import {
    RouterProvider,
} from 'react-router-dom';
import { router } from './router';
import { Toaster } from 'sonner'

function App() {
    return (
        <>
            <Toaster position="bottom-right" richColors />
            <RouterProvider router={router} />
        </>
    )
}

export default App;
