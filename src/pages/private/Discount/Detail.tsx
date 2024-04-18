import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { usePostDiscount } from "@/query-hooks/useDiscount";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, SubmitHandler } from 'react-hook-form';
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import useEnterKeyPress from "@/custom-hooks/useEnterKeyPress";
import { Loader2 } from "lucide-react";
import { Calendar as CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { format } from "date-fns"
export interface DetailContentProps {
    _id?: string;
    name: string;
    percentage: number;
    code: string;
    startDate: string;
    endDate: string;
}

export default function Detail() {
    const [isOpen, setIsOpen] = useState(true);
    const navigate = useNavigate();
    const post = usePostDiscount();
    const { toast } = useToast();

    const { register, handleSubmit, formState: { errors } } = useForm<DetailContentProps>();

    const [loading, setLoading] = useState(false);

    const [date, setDate] = useState<Date>()
    const [endDate, setEndDate] = useState<Date>()


    const handleOpenChange = (open: boolean) => {
        setIsOpen(open);
        setTimeout(() => {
            navigate("/");
        }, 300);
    }

    const onSubmit: SubmitHandler<DetailContentProps> = (formData) => {

        if (!date || !endDate) {
            toast({
                variant: "destructive",
                title: "Please select start and end date"
            });
            return;
        }


        setLoading(true);



        post.mutate({ ...formData, startDate: `${date?.getDate()}-${(date?.getMonth() ?? 0) + 1}-${date?.getFullYear()}`, endDate: `${endDate?.getDate()}-${(endDate?.getMonth() ?? 0) + 1}-${endDate?.getFullYear()}` }, {
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


    return (
        <Sheet open={isOpen} onOpenChange={handleOpenChange}>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Create Discount</SheetTitle>
                </SheetHeader>
                <div className="grid gap-4 py-4">
                    <div>
                        <Label htmlFor="name" className="text-right">
                            Name
                        </Label>
                        <Input
                            id="name"
                            className={cn("col-span-3 my-1", errors.name && "!border-red-500")}
                            {...register("name", {
                                required: "Name is required",
                                maxLength: 200,
                            })}
                        />
                        {errors.name && <p className="text-xs text-red-600">{errors.name.message}</p>}
                    </div>

                    <div>
                        <Label htmlFor="Percentage" className="text-right">
                            Percentage
                        </Label>
                        <Input
                            id="Percentage"
                            type="number"
                            className={cn("col-span-3 my-1", errors.percentage && "!border-red-500")}
                            {...register("percentage", {
                                required: "Percentage is required",
                                maxLength: {
                                    value: 2,
                                    message: "Percentage must not be more than 2 digits"
                                },
                                min: {
                                    value: 1,
                                    message: "Percentage must be at least 1"
                                },
                                max: {
                                    value: 99,
                                    message: "Percentage must not be more than 99"
                                }
                            })}

                        />
                        {errors.percentage && <p className="text-xs text-red-600">{errors.percentage.message}</p>}
                    </div>


                    <div>
                        <Label htmlFor="code" className="text-right">
                            Discount Code
                        </Label>
                        <Input
                            id="code"
                            className={cn("col-span-3 my-1", errors.code && "!border-red-500")}
                            {...register("code", {
                                required: "Code is required",
                                maxLength: 200,
                            })}
                        />
                        {errors.code && <p className="text-xs text-red-600">{errors.code.message}</p>}
                    </div>

                    <div>
                        <Label htmlFor="startDate" className="flex flex-1 mb-2">
                            Start Date
                        </Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-full justify-start text-left font-normal",
                                        !date && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={date}
                                    onSelect={setDate}
                                    initialFocus
                                    fromDate={new Date()}
                                />
                            </PopoverContent>
                        </Popover>
                        {errors.startDate && <p className="text-xs text-red-600">{errors.startDate.message}</p>}
                    </div>

                    <div>
                        <Label htmlFor="endDate" className="flex flex-1 mb-2">
                            End Date
                        </Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-full justify-start text-left font-normal",
                                        !endDate && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={endDate}
                                    onSelect={setEndDate}
                                    initialFocus
                                    fromDate={new Date()}
                                />
                            </PopoverContent>
                        </Popover>
                        {errors.endDate && <p className="text-xs text-red-600">{errors.endDate.message}</p>}
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


