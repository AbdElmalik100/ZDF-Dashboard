import React from 'react'
import { Badge } from './ui/badge'
import Link from 'next/link'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { EllipsisVertical } from 'lucide-react'
import { Button } from './ui/button'
import { formatCurrency } from '@/utils/formatter'
import EditWorkshop from './EditWorkshop'
import DeleteService from './DeleteService'



function WorkshopCard({ workshop }) {
    return (
        <div className='workshop-card relative flex flex-col rounded-3xl p-4 shadow-sm transition-all ease-in-out hover:shadow-lg border'>
            <div className="image h-[350px] relative">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="absolute p-1 px-2 w-fit top-2 right-2">
                            <EllipsisVertical size={18}></EllipsisVertical>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                        <DropdownMenuGroup>
                            <EditWorkshop workshopData={workshop}></EditWorkshop>
                            <DeleteService service={workshop} type={"workshop"}></DeleteService>
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
                <img src={workshop.image} className='object-cover object-[50%,30%] w-full h-full rounded-2xl' alt="Workshop image" />
                <Badge className={`absolute top-2 left-2 shadow-md flex rounded-full items-center gap-1 ${workshop.is_available ? "bg-green-50 text-green-500 hover:bg-green-50" : "bg-rose-50 hover:bg-rose-50 text-rose-500"}`}>
                    <span className={`dot w-1 h-1 block rounded-full ${workshop.is_available ? 'bg-green-500' : 'bg-rose-500'}`}></span>
                    {workshop.is_available ? "Aavailable" : "Unavailable"}
                </Badge>
                {
                    workshop.discount > 0 &&
                    <Badge className={`absolute top-9 left-2 shadow-md flex rounded-full items-center gap-1 hover:bg-rose-500 bg-rose-500 text-white`}>
                        Discount -{workshop.discount}%
                    </Badge>
                }
            </div>
            <div className='info flex flex-col mt-5'>
                <span className='block mb-2 text-xs text-neutral-400 font-medium'>{workshop.lecturer}</span>
                <Link href={`/workshops/${workshop._id}`} className='workshop-title text-xl font-bold capitalize hover:underline'>{workshop.title}</Link>

                <div className='flex items-center gap-2 mt-2'>
                    <span className='price text-base font-bold'>
                        {formatCurrency.format(workshop.price - ((workshop.price * workshop.discount) / 100))}
                    </span>
                    {
                        workshop.discount > 0 && <span className='mt-2 text-xs line-through text-neutral-400'>{formatCurrency.format(workshop.price)}</span>
                    }
                </div>
            </div>
        </div>
    )
}

export default WorkshopCard