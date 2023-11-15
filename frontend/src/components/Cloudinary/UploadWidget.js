import { useState, useMemo } from "react";
import Button  from "@mui/material/Button";

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
        maxImageFileSize: 20000000,
        thumbnails:false
    })


    // Create the widget
    const myWidget = useMemo(() => window.cloudinary.createUploadWidget(
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ),[]);

    // onClick event handler, opens Widget
    const onClick = (event) => {
        event.preventDefault();
        myWidget.open();
    }

    return (
        <div>
            <Button id="cloudinary-upload-widget" variant="contained" onClick={onClick}>
                Upload
            </Button>
        </div>
    );
}

export default UploadWidget;
