import WhyInput from "../app/components/why-input";
import { onDoneDecorator } from "./common";

export default {
    component: WhyInput,
    args: {},
    decorators: [onDoneDecorator],
}

export const ExamplePoint = {
    args: {
        point: {
            subject: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer at bibendum sapien",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer at bibendum sapien"
        }
    }
}

export const onDoneTest = {
    args: {
        point: {
            subject: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer at bibendum sapien",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer at bibendum sapien"
        }
    }
}
