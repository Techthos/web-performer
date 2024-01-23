import { validateSync } from "class-validator";




export function validate(obj: any) {

    const errors = validateSync(obj)

    if(errors.length) {
        console.error(errors[0])
        process.exit(1)
    }
}