import { Armchair, CalendarCheck, EllipsisVertical } from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { useState } from 'react'
import EditTheatre from './EditTheatre'
import { useRouter } from 'next/navigation'
import DeleteService from './DeleteService'


function TheatreCard({ theatre }) {
    const [enableSeats, setEnableSeats] = useState(false)
    const router = useRouter()

    return (
        <div className="theatre-card relative flex flex-col rounded-xl p-5 gap-8 shadow-sm transition-all ease-in-out hover:shadow-lg border">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="absolute p-1 px-2 w-fit top-2 right-2">
                        <EllipsisVertical size={18}></EllipsisVertical>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                    <DropdownMenuGroup>
                        <EditTheatre theatreData={theatre} enableSeats={enableSeats} setEnableSeats={setEnableSeats}></EditTheatre>
                        <DeleteService service={theatre} type={"theatre"}></DeleteService>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
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
                    <span className='font-bold text-sm capitalize'>{theatre.event?.title}</span>
                </div>
            </div>
        </div>
    )
}

export default TheatreCard
