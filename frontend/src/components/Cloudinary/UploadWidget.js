import { useState } from "react";

// Upload Widget component
function UploadWidget({ state,setState }) {
    // Configurations for the widget, setUwConfig in case we want
    // to allow changing parameters
    const [uwConfig,setUwConfig] = useState({
        cloudName:"kaaoskoodarit",
        uploadPreset:"upload_widget",
        cropping:true,
        sources:["local","url"],
        multiple:false,
        maxImageFileSize: 20000000
    })

    // Create the widget
    const myWidget = window.cloudinary.createUploadWidget(
        uwConfig,
        (error, result) => {
            // No error handling....yet?
            if (!error && result && result.event === "success") {
                console.log("Done! Here is the image info: ", result.info);
                // Set state of calling component to have the URL of the uploaded image
                setState((state) => {
                    return {
                        ...state,
                        //image:result.info.url
                        image:result.info.secure_url
                    }
                })
            }
        }
    );

    // onClick event handler, opens Widget
    const onClick = (event) => {
        event.preventDefault();
        myWidget.open();
    }

    return (
        <div>
            <button id="upload_widget" className="cloudinary-button" onClick={onClick}>
                Upload
            </button>
        </div>
    );
}

export default UploadWidget;
