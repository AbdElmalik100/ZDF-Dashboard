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
import { Plus, Trash2, RefreshCw, ImageUp, Trash } from 'lucide-react'
import { Textarea } from "@/components/ui/textarea"
import DatePicker from "./DatePicker"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { createEvent, updateEvent } from "@/store/slices/eventsSlice"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "./ui/scroll-area"


function EditEvent({ eventData, openUpdate, setOpenUpdate }) {
    const dispatch = useDispatch()
    const { loading } = useSelector(state => state.events)
    const [selectImage, setSelectImage] = useState({
        link: "",
        file: ""
    })
    const [event, setEvent] = useState({ ...eventData })
    const [progress, setProgress] = useState(0)
    const handleChange = (e) => {
        const { name, value } = e.target
        setEvent({ ...event, [name]: value })
    }
    const handleSessions = (e) => {
        const { name, value } = e.target
        const newSessions = [...event.sessions]
        newSessions[name] = value
        setEvent({ ...event, sessions: newSessions })
    }
    const addSession = () => {
        const newSessions = [...event.sessions]
        newSessions.push("")
        setEvent({
            ...event,
            sessions: newSessions
        })
    }
    const removeSession = (index) => {
        setEvent({
            ...event,
            sessions: event.sessions.filter((sesssion, sessionIndex) => index !== sessionIndex)
        })
    }
    const handleSelectImage = (e) => {
        const inputFile = e.target.files[0]
        setSelectImage({
            ...selectImage,
            file: inputFile,
            link: URL.createObjectURL(inputFile),
        })
        setEvent({
            ...event,
            image: inputFile
        })
    }
    const deleteImage = () => {
        setSelectImage({ file: null, link: null })
        setEvent({
            ...event,
            image: eventData.image
        })
    }
    const formatByte = new Intl.NumberFormat("en-US", {
        notation: "compact",
        style: "unit",
        unit: "byte",
        unitDisplay: "narrow",
    })

    const submitUpdate = () => {
        dispatch(updateEvent({ eventData: event, setProgress: setProgress }))
            .then(res => {
                if (!res.payload.status) setOpenUpdate(false)
            })
    }

    useEffect(() => {
        return () => {
            setSelectImage({
                file: "",
                link: "",
            })
            setProgress(0)
            setEvent({
                ...event,
                image: eventData.image
            })
        }
    }, [openUpdate])
    return (
        <DialogContent className="sm:max-w-[950px] p-2">
            <ScrollArea className="h-[750px] w-full p-5">
                <DialogHeader>
                    <DialogTitle>Update event information</DialogTitle>
                    <DialogDescription>
                        Update the information of the event with seamless.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4 py-4 px-1">
                    {
                        selectImage.file
                            ?
                            <div className="event-image col-span-2 ">
                                <div className="selected-image w-full h-full flex items-start justify-between gap-3">
                                    <img className="w-20 h-20 object-cover rounded-xl" src={selectImage.link} alt="uploaded image" />
                                    <div className="flex items-start flex-col flex-1 h-full">
                                        <div className="info flex flex-col gap-1 text-xs h-full">
                                            <span >{selectImage.file?.name}</span>
                                            <span className="font-bold">{formatByte.format(selectImage.file?.size)}</span>
                                        </div>
                                        <div className="flex items-center justify-between gap-3 w-full">
                                            <span className="text-sm percentage">{progress}%</span>
                                            {
                                                loading
                                                    ?
                                                    <RefreshCw className="me-2 animate-spin" size={18} />
                                                    :
                                                    <Trash size={18} className="text-rose-600 transition-all ease-in-out hover:text-rose-400 cursor-pointer" onClick={deleteImage}></Trash>
                                            }
                                        </div>
                                        <Progress value={progress} className="mt-1"></Progress>
                                    </div>
                                </div>
                            </div>
                            :
                            <label className="event-image group overflow-hidden rounded-3xl relative col-span-2 flex gap-2 cursor-pointer items-start justify-start">
                                <input id="image-file" onChange={handleSelectImage} type="file" accept="image/*" className="hidden" />
                                <img src={event.image} className="w-full max-h-[450px] object-cover" alt="event image" />
                                <div className="overlay w-full h-full group-hover:opacity-100 opacity-0 transition-all ease-in-out left-0 top-0 absolute bg-black/75 grid place-items-center">
                                    <label htmlFor="image-file" className="p-1.5 bg-primary cursor-pointer rounded-lg transition-all ease-in-out flex items-center hover:bg-primary/90 text-white px-3">
                                        <ImageUp size={18} className="me-1" />
                                        Change image
                                    </label>
                                </div>
                            </label>
                    }
                    <div className="flex flex-col gap-4">
                        <label>
                            <span className="block mb-1">Event title</span>
                            <Input name="title" placeholder="e.g. Z Dental Forum" value={event.title} onChange={handleChange} />
                        </label>
                        <label>
                            <span className="block mb-1">Event description</span>
                            <Textarea name="description" placeholder="Event description" rows={5} value={event.description} onChange={handleChange} />
                        </label>
                        <div>
                            <span className="block mb-1">Event sessions</span>
                            <div className="flex flex-col gap-2 max-h-[225px] overflow-auto p-1">
                                {
                                    event.sessions.map((session, index) => (
                                        <div className="flex gap-2" key={index}>
                                            <Input name={index} placeholder="e.g. dental photography" value={session} onChange={handleSessions} />
                                            {
                                                index > 0 &&
                                                <Button variant="destructive" onClick={() => removeSession(index)}>
                                                    <Trash2 size={18}></Trash2>
                                                </Button>
                                            }
                                        </div>
                                    ))
                                }
                            </div>
                            <Button className="mt-4" onClick={addSession}>
                                <Plus size={18} className="me-2"></Plus>
                                Add session
                            </Button>
                        </div>
                    </div>
                    <div className="flex flex-col gap-4">
                        <label>
                            <span className="block mb-1">Event venue</span>
                            <Input name="venue" placeholder="e.g. Zagazig university" value={event.venue} onChange={handleChange} />
                        </label>
                        <label>
                            <span className="block mb-1">Event date</span>
                            <DatePicker event={event} setEvent={setEvent}></DatePicker>
                        </label>
                        <div className="flex items-start gap-2">
                            <label className="w-full">
                                <span className="block mb-1">Time from</span>
                                <input type="time" name="time_from" className="rounded-lg w-full border p-1 px-3" value={event.time_from} onChange={handleChange} />
                            </label>
                            <label className="w-full">
                                <span className="block mb-1">Time to</span>
                                <input type="time" name="time_to" className="rounded-lg w-full border p-1 px-3" value={event.time_to} onChange={handleChange} />
                            </label>
                        </div>
                        <label>
                            <span className="block mb-1">Ticket price</span>
                            <Input type="number" name="ticket_price" placeholder="e.g. 100" value={event.ticket_price} onChange={handleChange} />
                        </label>
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit" onClick={submitUpdate} disabled={loading}>
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
            </ScrollArea>
        </DialogContent>
    )
}

export default EditEvent