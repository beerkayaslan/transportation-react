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
import { Button } from "@/components/ui/button";
import { useDeleteTransporterFollow, usePostTransporterFollow } from "@/query-hooks/useTransporters";

export interface DetailContentProps {
    transporterId: string;
}

export default function Index() {

    const post = usePostTransporterFollow();
    const deleteFollow = useDeleteTransporterFollow();

    const followHandle = ({ transporterId }: { transporterId: string }) => {
        post.mutate({ transporterId });
    }

    const unFollowHandle = ({ transporterId }: { transporterId: string }) => {
        deleteFollow.mutate({ transporterId });
    }



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
                <h3 className="text-2xl font-semibold leading-none tracking-tight">Transporters</h3>
            </div>

            <DataTable
                dataUrl="customers/transporters"
                searchKeys={["name"]}
                columns={[
                    {
                        title: "Name",
                        key: "name",
                    },
                    {
                        title: "Email",
                        key: "email",
                    },
                    {
                        title: 'Followed',
                        key: 'followed',
                        columnRender: (row: any, allData: any) => {
                            return (
                                <div className="flex items-center gap-2">
                                    <span className="text-sm">
                                        {row ? <Button variant="outline" onClick={() => unFollowHandle({ transporterId: allData._id })}>Un Follow</Button> : <Button onClick={() => followHandle({ transporterId: allData._id })}>Follow</Button>}
                                    </span>
                                </div>
                            )
                        }
                    }
                ]}
                actions={false}
            />
            <Outlet />
        </>

    )
}