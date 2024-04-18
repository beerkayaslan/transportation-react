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
                            App
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </Header>

            <div className="space-y-2.5">
                <h3 className="text-2xl font-semibold leading-none tracking-tight">Discount</h3>
            </div>

            <DataTable
                dataUrl="transporters/discounts"
                searchKeys={["name"]}
                columns={[
                    {
                        title: "Name",
                        key: "name",
                    },
                    {
                        title: "Percentage",
                        key: "percentage",
                    },
                    {
                        title: "Code",
                        key: "code",
                    },
                    {
                        title: "Start Date",
                        key: "startDate",
                    },
                    {
                        title: "End Date",
                        key: "endDate",
                    },
                ]}
            />
            <Outlet />
        </>

    )
}