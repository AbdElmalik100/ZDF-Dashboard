import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { EllipsisVertical } from 'lucide-react'
import moment from 'moment'
import EditEvent from './EditEvent'
import { formatCurrency } from '@/utils/formatter'
import { Badge } from './ui/badge'
import Link from 'next/link'
import DeleteService from "./DeleteService"

function EventCard({ event }) {
    return (
        <div className="event-card relative border shadow-md p-4 rounded-2xl flex items-stretch gap-3 transition-all ease-in-out hover:shadow-lg cursor-pointer">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="absolute p-1 px-2 w-fit top-2 right-2">
                        <EllipsisVertical size={18}></EllipsisVertical>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                    <DropdownMenuGroup>
                        <EditEvent eventData={event}></EditEvent>
                        <DeleteService service={event} type={"event"}></DeleteService>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
            <Link href={`/events/${event._id}`} className="image h-full w-full relative">
                <img src={event.image} className='rounded-lg object-cover h-full' alt="Event Image" />
                <Badge className={`absolute top-2 left-2 shadow-md flex rounded-full items-center gap-1 ${event.is_available ? "bg-green-50 text-green-500 hover:bg-green-50" : "bg-rose-50 hover:bg-rose-50 text-rose-500"}`}>
                    <span className={`dot w-1 h-1 block rounded-full ${event.is_available ? 'bg-green-500' : 'bg-rose-500'}`}></span>
                    {event.is_available ? "Aavailable" : "Unavailable"}
                </Badge>
            </Link>
            <div className="info overflow-hidden flex flex-col h-full w-full">
                <Link href={`/events/${event._id}`} className='font-bold hover:underline capitalize'>{event.title}</Link>
                <p className='text-sm text-neutral-400 truncate'>
                    {event.description}
                </p>
                <div className='mt-10 flex text-xs flex-col gap-1'>
                    <span>{new Date(event.date).toLocaleDateString()}</span>
                    <span>
                        {moment(event.time_from, "HH:mm:ss").format("hh:mm A")} - {moment(event.time_to, "HH:mm:ss").format("hh:mm A")}
                    </span>
                    <span className='font-bold'>{formatCurrency.format(event.ticket_price)}</span>
                </div>
            </div>
        </div>
    )
}

export default EventCard