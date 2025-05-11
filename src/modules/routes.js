import { Route, Routes } from 'react-router-dom';
import { RoutesLinks } from "./LinkShare";


const AppRoutes = () => {
    return (
        <Routes>
            {RoutesLinks.map((route, index) => (
                <Route key={index} path={route.path} element={route.element} />
            ))}
        </Routes>
    );
};

export { AppRoutes, Routes };
