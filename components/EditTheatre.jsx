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
import { Pencil, RefreshCw, TriangleAlert } from 'lucide-react'
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getEvents } from "@/store/slices/eventsSlice"
import { updateTheatre } from "@/store/slices/theatreSlice"
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert"


function EditTheatre({ theatreData, enableSeats, setEnableSeats }) {
    const dispatch = useDispatch()
    const { loading } = useSelector(state => state.theatres)
    const { events } = useSelector(state => state.events)
    const [theatre, setTheatre] = useState(theatreData)
    const [openDialog, setOpenDialog] = useState(false)


    const handleChange = (e) => {
        const { name, value } = e.target
        setTheatre({
            ...theatre,
            [name]: value
        })
    }

    const submitUpdateTheatre = () => {
        let hallSeats = []
        let updatedTheatre

        if (!enableSeats) {
            updatedTheatre = {
                _id: theatre._id,
                event: theatre.event,
                title: theatre.title,
            }
        } else {
            for (let i = 0; i < (theatre.columns * theatre.rows); i++) {
                hallSeats.push({
                    code: i + 1,
                    user: {},
                    is_active: false,
                    qr_code_link: `http:/localhost:3000/theatre/${i + 1}`
                })
            }

            setTheatre({
                ...theatre, seats: hallSeats
            })

            updatedTheatre = {
                ...theatre,
                seats: hallSeats
            }
        }

        dispatch(updateTheatre(updatedTheatre))
            .then(res => {
                if (!res.payload.status) setOpenDialog(false)
            })
    }

    useEffect(() => {
        dispatch(getEvents())
    }, [dispatch])

    useEffect(() => {
        return () => {
            setEnableSeats(false)
            setTheatre(theatreData)
        }
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
                    <DialogTitle>Update theatre information</DialogTitle>
                    <DialogDescription>
                        Edit the information of the event with a simple way.
                    </DialogDescription>
                    <Alert className="text-yellow-500 border-yellow-500">
                        <TriangleAlert className="h-4 w-4" color="#eab308" />
                        <AlertTitle>Warning</AlertTitle>
                        <AlertDescription>
                            If you change the numbers of columns and rows, all the users that assigned their seats will disappear and start over again.
                        </AlertDescription>
                        {
                            !enableSeats &&
                            <Button onClick={() => setEnableSeats(true)} className="mt-2 flex !px-4" variant="secondary">Change</Button>
                        }
                    </Alert>
                </DialogHeader>
                <div className=" gap-4 py-4">
                    <div className="flex flex-col gap-4">
                        <label>
                            <span className="block mb-1">Select the event you make this theatre for</span>
                            <Select onValueChange={value => setTheatre({ ...theatre, event: value })}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select an event" />
                                </SelectTrigger>
                                <SelectContent >
                                    <SelectGroup>
                                        <SelectLabel>Events</SelectLabel>
                                        {
                                            events.length > 0 &&
                                            events.map((event, index) => (
                                                <SelectItem key={index} value={event._id}>{event.title}</SelectItem>
                                            ))
                                        }
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </label>
                        <label>
                            <span className="block mb-1">Title</span>
                            <Input name="title" placeholder="e.g. Zagazig university conference hall" value={theatre.title} onChange={handleChange} />
                        </label>
                        {
                            enableSeats &&
                            <div className="flex items-start gap-2">
                                <label className="w-full">
                                    <span className="block mb-1">Columns</span>
                                    <Input name="columns" placeholder="Number of columns in the hall" value={theatre.columns} onChange={handleChange} />
                                </label>
                                <label className="w-full">
                                    <span className="block mb-1">Rows</span>
                                    <Input name="rows" placeholder="Number of rows in the hall" value={theatre.rows} onChange={handleChange} />
                                </label>
                            </div>
                        }
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit" onClick={submitUpdateTheatre} disabled={loading}>
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

export default EditTheatre