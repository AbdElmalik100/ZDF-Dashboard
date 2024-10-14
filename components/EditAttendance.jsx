'use client'
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Pencil, RefreshCw } from 'lucide-react'
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { updateAttendance } from "@/store/slices/attendancesSlice"


function EditAttendance({ attendanceData }) {
    const dispatch = useDispatch()
    const { loading } = useSelector(state => state.attendances)
    const [openDialog, setOpenDialog] = useState(false)
    const [attendance, setAttendance] = useState(attendanceData)


    const handleChange = (e) => {
        const { name, value } = e.target
        setTheatre({
            ...theatre,
            [name]: value
        })
    }

    const submitUpdateAttendance = () => {

        dispatch(updateAttendance(attendance))
            .then(res => {
                if (!res.payload.status) setOpenDialog(false)
            })
    }

    useEffect(() => {
        setAttendance({...attendanceData, created_at: new Date(attendanceData.created_at).toLocaleDateString("en-CA")})
    }, [openDialog])

    return (
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
                <div className='flex items-center gap-2 transition-all ease-in-out hover:bg-neutral-100 text-neutral-950 p-1 px-2 rounded'>
                    <Pencil size={18} />
                    Edit
                </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px] overflow-auto">
                <DialogHeader>
                    <DialogTitle>Update attendance table information</DialogTitle>
                    <DialogDescription>
                        Edit the information of the attendance table with a simple way.
                    </DialogDescription>
                    
                </DialogHeader>
                <div className=" gap-4 py-4">
                    <div className="flex flex-col gap-4">
                        <label>
                            <span className="block mb-1">Title</span>
                            <Input name="title" placeholder="e.g. Zagazig university conference hall" value={attendance.title} onChange={handleChange} />
                        </label>
                        <label>
                            <span className="block mb-1">Date</span>
                            <input type="date" name="created_at" className="p-1 px-3 rounded-md border w-full" value={attendance.created_at} onChange={handleChange} />
                        </label>
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit" onClick={submitUpdateAttendance} disabled={loading}>
                        {
                            loading ?
                                <>
                                    <RefreshCw className="me-2 animate-spin" size={18} />
                                    Updating...
                                </>
                                :
                                "Save changes"
                        }
                    </Button>
                    <DialogClose>
                        <Button type="button" variant="secondary">
                            Close
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default EditAttendance