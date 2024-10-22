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
import { Plus, RefreshCw, ImageUp, Trash, X } from 'lucide-react'
import { Textarea } from "@/components/ui/textarea"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Progress } from "@/components/ui/progress"
import { useRouter } from "next/navigation"
import { formatByte } from "@/lib/formatter"
import { createBundle } from "@/store/slices/bundlesSlice"
import { getWorkshops } from "@/store/slices/workshopsSlice"

function NewBundle({ btnText }) {
    const dispatch = useDispatch()
    const { loading } = useSelector(state => state.workshops)
    const [openDialog, setOpenDialog] = useState(false)
    const router = useRouter()
    const { workshops } = useSelector(state => state.workshops)
    const [selectImage, setSelectImage] = useState({
        link: "",
        file: ""
    })
    const [bundle, setBundle] = useState({
        image: "",
        title: "",
        description: "",
        workshops: [],
        limit: "",
        price: "",
    })
    const [progress, setProgress] = useState(0)
    const [openSelect, setOpenSelect] = useState(false)


    const handleSelection = (workshop) => {
        const bundleWorkshops = [...bundle.workshops]
        bundleWorkshops.push(workshop)
        setBundle({...bundle, workshops: bundleWorkshops})
    }
    const deleteWorkshop = (workshopId) => {
        const bundleWorkshops = bundle.workshops.filter(workshop => workshop._id !== workshopId)        
        setBundle({...bundle, workshops: bundleWorkshops})
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setBundle({ ...bundle, [name]: value })
    }

    const handleSelectImage = (e) => {
        const inputFile = e.target.files[0]
        setSelectImage({
            ...selectImage,
            file: inputFile,
            link: URL.createObjectURL(inputFile),
        })
        setBundle({
            ...bundle,
            image: inputFile
        })
    }

    const submitBundle = () => {
        const bundleFormation = { ...bundle, workshops: bundle.workshops.map(el => el._id) }
        
        dispatch(createBundle({ bundleData: bundleFormation, setProgress: setProgress }))
            .then(response => {
                if (!response.payload.status) {
                    setOpenDialog(false)
                    router.push(`/bundles/${response.payload._id}`)
                }
            })
    }

    useEffect(() => {
        dispatch(getWorkshops())
    }, [dispatch])

    useEffect(() => {
        return () => {
            setBundle({
                image: "",
                title: "",
                description: "",
                workshops: [],
                limit: "",
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
                    <DialogTitle>Create new bundle</DialogTitle>
                    <DialogDescription>
                        Make a new bundle of workshops with great offers for your users, Make it easy for them.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-1 gap-4 py-4">
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
                            <span className="block mb-1">Bundle title</span>
                            <Input name="title" placeholder="e.g. ZDF package" value={bundle.title} onChange={handleChange} />
                        </label>
                        <label>
                            <span className="block mb-1">Bundle workshops</span>
                            <div className="select-multiple rounded-lg border flex items-center gap-2 relative hover:border-black p-2 px-3" onClick={() => setOpenSelect(prev => !prev)}>
                                {
                                    bundle.workshops.length > 0 
                                        ?
                                        <div className="flex flex-wrap text-xs gap-1">
                                            {
                                                bundle.workshops.map((workshop, index) => (
                                                    <span key={index} className="p-1 px-2 rounded-full border capitalize flex items-center gap-1">
                                                        {workshop.title}
                                                        <X size={12} className="cursor-pointer" onClick={() => deleteWorkshop(workshop._id)}></X>
                                                    </span>
                                                ))
                                            }
                                        </div>
                                        :
                                        <span className="text-sm text-neutral-500">Select workshops</span>
                                }
                                {
                                    openSelect &&
                                    <div className="menu bg-white shadow-md rounded-lg p-1 absolute flex flex-col gap-1 border left-0 top-11 w-full h-[150px] overflow-auto">
                                        {
                                            
                                            workshops.map((workshop, index) => (
                                                <span key={index} onClick={() => handleSelection(workshop)} className="p-1.5 px-2 cursor-pointer rounded text-sm hover:bg-neutral-100 capitalize">{workshop.title}</span>
                                            ))
                                        }
                                    </div>
                                }
                            </div>
                        </label>
                        <label>
                            <span className="block mb-1">Bundle description</span>
                            <Textarea name="description" placeholder="Bundle description" rows={3} value={bundle.description} onChange={handleChange} />
                        </label>
                        <label>
                            <span className="block mb-1">Bundle limit</span>
                            <Input type="number" name="limit" placeholder="e.g. 25" value={bundle.limit} onChange={handleChange} />
                        </label>
                        <label>
                            <span className="block mb-1">Price</span>
                            <Input type="number" name="price" placeholder="e.g. 800" value={bundle.price} onChange={handleChange} />
                        </label>
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit" onClick={submitBundle} disabled={loading}>
                        {
                            loading ?
                                <>
                                    <RefreshCw className="me-2 animate-spin" size={18} />
                                    Creating...
                                </>
                                :
                                "Create bundle"
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

export default NewBundle