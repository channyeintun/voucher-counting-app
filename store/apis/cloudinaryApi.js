import { cloudinaryConfig } from "../../cloudinaryConfig";

const { apiUrl, cloudName, uploadPreset } = cloudinaryConfig;

export const uploadImage = async (imageBase64String) => {
    const base64ImgTye = `data:image/jpg;base64,${imageBase64String}`

    const data = {
        "file": base64ImgTye,
        "upload_preset": uploadPreset,
    }

    console.log('apiUrl', apiUrl);
    const url = `${apiUrl}/${cloudName}/image/upload`;

    const result = await fetch(url, {
        body: JSON.stringify(data),
        headers: {
            'content-type': 'application/json'
        },
        method: 'POST',
    }).then(async r => {
        let data = await r.json();
        console.log('uploadImage res',data)
        return data;
    });

    return result;
}