import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { useGetDiscountbyCode } from "@/query-hooks/useDiscount";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, SubmitHandler } from 'react-hook-form';
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import useEnterKeyPress from "@/custom-hooks/useEnterKeyPress";
import { Loader2 } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import cities from "./cities";
import { useDataTable } from "@/query-hooks/useDataTable";
import { usePostCargo } from "@/query-hooks/useCargos";


export interface DetailContentProps {
    _id?: string;
    city1: string;
    city2: string;
    transporterId: string;
    desi: string;
    code?: string;
    price: number;
    km: string;
}

export default function Detail() {
    const [isOpen, setIsOpen] = useState(true);
    const navigate = useNavigate();
    const getDiscount = useGetDiscountbyCode();
    const { toast } = useToast();

    const { handleSubmit, formState: { errors } } = useForm<DetailContentProps>();

    const [loading, setLoading] = useState(false);

    const [city1, setCity1] = useState("");
    const [city2, setCity2] = useState("");

    const usepostCargo = usePostCargo();

    const [distance, setDistance] = useState(0);
    const [desi, setDesi] = useState(0);
    const [discountCode, setDiscountCode] = useState("");

    const [discountPercentage, setDiscountPercentage] = useState(0);

    const [transporter, setTranspoter] = useState("");

    const desiPerPrice = 10;
    const kmPerPrice = 20;

    let price = desiPerPrice * desi + kmPerPrice * distance - (desiPerPrice * desi + kmPerPrice * distance) * discountPercentage / 100;


    const { data, isLoading } = useDataTable({ dataUrl: "customers/transporters", query: { page: 1, limit: 10, search: "", searchKeys: ["name"] } });

    const sendDiscountCodeHandle = () => {
        getDiscount.mutate({ discountCode, transporter }, {
            onSuccess: (data) => {
                setDiscountPercentage(Number(data.percentage || 0));
            }
        });
    }


    useEffect(() => {

        const city1Coordinates = cities.find(city => city.province === city1);
        const city2Coordinates = cities.find(city => city.province === city2);

        const x = (city1Coordinates?.coordinates.lon + "," + city1Coordinates?.coordinates.lat).trim();
        const y = (city2Coordinates?.coordinates.lon + "," + city2Coordinates?.coordinates.lat).trim();

        const url = `https://router.project-osrm.org/route/v1/driving/${x};${y}?overview=false`;

        if (city1Coordinates && city2Coordinates) {
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    const distanceInMeters = data.routes[0].distance;
                    const distanceInKilometers = distanceInMeters / 1000;
                    setDistance(Number(distanceInKilometers.toFixed(0)));
                });
        }


    }, [city1, city2]);


    const handleOpenChange = (open: boolean) => {
        setIsOpen(open);
        setTimeout(() => {
            navigate("/customers/create-cargo");
        }, 300);
    }

    const onSubmit: SubmitHandler<DetailContentProps> = () => {
        setLoading(true);

        usepostCargo.mutate({
            city1,
            city2,
            transporterId: transporter,
            desi: desi.toString(),
            code: discountCode,
            price,
            km: distance.toString()
        }, {
            onSuccess: () => {
                handleOpenChange(false);
                toast({
                    variant: "default",
                    className: "bg-green-500 text-white",
                    title: "Successfully updated the record",
                });
            },
            onError: (error) => {
                toast({
                    variant: "destructive",
                    title: error.message
                });
            },
            onSettled: () => {
                setLoading(false);
            }
        });

    }

    useEnterKeyPress('Enter', handleSubmit(onSubmit));


    const handleTranspoterValueChange = (e: string) => {
        setTranspoter(e);
    }

    return (
        <Sheet open={isOpen} onOpenChange={handleOpenChange}>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Create Cargo</SheetTitle>
                </SheetHeader>
                <div className="grid gap-4 py-4">
                    <div>
                        <Label htmlFor="name" className="text-right">
                            Start City
                        </Label>
                        <Select onValueChange={(e) => setCity1(e)}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select a city" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {
                                        cities.map((city) => (
                                            <SelectItem key={city.province} value={city.province}>{city.province}</SelectItem>
                                        ))
                                    }
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label htmlFor="name" className="text-right">
                            End City
                        </Label>
                        <Select onValueChange={(e) => setCity2(e)}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select a city" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {
                                        cities.map((city) => (
                                            <SelectItem key={city.province} value={city.province}>{city.province}</SelectItem>
                                        ))
                                    }
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>

                    {
                        distance > 0 &&
                        <div>
                            <Label htmlFor="name" className="text-right">
                                Distance
                            </Label>
                            <div>
                                {distance} KM
                            </div>
                        </div>
                    }

                    <div>
                        <Label htmlFor="name" className="text-right">
                            Desi
                        </Label>
                        <Input
                            id="Percentage"
                            type="number"
                            onChange={(e) => setDesi(Number(e.target.value))}
                            value={desi}


                        />
                        {errors.desi && <p className="text-xs text-red-600">{errors.desi.message}</p>}
                    </div>

                    <div>
                        <Label htmlFor="name" className="text-right mb-2">
                            Transporters
                        </Label>
                        {
                            !isLoading && <Select onValueChange={handleTranspoterValueChange}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select a Transporter" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {
                                            data && data.data.map((item: any) => <SelectItem key={item._id} value={item._id}>{item.name}</SelectItem>)
                                        }
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        }

                    </div>

                    <div>
                        <Label htmlFor="code" className="text-right">
                            Discount Code (Optional)
                        </Label>
                        <div className="flex items-center gap-x-2">
                            <Input
                                id="code"
                                className={cn("col-span-3 my-1", errors.code && "!border-red-500")}
                                onChange={(e) => setDiscountCode(e.target.value)}
                                value={discountCode}
                            />
                            <Button onClick={sendDiscountCodeHandle}>Use</Button>
                        </div>
                    </div>


                    <div>
                        <Label htmlFor="name" className="text-right">
                            Price
                        </Label>
                        <div>
                            <div>Discount - %{discountPercentage}</div>
                            <b>{price} TL</b>
                        </div>
                    </div>

                </div>
                <SheetFooter>
                    <Button onClick={handleSubmit(onSubmit)} disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}


