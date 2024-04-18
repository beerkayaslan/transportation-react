import { Outlet } from "react-router-dom";
import DataTable from "@/components/private/DataTable/Index";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Link } from "react-router-dom";
import Header from "@/components/private/Header";

export interface DetailContentProps {
    transporterId: string;
}

export default function Index() {


    return (
        <>
            <Header>
                <Breadcrumb className="hidden md:flex">
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink asChild>
                                <Link to="/">Dashboard</Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            Cargos
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </Header>

            <div className="space-y-2.5">
                <h3 className="text-2xl font-semibold leading-none tracking-tight">Cargos</h3>
            </div>

            <DataTable
                dataUrl="customers/create-cargo"
                searchKeys={[""]}
                columns={[
                    {
                        title: "ID",
                        key: "_id",
                    },
                    {
                        title: "City 1",
                        key: "city1",
                    },
                    {
                        title: "City 2",
                        key: "city2",
                    },
                    {
                        title: "Distance",
                        key: "km",
                        columnRender: (data: string) => {
                            return data + " KM";
                        }
                    },
                    {
                        title: "Price",
                        key: "price",
                        columnRender: (data: string) => {
                            return data + " TL";
                        }
                    },
                    {
                        title: "Desi",
                        key: "desi",
                    },
                ]}
            />
            <Outlet />
        </>

    )
}