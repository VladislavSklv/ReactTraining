import React, {useContext} from 'react';
import { AuthContext } from '../context';
import { Route, Routes} from 'react-router-dom';
import { privateRoutes, publicRoutes } from '../routes';

const AppRouter = () => {
    const {isAuth, setIsAuth} = useContext(AuthContext);
    
    return (
        isAuth
            ?
            <Routes>
                {privateRoutes.map(route =>
                    <Route 
                        element={route.component} 
                        path={route.path} 
                        exact={route.exact}
                        key={route.path}
                    />
                )}
            </Routes>
            :
            <Routes>
                {publicRoutes.map(route =>
                    <Route 
                        element={route.component} 
                        path={route.path} 
                        exact={route.exact}
                        key={route.path}
                    />
                )}
            </Routes>
    );
};

export default AppRouter;