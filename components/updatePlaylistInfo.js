import { useState } from "react"
import { updateColorInformation } from "./supabase"

export default function UpdatePlaylistInfoForm({initialTitle, initialDescription, color, updateColorInfo, changeEdit}){


    const [title, setTitle] = useState(initialTitle)
    const [description, setDescription] = useState(initialDescription)

    function updateInfo(formData){
        const title = formData.get('title')
        const description = formData.get('description')
        console.log(title, description)
        console.log(color)
        updateColorInfo({colorName: title, description: description})
        updateColorInformation(title, description, color)
        changeEdit(false)

    }



    return (
        <div className = "colPage stpage">
        <form>
            <input id = "title" type = "text" name = "title" value = {title}
                onChange={(e) => setTitle(e.target.value)}
            ></input>
            <textarea id = "descriptionsmall" type = "text" name = "description" value = {description}
                 onChange={(e) => setDescription(e.target.value)}></textarea>
            <button formAction = {updateInfo}>Save</button>

        </form>
        </div>
    )
}