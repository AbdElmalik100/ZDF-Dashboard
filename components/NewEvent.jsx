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
import { createEvent } from "@/store/slices/eventsSlice"
import { Progress } from "@/components/ui/progress"
import { redirect } from "next/navigation"

function NewEvent({ btnText }) {
    const dispatch = useDispatch()
    const { errors, loading } = useSelector(state => state.events)
    const [openDialog, setOpenDialog] = useState(false)
    const [selectImage, setSelectImage] = useState({
        link: "",
        file: ""
    })
    const [event, setEvent] = useState({
        title: "",
        description: "",
        sessions: [""],
        venue: "",
        date: new Date(),
        time_from: "10:00",
        time_to: "16:00",
        ticket_price: "",
        image: ""
    })
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

    const submitEvnet = () => {
        dispatch(createEvent({ eventData: event, setProgress: setProgress }))
            .then(response => {
                if (!response.payload.status) {
                    setOpenDialog(false)
                    redirect(`/events/${response.payload._id}`)
                }
            })
    }


    const formatByte = new Intl.NumberFormat("en-US", {
        notation: "compact",
        style: "unit",
        unit: "byte",
        unitDisplay: "narrow",
    })

    useEffect(() => {
        return () => {
            setEvent({
                title: "",
                description: "",
                sessions: [""],
                venue: "",
                date: new Date(),
                time_from: "10:00",
                time_to: "16:00",
                ticket_price: "",
                image: ""
            })
            setSelectImage({
                link: null,
                file: null
            })
            setProgress(0)

        }
    }, [openDialog])

    return (
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
                <Button className="flex items-center">
                    <Plus className="mr-2" /> {btnText}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[750px] overflow-auto">
                <DialogHeader>
                    <DialogTitle>Create new event</DialogTitle>
                    <DialogDescription>
                        Make a new event for your users, Let it fire.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4 py-4">
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
                                                    <Trash size={18} className="text-rose-600 transition-all ease-in-out hover:text-rose-400 cursor-pointer" onClick={() => setSelectImage({ file: null, link: null })}></Trash>
                                            }
                                        </div>
                                        <Progress value={progress} className="mt-1"></Progress>
                                    </div>
                                </div>
                            </div>
                            :
                            <label className="img-placeholder cursor-pointer col-span-2 w-full h-full grid place-items-center p-4 py-12 border border-dashed rounded-lg">
                                <input className="hidden" type="file" accept="image/*" onChange={handleSelectImage} />
                                <div className="flex flex-col items-center ">
                                    <div className="p-3 mb-3 bg-primary shadow-md text-white grid place-items-center rounded-full">
                                        <ImageUp size={32} />
                                    </div>
                                    <span className="font-bold block">
                                        Drag & drop your image here, or <span className="text-primary hover:underline">browse</span>
                                    </span>
                                    <span className="text-neutral-400 text-xs font-light">Accepts only (PNG, JPG, JPEG)</span>
                                </div>
                            </label>
                    }
                    <div className="flex flex-col gap-4">
                        <label>
                            <span className="block mb-1">Event title</span>
                            <Input name="title" placeholder="e.g. Z Dental Forum" className={errors.title ? 'border-rose-500' : ''} value={event.title} onChange={handleChange} />
                            {
                                errors.title &&
                                <span className="text-rose-500 italic text-xs">{errors.title.msg}</span>
                            }
                        </label>
                        <label>
                            <span className="block mb-1">Event description</span>
                            <Textarea name="description" placeholder="Event description" className={errors.description ? 'border-rose-500' : ''} rows={5} value={event.description} onChange={handleChange} />
                            {
                                errors.description &&
                                <span className="text-rose-500 italic text-xs">{errors.description.msg}</span>
                            }
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
                            <Input name="venue" placeholder="e.g. Zagazig university" className={errors.venue ? 'border-rose-500' : ''} value={event.venue} onChange={handleChange} />
                            {
                                errors.venue &&
                                <span className="text-rose-500 italic text-xs">{errors.venue.msg}</span>
                            }
                        </label>
                        <label>
                            <span className="block mb-1">Event date</span>
                            <DatePicker event={event} setEvent={setEvent}></DatePicker>
                            {
                                errors.date &&
                                <span className="text-rose-500 italic text-xs">{errors.date.msg}</span>
                            }
                        </label>
                        <div className="flex items-start gap-2">
                            <label className="w-full">
                                <span className="block mb-1">Time from</span>
                                <input type="time" name="time_from" className={`rounded-lg w-full border p-1 px-3 ${errors.time_from ? 'border-rose-500' : ''}`} value={event.time_from} onChange={handleChange} />
                                {
                                    errors.time_from &&
                                    <span className="text-rose-500 italic text-xs">{errors.time_from.msg}</span>
                                }
                            </label>
                            <label className="w-full">
                                <span className="block mb-1">Time to</span>
                                <input type="time" name="time_to" className={`rounded-lg w-full border p-1 px-3 ${errors.time_to ? 'border-rose-500' : ''}`} value={event.time_to} onChange={handleChange} />
                                {
                                    errors.time_to &&
                                    <span className="text-rose-500 italic text-xs">{errors.time_to.msg}</span>
                                }
                            </label>
                        </div>
                        <label>
                            <span className="block mb-1">Ticket price</span>
                            <Input type="number" name="ticket_price" placeholder="e.g. 100" className={errors.ticket_price ? 'border-rose-500' : ''} value={event.ticket_price} onChange={handleChange} />
                            {
                                errors.ticket_price &&
                                <span className="text-rose-500 italic text-xs">{errors.ticket_price.msg}</span>
                            }
                        </label>
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit" onClick={submitEvnet} disabled={loading}>
                        {
                            loading ?
                                <>
                                    <RefreshCw className="me-2 animate-spin" size={18} />
                                    Creating...
                                </>
                                :
                                "Create event"
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

export default NewEvent