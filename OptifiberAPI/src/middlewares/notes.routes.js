import { Router } from 'express';
import { newDocument, allNotes, viewOneNote, allClientNotes, editNote, deleteNote } from '../controller/notes.controller.js';
import { protectRoute, getProfile } from '../controller/auth.controller.js';

const notesRoutes = Router();

notesRoutes.post('/new/:id', protectRoute, getProfile, newDocument);
notesRoutes.get('/all', protectRoute, getProfile, allNotes);
notesRoutes.get('/view/:id', protectRoute, getProfile, viewOneNote);
notesRoutes.get('/all/:id', protectRoute, getProfile, allClientNotes);
notesRoutes.post('/edit/:id', protectRoute, getProfile, editNote);
notesRoutes.delete('/delete/:id', protectRoute, getProfile, deleteNote);

export default notesRoutes;