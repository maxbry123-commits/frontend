import * as React from "react";
import { MultiFilePicker } from "@webiny/admin-ui";

/**
 * TODO @ts-refactor
 */
interface MultiImageUploadProps {
    imagePreviewProps: {
        src: string;
        [key: string]: any;
    };
    [key: string]: any;
}

// This component looks unused, but let's keep it for now. Down the line, we might want to remove it.
const MultiImageUpload = ({ props }: MultiImageUploadProps) => {
    return <MultiFilePicker {...props} />;
};

export default MultiImageUpload;
