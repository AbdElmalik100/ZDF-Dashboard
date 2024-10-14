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
import { RefreshCw, ImageUp, Trash, Pencil } from 'lucide-react'
import { Textarea } from "@/components/ui/textarea"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { updateWorkshop } from "@/store/slices/workshopsSlice"
import { Progress } from "@/components/ui/progress"
import { formatByte } from "@/lib/formatter"

function EditWorkshop({ workshopData }) {
    const dispatch = useDispatch()
    const [openDialog, setOpenDialog] = useState(false)
    const { loading } = useSelector(state => state.workshops)
    const [selectImage, setSelectImage] = useState({
        link: "",
        file: ""
    })
    const [workshop, setWorkshop] = useState({ ...workshopData })
    const [progress, setProgress] = useState(0)

    const handleChange = (e) => {
        const { name, value } = e.target
        setWorkshop({ ...workshop, [name]: value })
    }


    const handleSelectImage = (e) => {
        const inputFile = e.target.files[0]
        setSelectImage({
            ...selectImage,
            file: inputFile,
            link: URL.createObjectURL(inputFile),
        })
        setWorkshop({
            ...workshop,
            image: inputFile
        })
    }

    const deleteImage = () => {
        setSelectImage({ file: null, link: null })
        setWorkshop({
            ...workshop,
            image: workshopData.image
        })
    }

    const submitUpdate = () => {
        dispatch(updateWorkshop({ workshopData: workshop, setProgress: setProgress }))
            .then(res => {
                if (!res.payload.status) setOpenDialog(false)
            })
    }


    useEffect(() => {
        return () => {
            setSelectImage({
                file: "",
                link: "",
            })
            setProgress(0)
            setWorkshop({
                ...workshop,
                image: workshopData.image,
                date: new Date(workshop.date).toLocaleDateString("en-CA")
            })
        }
    }, [openDialog])

    return (
        <Dialog open={openDialog} onOpenChange={setOpenDialog} >
            <DialogTrigger asChild>
                <div className='flex items-center gap-2 transition-all ease-in-out hover:bg-neutral-100 text-neutral-950 p-1 px-2 rounded'>
                    <Pencil size={18} />
                    Edit
                </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[750px]">
                <DialogHeader>
                    <DialogTitle>Update workshop</DialogTitle>
                    <DialogDescription>
                        Update the information of the workshop with seamless.
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
                                                    <Trash size={18} className="text-rose-600 transition-all ease-in-out hover:text-rose-400 cursor-pointer" onClick={deleteImage}></Trash>
                                            }
                                        </div>
                                        <Progress value={progress} className="mt-1"></Progress>
                                    </div>
                                </div>
                            </div>
                            :
                            <label className="event-image group rounded-3xl overflow-hidden max-h-[200px] w-fit relative col-span-2 flex gap-2 cursor-pointer items-start justify-start">
                                <input id="image-file" onChange={handleSelectImage} type="file" accept="image/*" className="hidden" />
                                <img src={workshopData.image} className="w-48 object-cover object-[50%,10%]" alt="event image" />
                                <div className="overlay w-full h-full group-hover:opacity-100 opacity-0 transition-all ease-in-out left-0 top-0 absolute bg-black/75 grid place-items-center">
                                    <label htmlFor="image-file" className="p-1.5 flex-col text-xs bg-primary cursor-pointer rounded-lg transition-all ease-in-out flex items-center hover:bg-primary/90 text-white px-3">
                                        <ImageUp size={15} className="me-1" />
                                        Change image
                                    </label>
                                </div>
                            </label>
                    }
                    <div className="flex flex-col gap-4">
                        <label>
                            <span className="block mb-1">Workshop title</span>
                            <Input name="title" placeholder="e.g. Dental photography" value={workshop.title} onChange={handleChange} />
                        </label>
                        <label>
                            <span className="block mb-1">Workshop description</span>
                            <Textarea name="description" placeholder="Workshop description" rows={5} value={workshop.description} onChange={handleChange} />
                        </label>
                        <div>
                            <span className="block mb-1">Workshop lecturer</span>
                            <Input name="lecturer" placeholder="Lecturer name" value={workshop.lecturer} onChange={handleChange} />
                        </div>
                    </div>
                    <div className="flex flex-col gap-4">
                        <label>
                            <span className="block mb-1">Workshop location</span>
                            <Input name="location" placeholder="e.g. Nexus workspace" value={workshop.location} onChange={handleChange} />
                        </label>
                        <label>
                            <span className="block mb-1">Workshop date</span>
                            <input type="date" name="date" className="p-1 px-3 rounded-md border w-full" value={workshop.date} onChange={handleChange} />
                        </label>
                        <div className="flex items-start gap-2">
                            <label className="w-full">
                                <span className="block mb-1">Time from</span>
                                <input type="time" name="time_from" className="rounded-lg w-full border p-1 px-3" value={workshop.time_from} onChange={handleChange} />
                            </label>
                            <label className="w-full">
                                <span className="block mb-1">Time to</span>
                                <input type="time" name="time_to" className="rounded-lg w-full border p-1 px-3" value={workshop.time_to} onChange={handleChange} />
                            </label>
                        </div>
                        <label>
                            <span className="block mb-1">Discount</span>
                            <Input type="number" name="discount" placeholder="e.g. 5%" value={workshop.discount} onChange={handleChange} />
                        </label>
                        <label>
                            <span className="block mb-1">Price</span>
                            <Input type="number" name="price" placeholder="e.g. 800" value={workshop.price} onChange={handleChange} />
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
            </DialogContent>
        </Dialog>
    )
}

export default EditWorkshop