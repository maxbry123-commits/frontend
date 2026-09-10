import type { IconPickerIcon } from "./IconPickerIcon.js";
import type { IconName, IconPrefix } from "@fortawesome/fontawesome-svg-core";
import type { IconPickerFontAwesome } from "./IconPickerFontAwesome.js";

export class IconPickerIconFormatter {
    static formatFontAwesome(icon: IconPickerIcon): IconPickerFontAwesome {
        return {
            prefix: icon.prefix as IconPrefix,
            name: icon.name as IconName
        };
    }

    static formatStringValue(icon: IconPickerIcon | IconPickerFontAwesome) {
        return `${icon.prefix}/${icon.name}`;
    }
}
