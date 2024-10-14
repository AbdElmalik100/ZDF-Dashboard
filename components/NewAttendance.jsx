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
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Plus, RefreshCw } from 'lucide-react'
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getEvents } from "@/store/slices/eventsSlice"
import { useRouter } from "next/navigation"
import { getBundles } from "@/store/slices/bundlesSlice"
import { getWorkshops } from "@/store/slices/workshopsSlice"
import { createAttendance } from "@/store/slices/attendancesSlice"


function NewAttendance({ btnText }) {
    const dispatch = useDispatch()
    const router = useRouter()
    const { loading } = useSelector(state => state.theatres)
    const { events } = useSelector(state => state.events)
    const { workshops } = useSelector(state => state.workshops)
    const { bundles } = useSelector(state => state.bundles)
    const [openDialog, setOpenDialog] = useState(false)
    const [type, setType] = useState("")

    const [attendance, setAttendance] = useState({
        created_at: new Date().toLocaleDateString("en-CA"),
        title: ""
    })

    const handleChange = (e) => {
        const { name, value } = e.target
        setAttendance({
            ...attendance,
            [name]: value
        })
    }

    const handleTypeSelection = (value) => {
        switch (type) {
            case 'event':
                setAttendance({...attendance, event: value})
                break;
            case 'workshop':
                setAttendance({...attendance, workshop: value})
                break;
            case 'bundle':
                setAttendance({...attendance, bundle: value})
                break;
            default:
                break;
        }
    }

    const submitAttendance = () => { 
        dispatch(createAttendance(attendance))
            .then(response => {
                if (!response.payload.status) {
                    setOpenDialog(false)
                    router.push(`/attendances/${response.payload._id}`)
                }
            })
    }

    useEffect(() => {
        switch (type) {
            case "event":
                dispatch(getEvents())
                break;
            case "workshop":
                dispatch(getWorkshops())
                break;
            case "bundle":
                dispatch(getBundles())
                break;
            default:
                break;
        }
    }, [dispatch, type])
    useEffect(() => {
        setAttendance({
            title: "",
            created_at: new Date().toLocaleDateString("en-CA")
        })
    }, [openDialog])


    return (
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
                <Button className="flex items-center">
                    <Plus className="mr-2" /> {btnText}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px] overflow-auto">
                <DialogHeader>
                    <DialogTitle>Create new attendance table</DialogTitle>
                    <DialogDescription>
                        Generate a table of users for the subscription of events, workshops, or bundles. Make it easy and simple.
                    </DialogDescription>
                </DialogHeader>
                <div className=" gap-4 py-4">
                    <div className="flex flex-col gap-4">
                        <label>
                            <span className="block mb-1">Select service type you make this table for</span>
                            <Select onValueChange={value => setType(value)}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select a service type" />
                                </SelectTrigger>
                                <SelectContent >
                                    <SelectGroup>
                                        <SelectLabel>Service type</SelectLabel>
                                        <SelectItem value="event">Event</SelectItem>
                                        <SelectItem value="workshop">Workshop</SelectItem>
                                        <SelectItem value="bundle">Bundle</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </label>
                        <label>
                            <span className="block mb-1">Select service</span>
                            <Select onValueChange={value => handleTypeSelection(value)}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select a service" />
                                </SelectTrigger>
                                <SelectContent >
                                    <SelectGroup>
                                        <SelectLabel>Service</SelectLabel>
                                        
                                        {
                                            type === 'event'
                                                ?
                                                events.map((event, index) => <SelectItem key={index} value={event._id}>{event.title}</SelectItem>)
                                                :
                                                type === 'workshop'
                                                    ?
                                                    workshops.map((workshop, index) => <SelectItem key={index} value={workshop._id}>{workshop.title}</SelectItem>)
                                                    :
                                                    bundles.map((bundle, index) => <SelectItem key={index} value={bundle._id}>{bundle.title}</SelectItem>)
                                        }
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </label>
                        <label>
                            <span className="block mb-1">Title</span>
                            <Input name="title" placeholder="e.g. ZDF event table" value={attendance.title} onChange={handleChange} />
                        </label>
                        <label>
                            <span className="block mb-1">Date</span>
                            <input type="date" name="created_at" className="p-1 px-3 rounded-md border w-full" value={attendance.created_at} onChange={handleChange} />
                        </label>
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit" onClick={submitAttendance} disabled={loading}>
                        {
                            loading ?
                                <>
                                    <RefreshCw className="me-2 animate-spin" size={18} />
                                    Creating...
                                </>
                                :
                                "Create table"
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

export default NewAttendance