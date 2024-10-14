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
import EditBundle from './EditBundle'
import DeleteService from './DeleteService'

function BundleCard({ bundle }) {    
    return (
        <div className='bundle-card relative flex flex-col rounded-3xl p-4 shadow-sm transition-all ease-in-out hover:shadow-lg border'>
            <div className="image h-[350px] relative">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="absolute p-1 px-2 w-fit top-2 right-2">
                            <EllipsisVertical size={18}></EllipsisVertical>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                        <DropdownMenuGroup>
                            <EditBundle bundleData={bundle}></EditBundle>
                            <DeleteService service={bundle} type={"bundle"}></DeleteService>
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>

                <img src={bundle.image} className='object-cover object-[50%,30%] w-full h-full rounded-2xl' alt="Bundle image" />
                <Badge className={`absolute top-2 left-2 shadow-md flex rounded-full items-center gap-1 ${bundle.is_available ? "bg-green-50 text-green-500 hover:bg-green-50" : "bg-rose-50 hover:bg-rose-50 text-rose-500"}`}>
                    <span className={`dot w-1 h-1 block rounded-full ${bundle.is_available ? 'bg-green-500' : 'bg-rose-500'}`}></span>
                    {bundle.is_available ? "Aavailable" : "Unavailable"}
                </Badge>
            </div>
            <div className='info flex flex-col mt-5'>
                <Link href={`/bundles/${bundle._id}`} className='bundle-title text-xl font-bold capitalize hover:underline'>{bundle.title}</Link>
                <span className='price text-base font-bold mt-1'>{formatCurrency.format(bundle.price)}</span>
            </div>
        </div>
    )
}

export default BundleCard