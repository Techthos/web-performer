import { ValidationError, validateSync } from "class-validator";


function printError(error: ValidationError, location: string = "") {

    const currentLocation = `${location}/${error.property}`

    if(error.constraints)
    console.log(`Validation Error at ${currentLocation}\n - ${Object.values(error.constraints)}`)

    if(error.children && error.children.length)  {
        error.children.forEach(error => printError(error, `${currentLocation}/${error.property}`))
    }

}

export function validate(obj: any, systemExit = true): ValidationError[] {

    const errors = validateSync(obj)

    if(systemExit && errors.length) {
        errors.forEach((error) => printError(error))
        process.exit(1)
    } else if(errors.length) {
        return errors
    } else {
        return []
    }
}