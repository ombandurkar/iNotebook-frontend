import React from 'react'
import { useState , useContext } from 'react'
import noteContext from '../context/notes/noteContext'

const AddNote = (props) => {
    const context = useContext(noteContext)
    const {addNote } = context  //ye hum destructing ka rahe hai, bas notes laa rahe hai setNote nahi laa rahe, saare kaam NoteState me karege, usme alg algfunctions ke zariye

    const [note , setNote] = useState({title: "" , description: "" , tag: ""});

    const handleClick = (e) =>{
        e.preventDefault();  //taaki page reload naa ho
        addNote(note.title , note.description, note.tag);

        //taaki ek baar jab hum vo update ka form bhar dee add notes waala, uske baad hamari fields clear hojaaaye
        setNote({title: "" , description: "" , tag: ""})
        props.showAlert("Note added successfully" , "success")
    }

    const onChange = (e) => {
        setNote({...note , [e.target.name]: e.target.value})
    }


    return (
        <div className="container my-3">
            <h2>Add Note</h2>
            <form className='my-3'>
                <div className="mb-3">
                    <label htmlFor="title" className="form-label">Title</label>
                    <input type="text" className="form-control" id="title" value={note.title} name="title" aria-describedby="emailHelp" onChange={onChange} minLength={5} required/>
                </div>
                <div className="mb-3">
                    <label htmlFor="description" className="form-label">Description</label>
                    <input type="text" className="form-control" id="description" value={note.description} name="description" onChange={onChange} minLength={5} required />
                </div>
                <div className="mb-3">
                    <label htmlFor="tag" className="form-label">Tag</label>
                    <input type="text" className="form-control" id="tag" value={note.tag} name="tag" onChange={onChange} />
                </div>
                <button disabled={note.title.length<5 || note.description.length<5} type="submit" className="btn btn-primary" onClick={handleClick}>Add  note</button>
            </form>
        </div>
    )
}

export default AddNote
