import { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { EllipsisVertical, Pencil, Trash2 } from 'lucide-react'
import moment from 'moment'
import {
    AlertDialog,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import DeleteEvent from './DeleteEvent'
import { Dialog, DialogTrigger } from './ui/dialog'
import EditEvent from './EditEvent'
import { formatCurrency } from '@/utils/formatter'
import { Badge } from './ui/badge'
import Link from 'next/link'

function EventCard({ event }) {
    const [openUpdate, setOpenUpdate] = useState(false)
    return (
        <div className="event-card relative border shadow-md p-4 rounded-2xl flex items-stretch gap-3 transition-all ease-in-out hover:shadow-lg cursor-pointer">
            <Dialog open={openUpdate} onOpenChange={setOpenUpdate}>
                <AlertDialog>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="absolute p-1 px-2 w-fit top-2 right-2">
                                <EllipsisVertical size={18}></EllipsisVertical>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56">
                            <DropdownMenuGroup>
                                <DialogTrigger asChild>
                                    <DropdownMenuItem>
                                        <Pencil size={18} className='me-2' />
                                        Edit
                                    </DropdownMenuItem>
                                </DialogTrigger>
                                <AlertDialogTrigger asChild>
                                    <DropdownMenuItem className="text-rose-600 focus:bg-rose-100 focus:text-rose-600">
                                        <Trash2 size={18} className='me-2' />
                                        Delete
                                    </DropdownMenuItem>
                                </AlertDialogTrigger>
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <DeleteEvent event={event}></DeleteEvent>
                </AlertDialog>
                <EditEvent openUpdate={openUpdate} setOpenUpdate={setOpenUpdate} eventData={event}></EditEvent>
            </Dialog>
            <Link href={`/events/${event._id}`} className="image h-full w-full relative">
                <img src={event.image} className='rounded-lg object-cover h-full' alt="Event Image" />
                <Badge className={`absolute top-2 left-2 shadow-md flex rounded-full items-center gap-1 ${event.is_available ? "bg-green-50 text-green-500 hover:bg-green-50" : "bg-rose-50 hover:bg-rose-50 text-rose-500"}`}>
                    <span className={`dot w-1 h-1 block rounded-full ${event.is_available ? 'bg-green-500' : 'bg-rose-500'}`}></span>
                    {event.is_available ? "Aavailable" : "Unavailable"}
                </Badge>
            </Link>
            <div className="info overflow-hidden flex flex-col h-full w-full">
                <Link href={`/events/${event._id}`} className='font-bold hover:underline'>{event.title}</Link>
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