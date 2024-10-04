import { Armchair, CalendarCheck, EllipsisVertical, Pencil, Trash2 } from 'lucide-react'
import Link from 'next/link'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogTrigger } from './ui/dialog'
import {
    AlertDialog,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import DeleteTheatre from './DeleteTheatre'
import { useState } from 'react'
import EditTheatre from './EditTheatre'
import { useRouter } from 'next/navigation'


function TheatreCard({ theatre }) {
    const [openDialog, setOpenDialog] = useState(false)
    const [enableSeats, setEnableSeats] = useState(false)
    const router = useRouter()
    
    return (
        <div className="theatre-card relative flex flex-col rounded-xl p-5 gap-8 shadow-sm transition-all ease-in-out hover:shadow-lg border">
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
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
                                    <DropdownMenuItem className="text-rose-600 focus:bg-rose-100 focus:text-rose-600" >
                                        <Trash2 size={18} className='me-2' />
                                        Delete
                                    </DropdownMenuItem>
                                </AlertDialogTrigger>
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <DeleteTheatre theatre={theatre}></DeleteTheatre>
                </AlertDialog>
                <EditTheatre openDialog={openDialog} setOpenDialog={setOpenDialog} theatreData={theatre} enableSeats={enableSeats} setEnableSeats={setEnableSeats}></EditTheatre>
            </Dialog>
            <div className='flex items-center py-5 flex-col gap-2 justify-center text-center'>
                <div className="theatr-icon w-24 shadow-md h-24 grid place-items-center text-white mx-auto p-4 rounded-full bg-gradient-to-tr from-primary to-sky-700">
                    <img src="images/vip-card.png" alt="vip card" />
                </div>
                <span className='block font-bold text-sm capitalize hover:underline cursor-pointer' onClick={() => router.push(`/theatre/${theatre._id}`)}>{theatre.title}</span>
            </div>
            <div className='footer mt-auto flex items-center gap-3 justify-between border-t pt-3'>
                <div className='sears flex items-center gap-1'>
                    <Armchair size={18} />
                    <span className='font-bold text-sm'>{theatre.columns * theatre.rows}</span>
                </div>
                <div className='event flex items-center gap-1'>
                    <CalendarCheck size={18} />
                    <span className='font-bold text-sm'>{theatre.event?.title}</span>
                </div>
            </div>
        </div>
    )
}

export default TheatreCard
