import { Routes, Route, Navigate } from "react-router-dom";
import { Role, useAuth } from "@/auth/AuthProvider";
import { AuthStatus } from "@/auth/AuthProvider";
import { lazy } from "react";
import Loadable from "@/components/Loadable";

const PublicLayout = Loadable(lazy(() => import('@/layouts/PublicLayout')));
const Login = Loadable(lazy(() => import('@/pages/public/Login')));
const Register = Loadable(lazy(() => import('@/pages/public/Register')));

const PrivateLayout = Loadable(lazy(() => import('@/layouts/PrivateLayout')));
const Discount = Loadable(lazy(() => import('@/pages/private/Discount/Index')));
const DiscountDetail = Loadable(lazy(() => import('@/pages/private/Discount/Detail')));

const FollowTransporters = Loadable(lazy(() => import('@/pages/private/FollowTransporters/Index')));

const Cargos = Loadable(lazy(() => import('@/pages/private/CreateCargo/Index')));
const CargosDetail = Loadable(lazy(() => import('@/pages/private/CreateCargo/Detail')));

const Loader = Loadable(lazy(() => import('@/components/Loader')));


export default function Router() {
    let { login, user } = useAuth();

    if (login === AuthStatus.LOADING) {
        return <Loader />
    }


    if (login === AuthStatus.LOGGED_IN) {
        return (
            <Routes>
                <Route Component={PrivateLayout}>
                    {
                        user?.user?.role === Role.TRANSPORTER && (
                            <Route path="" Component={Discount}>
                                <Route path="transporters/discounts/new" Component={DiscountDetail} />
                            </Route>
                        )
                    }
                    {
                        user?.user?.role === Role.CUSTOMER && (
                            <>
                                <Route path="" Component={FollowTransporters} />
                                <Route path="customers/create-cargo" Component={Cargos}>
                                    <Route path="new" Component={CargosDetail} />
                                </Route>
                            </>
                        )
                    }
                    <Route path="*" element={<Navigate to="/" />} />
                </Route>
            </Routes>
        )
    }

    return (
        <Routes>
            <Route Component={PublicLayout}>
                <Route path="/login" Component={Login} />
                <Route path="/register" Component={Register} />
                <Route path="*" element={<Navigate to="/login" />} />
            </Route>
        </Routes>
    )

}
