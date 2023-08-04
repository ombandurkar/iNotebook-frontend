import React, { useContext, useEffect, useRef, useState } from 'react'  //useRef means ksii bhi ek item ko app reference de sakte ho
import noteContext from '../context/notes/noteContext'
import Noteitem from './Noteitem'
import AddNote from './AddNote'
import {useNavigate} from 'react-router-dom';

const Notes = (props) => {
    const navigate = useNavigate();

    const context = useContext(noteContext)
    const { notes, getNotes, editNote } = context  //ye hum destructing ka rahe hai, bas notes laa rahe hai setNote nahi laa rahe, saare kaam NoteState me karege, usme alg algfunctions ke zariye

    useEffect(() => {
        if(localStorage.getItem('token')){  //agr user logged in hoga, i.e authtoken hoga to hee usko nites dikhao varna redirect him to get logged in first
            getNotes();
        }
        else{
            navigate("/login")
        }
        // eslint-disable-next-line
    }, [])

    const ref = useRef(null);
    const refClose = useRef(null);

    const [note, setNote] = useState({ id: "", etitle: "", edescription: "", etag: "default" });

    const updateNote = (currentNote) => {
        ref.current.click();
        setNote({id: currentNote._id ,etitle: currentNote.title , edescription: currentNote.description, etag: currentNote.tag})
    }
    
    
    
    const handleClick = (e) => {
        // console.log('updating the note as: ' , note);
        editNote(note.id , note.etitle , note.edescription, note.etag);  //ye edit note hum context ke through laa rahe hai, editNote ka function is present in NoteState.js file
        refClose.current.click();
        e.preventDefault();  //taaki page reload naa ho
        props.showAlert("Note updated successfully" , "success")
    }

    const onChange = (e) => {
        setNote({ ...note, [e.target.name]: e.target.value })
    }


    return (
        <>
            <AddNote showAlert = {props.showAlert}/>

            <button ref={ref} type="button" className="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#exampleModal">
                Launch demo modal
            </button>

            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Edit note</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            {/* update note ka form */}
                            <form className='my-3'>
                                <div className="mb-3">
                                    <label htmlFor="title" className="form-label">Title</label>
                                    <input type="text" className="form-control" id="etitle" value={note.etitle} name="etitle" aria-describedby="emailHelp" onChange={onChange} minLength={5} required/>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="description" className="form-label">Description</label>
                                    <input type="text" className="form-control" id="edescription" value={note.edescription}name="edescription" onChange={onChange} minLength={5} required/>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="tag" className="form-label">Tag</label>
                                    <input type="text" className="form-control" id="etag" value={note.etag} name="etag" onChange={onChange}/>
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button ref={refClose} type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button disabled={note.etitle.length<5 || note.edescription.length<5} onClick={handleClick} type="button" className="btn btn-primary">Update note</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row my-3">
                <h2>Your note</h2>
                <div className="container">
                    {notes.length === 0 && 'No Notes to display'}
                    {/* //jab hamare paas ele me kuch nahi hota hai in terniary operator tab hum && ye laga dete hai */}
                </div>
                {notes.forEach((note) => {
                    return <Noteitem key={note._id} updateNote={updateNote} showAlert={props.showAlert} note={note} />
                })} 
            </div>
        </>
    )
}

export default Notes
