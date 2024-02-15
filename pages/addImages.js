import { useState } from 'react';
import { storage } from "./lib/firebase";
import { ref, uploadBytes } from 'firebase/storage';

function ImageUploadForm() {
    const [file, setFile] = useState(null);

    const handleChange = (e) => {
        if (e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = () => {
        if (!file) return;
        const storageRef = ref(storage, `Images/${file.name}`);
        uploadBytes(storageRef, file).then((snapshot) => {
            console.log('Image uploaded successfully');
        }).catch((error) => {
            console.error('Upload failed', error);
        });
    };

    return (
        <div>
            <input type="file" onChange={handleChange} accept='.png, .svg, .jpg'/>
            <button onClick={handleUpload}>Upload Image</button>
        </div>
    );
}

export default ImageUploadForm;
