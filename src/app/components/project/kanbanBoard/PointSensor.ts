import {
    PointerSensor,
    PointerSensorOptions,
} from "@dnd-kit/core";
import type { PointerEvent } from "react";

export class SafePointerSensor extends PointerSensor {
    static activators = [
        {
            eventName: "onPointerDown" as const,
            handler: (
                event: PointerEvent<Element>,
                _options: PointerSensorOptions
            ) => {
                const target = event.nativeEvent.target;

                if (!(target instanceof HTMLElement)) {
                    return true;
                }

                if (
                    target.closest(
                        "input, textarea, button, select, option, a, [data-dnd-ignore]"
                    )
                ) {
                    return false;
                }

                _options.activationConstraint = {
                    ..._options.activationConstraint,
                    distance: 5, // only activate if pointer moves 5px
                };

                return true;
            },
        },
    ];
}
