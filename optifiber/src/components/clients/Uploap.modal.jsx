import styleFormModal from './css/uploadModal.module.css'

import { useEffect } from "react";

export function UploadDoc() {
    return (
        <div class="modal fade"
            id="uploadModal"
            tabindex="-1"
            aria-labelledby="staticBackdropLabel"
            aria-hidden="true"
            data-bs-backdrop="static"
            data-bs-keyboard="false" >

            <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="staticBackdropLabel">Modal title</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body d-flex justify-content-center">

                        <form className={styleFormModal['form']}>
                            <span className={styleFormModal['form-title']}>Cargar archivo</span>
                            <p className={styleFormModal['form-paragraph']}>
                                File should be an image
                            </p>
                            <label htmlFor="file-input" className={styleFormModal['drop-container']}>
                                <span className="drop-title">Drop files here</span>
                                or
                                <input 
                                    type="file" 
                                    accept="image/*"  
                                    id="file-input"
                                    className={styleFormModal['file-input']} />
                            </label>
                        </form>

                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary">Save changes</button>
                    </div>
                </div>
            </div>
        </div>
    );
}