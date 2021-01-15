export const byId = (id) => { return document.getElementById(id) }

 
export function toBase64(file, referer, callback) {
    const reader = new FileReader();
    reader.readAsDataURL(file.files[0]);
    reader.onload = () => callback(reader.result, referer);
    reader.onerror = error => {
        alert("Error Loading File");
    }
}
 

export function toBase64v2(fileInput) {
    return new Promise<any>(function (resolve, reject) {
        try {
            const reader = new FileReader();
            reader.readAsDataURL(fileInput.files[0]);
            console.debug("fileInput.files[0]: ", fileInput.files[0]);
            reader.onload = function () { resolve(reader.result); }
            reader.onerror = function (error) {
                reject(error);
            }
        } catch (e) {
            reject(e);
        }
    });

}

export const resizeImage = (data:string, percentage:number) => {
    return new Promise<any>(function(resolve, reject){
        const img = new Image();
        img.src = data;
        img.onload = function () {
            const width = img.width * percentage;
            const height = img.height * percentage;
            // create an off-screen canvas
            var canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (!ctx) return;
            // set its dimension to target size
            canvas.width = width;
            canvas.height = height;

            // draw source image into the off-screen canvas:
            ctx.drawImage(img, 0, 0, width, height);

            // encode image to data-uri with base64 version of compressed image
            resolve(canvas.toDataURL());
        }
    });
}

export function toBase64FromFile(file) {
    return new Promise(function (resolve, reject) {
        try {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = function () { resolve(reader.result); }
            reader.onerror = function (error) {
                reject(error);
            }
        } catch (e) {
            reject(e);
        }
    });

}


export const checkExistance = function (...ids) {
    for (let i = 0; i < ids.length; i++) {
        if (byId(ids[i]) == null) {
            console.log("component with id:", ids[i], "does not exist");
            return false;
        }
    }
    return true;
}

/**
 * 
 * @param {Number} totalButton 
 * @param {Number} currentPage 
 */
export const createNavButtons = (totalButton, currentPage) => {
    totalButton = Math.ceil(totalButton);
    if (!currentPage) { currentPage = 0 }
    let buttonData = new Array();
    let min = currentPage - 3 < 0 ? 0 : currentPage - 3;
    let max = currentPage + 3 > totalButton ? totalButton : currentPage + 3;

    if (min != 0) {
        buttonData.push({
            text: 1,
            value: 0
        });
    }

    for (let index = min; index < max; index++) {
        buttonData.push({
            text: index + 1,
            value: index
        });
    }

    if (max != totalButton) {
        buttonData.push({
            text: totalButton,
            value: totalButton - 1
        });
    }


    return buttonData;
}


export const getDropdownOptionsMonth = () => {
    let options:any[] = [];
    for (let i = 1; i <= 12; i++) {
        options.push({ value: i, text: i });
    }
    return options;
}
export const getDropdownOptionsYear = (from, to) => {
    let options:any[] = [];
    for (let i = from; i <= to; i++) {
        options.push({ value: i, text: i });
    }
    return options;
}