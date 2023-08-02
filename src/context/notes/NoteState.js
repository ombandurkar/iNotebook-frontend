//abhi hum yaha ek state banayege jo ki sabko available ho

// import { json } from 'react-router-dom';
import NoteContext from './noteContext'
import { useState } from 'react'


//React devta ne hume ek context banakar de diya hai NoteContext naam ka
//Ab react devta keh rahe hai ki jo tum ek function bana do and jo bhi tum provide karna chahte ho usko tum value= ke andr daal do aur ek .Provider ka syntax likh do, isse kya hoga ki jab bhi tum iss context ke andr kisi bhi chiz ko wrap karoge to jitte bhi componenets hai ye wrap me, vo saare componenets me tumhe iss context ke states accissble hojaayege

/************************************************************/
//ye code sirf samjhaane ko likha gaya hai ki context kaise use kar sakte hai hum

// const s1 = {
//     "name": "Om",
//     "class": "9A"
// }

// const [state , setState] = useState(s1);

// const update = () => {
//     setTimeout(() => {
//         setState({
//             "name": "Caryy",
//             "class": "10B"
//         })
//     }, 1000);
// }

// value={{state , update}}
/************************************************************/

const NoteState = (props) => {

    //****************paste here**************** */

    const host = "http://localhost:5000"

    const notesInitial = [];

    const [notes, setNotes] = useState(notesInitial);

    //Fetch all notes, DB connected succesfully
    const getNotes = async () => {  //hume bas yehi 2 chize chaiye baaki sab to apne aap aa hee jaayega, and user bhi aajayega as hum header token me hee bhej rahe to samjh jaayega ki konsa user hai

        //API Call
        const response = await fetch(`${host}/api/notes/fetchallnotes`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "auth-token": localStorage.getItem('token')
                // localStorage.getItem('token') //authentcation token jo hai apna vo apne local storga se aani wwaali hai, during login/signup hum ek auth token save kar rahe hai apne local storage par
            }
        });

        const json = await response.json();

        setNotes(json);
    }


    //Add a note
    const addNote = async (title, description, tag) => {  //hume bas yehi 2 chize chaiye baaki sab to apne aap aa hee jaayega, and user bhi aajayega as hum header token me hee bhej rahe to samjh jaayega ki konsa user hai

        //API Call
        const response = await fetch(`${host}/api/notes/addnotes`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "auth-token": localStorage.getItem('token')
            },
            body: JSON.stringify({ title, description, tag }), // body data type must match "Content-Type" header
        });

        const yeNoteDaalo = await response.json();
        // console.log("Added a new note");
        
        setNotes(notes.concat(yeNoteDaalo))   //push updates an array while concat returns it
    }

    //Delete a note
    const deleteNote = async (id) => {
        //API Call
        await fetch(`${host}/api/notes/deletenotes/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "auth-token": localStorage.getItem('token')
            }
        });

        // console.log("deleting the note with id: " + id);
        const newNotes = notes.filter((note) => { return note._id !== id })  //jin jin notes ki id ye waale given id ke barbaar nahi hai sirf unko hee shaamil karo
        setNotes(newNotes);
    }

    //Edit a note
    const editNote = async (id, title, description, tag) => {
        //API Call
        const response = await fetch(`${host}/api/notes/updatenotes/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "auth-token": localStorage.getItem('token')
            },
            body: JSON.stringify({ title, description, tag }), // body data type must match "Content-Type" header
        });

        // eslint-disable-next-line
        const json = await response.json();
        // console.log(json);
    
        getNotes() //fetch all notes after adding the new one

        // setNotes(notes)
    }

    return (
        <NoteContext.Provider value={{ notes, addNote, deleteNote, editNote, getNotes }}>
            {props.children}
        </NoteContext.Provider>
    )
}

export default NoteState;