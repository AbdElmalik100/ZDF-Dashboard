import { Boxes, BriefcaseBusiness, EllipsisVertical, Sparkles, UsersRound } from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation'
import DeleteService from './DeleteService'
import EditAttendance from './EditAttendance'


function AttendanceCard({ attendance }) {
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
                        <EditAttendance attendanceData={attendance}></EditAttendance>
                        <DeleteService service={attendance} type={"attendance"}></DeleteService>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
            <div className='flex items-center py-5 flex-col gap-2 justify-center text-center'>
                <div className="theatr-icon w-24 shadow-md h-24 grid place-items-center text-white mx-auto p-4 rounded-full bg-gradient-to-tr from-primary to-sky-700">
                    <img src="images/cells.png" width={60} alt="Table" />
                </div>
                <span className='block font-bold text-sm capitalize hover:underline cursor-pointer' onClick={() => router.push(`/attendances/${attendance._id}`)}>{attendance.title}</span>
            </div>
            <div className='footer mt-auto flex items-center gap-3 justify-between border-t pt-3'>
                <div className='sears flex items-center gap-1'>
                    <UsersRound size={18} />
                    <span className='font-bold text-sm'>{attendance.users?.length || 0}</span>
                </div>
                <div className='event flex items-center gap-1 justify-end'>
                    
                    {
                        attendance.event &&
                        <>
                            <Sparkles size={18} />
                            <span className='font-bold text-sm capitalize'>{attendance.event?.title}</span>
                        </>
                    }
                    {
                        attendance.workshop &&
                        <>
                            <BriefcaseBusiness size={18} />
                            <span className='font-bold text-sm capitalize'>{attendance.workshop?.title}</span>
                        </>
                    }
                    {
                        attendance.bundle &&
                        <>
                            <Boxes size={18} />
                            <span className='font-bold text-sm capitalize'>{attendance.bundle?.title}</span>
                        </>
                    }
                </div>
            </div>
        </div>
    )
}

export default AttendanceCard
