import { useState } from "react";

function UploadWidget({ state,setState }) {
    const [uwConfig,setUwConfig] = useState({
        cloudName:"kaaoskoodarit",
        uploadPreset:"upload_widget",
        cropping:true,
        sources:["local","url"],
        multiple:false,
        maxImageFileSize: 20000000
    })

    const myWidget = window.cloudinary.createUploadWidget(
        uwConfig,
        (error, result) => {
            if (!error && result && result.event === "success") {
                console.log("Done! Here is the image info: ", result.info);
                setState((state) => {
                    return {
                        ...state,
                        image:result.info.url
                    }
                })
            }
        }
    );

    const onClick = (event) => {
        event.preventDefault();
        myWidget.open();
    }
    /*
        document.getElementById("upload_widget").addEventListener(
            "click",
            function () {
                myWidget.open();
            },
            false
        );
    };
    */

    return (
        <div>
            <button
                id="upload_widget"
                className="cloudinary-button"
                onClick={onClick}
            >
            Upload
            </button>
        </div>
    );
}

export default UploadWidget;
