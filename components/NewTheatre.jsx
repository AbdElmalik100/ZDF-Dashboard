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
import { createTheatre } from "@/store/slices/theatreSlice"
import { useRouter } from "next/navigation"


function NewTheatre({ btnText }) {
    const dispatch = useDispatch()
    const router = useRouter()
    const { loading } = useSelector(state => state.theatres)
    const { events } = useSelector(state => state.events)
    const [openDialog, setOpenDialog] = useState(false)
    const [theatre, setTheatre] = useState({
        title: '',
        columns: "",
        rows: "",
        event: "",
        seats: []
    })
    const handleChange = (e) => {
        const { name, value } = e.target
        setTheatre({
            ...theatre,
            [name]: value
        })
    }

    const submitTheatre = () => {
        let hallSeats = []
        for (let i = 0; i < (theatre.columns * theatre.rows); i++) {
            hallSeats.push({
                code: i + 1,
                user: {},
                is_active: false,
                qr_code_link: `${process.env.NEXT_PUBLIC_ZDF_LINK}/theatre/${i + 1}`
            })
        }

        setTheatre({
            ...theatre, seats: hallSeats
        })

        const updatedTheatre = {
            ...theatre,
            seats: hallSeats
        }

        dispatch(createTheatre(updatedTheatre))
            .then(response => {
                if (!response.payload.status) {
                    setOpenDialog(false)
                    router.push(`/theatre/${response.payload._id}`)
                }
            })
    }

    useEffect(() => {
        dispatch(getEvents())
    }, [dispatch])


    return (
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
                <Button className="flex items-center">
                    <Plus className="mr-2" /> {btnText}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px] overflow-auto">
                <DialogHeader>
                    <DialogTitle>Create new theatre</DialogTitle>
                    <DialogDescription>
                        Generate a theatre for the hall of the event, make it easy and simple.
                    </DialogDescription>
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
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit" onClick={submitTheatre} disabled={loading}>
                        {
                            loading ?
                                <>
                                    <RefreshCw className="me-2 animate-spin" size={18} />
                                    Creating...
                                </>
                                :
                                "Create theatre"
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

export default NewTheatre