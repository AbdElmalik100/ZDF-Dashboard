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
import { Plus, RefreshCw, ImageUp, Trash } from 'lucide-react'
import { Textarea } from "@/components/ui/textarea"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { createWorkshop } from "@/store/slices/workshopsSlice"
import { Progress } from "@/components/ui/progress"
import { useRouter } from "next/navigation"
import { formatByte } from "@/lib/formatter"

function NewWorkshop({ btnText }) {
    const dispatch = useDispatch()
    const { loading } = useSelector(state => state.workshops)
    const [openDialog, setOpenDialog] = useState(false)
    const router = useRouter()
    const [selectImage, setSelectImage] = useState({
        link: "",
        file: ""
    })
    const [workshop, setWorkshop] = useState({
        image: "",
        title: "",
        description: "",
        lecturer: "",
        location: "",
        date: new Date().toLocaleDateString("en-CA"),
        time_from: "13:00",
        time_to: "14:00",
        discount: "",
        price: "",
    })
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

    const submitWorkshop = () => {
        dispatch(createWorkshop({ workshopData: workshop, setProgress: setProgress }))
            .then(response => {
                if (!response.payload.status) {
                    setOpenDialog(false)
                    router.push(`/workshops/${response.payload._id}`)
                }
            })
    }



    useEffect(() => {
        return () => {
            setWorkshop({
                image: "",
                title: "",
                description: "",
                lecturer: "",
                location: "",
                date: new Date().toLocaleDateString("en-CA"),
                time_from: "13:00",
                time_to: "16:00",
                discount: "",
                price: "",
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
                    <DialogTitle>Create new workshop</DialogTitle>
                    <DialogDescription>
                        Make a new workshop for your users, Let&apos;s learn.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4 py-4">
                    {
                        selectImage.file
                            ?
                            <div className="workshop-image col-span-2 ">
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
                        <label>
                            <span className="block mb-1">Workshop location</span>
                            <Input name="location" placeholder="e.g. Nexus workspace" value={workshop.location} onChange={handleChange} />
                        </label>
                    </div>
                    <div className="flex flex-col gap-4">
                        <label>
                            <span className="block mb-1">Workshop date</span>
                            <input type="date" name="date" className="p-1 px-3 rounded-md border w-full" defaultValue={workshop.date} value={workshop.date} onChange={handleChange} />
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
                            <span className="block mb-1">Discount (%)</span>
                            <Input type="number" name="discount" placeholder="e.g. 5" value={workshop.discount} onChange={handleChange} />
                        </label>
                        <label>
                            <span className="block mb-1">Price</span>
                            <Input type="number" name="price" placeholder="e.g. 800" value={workshop.price} onChange={handleChange} />
                        </label>
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit" onClick={submitWorkshop} disabled={loading}>
                        {
                            loading ?
                                <>
                                    <RefreshCw className="me-2 animate-spin" size={18} />
                                    Creating...
                                </>
                                :
                                "Create workshop"
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

export default NewWorkshop