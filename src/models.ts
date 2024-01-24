import { Transform, Type } from "class-transformer";
import {  IsAlphanumeric, IsArray, IsEnum, IsIn, IsObject, IsOptional, IsString, IsUrl, ValidateNested } from "class-validator";
import inquirer, { Answers, QuestionCollection } from "inquirer";
import { validate } from "./helpers.js";


export enum RUNNER_TYPES {
    GRAPHQL = "graphql"
}

export class BasePerformerFile {
    @IsEnum(RUNNER_TYPES)
    type: RUNNER_TYPES = RUNNER_TYPES.GRAPHQL;

    constructor(data: any) {
        this.type = data['type']
    }
}


export class PerformerFileHeaderEntry {
    @IsString()
    name: string

    @IsString()
    @Transform(({value}) => `${value}`)
    value: string


    constructor(data: any) {
        this.name = data['name']
        this.value = data['value']
    }
}

export class PerformerFileVariableEntry {
    @IsString()
    @IsAlphanumeric()
    name: string

    value: any

    constructor(data: any) {
        this.name = data['name']
        this.value = data['value']
    }
}

export enum PerformerFileInputEntryTypes {
    INPUT = 'input',
    PASSWORD = 'password',
    CHECKBOX = 'checkbox',
    CONFIRM = 'confirm',
    EDITOR = 'editor',
    NUMBER = 'number',
    LIST = 'list',
}

export enum PerformerFileInputEntryContext {
    headers = 'headers',
    variables = 'variables',
}

export class PerformerFileInputEntry {


    @IsString()
    @IsAlphanumeric()
    name: string

    @IsEnum(PerformerFileInputEntryTypes)
    type: PerformerFileInputEntryTypes

    @IsEnum(PerformerFileInputEntryContext)
    context: PerformerFileInputEntryContext

    @IsArray()
    @IsOptional()
    choices: string[]

    @IsString()
    @IsOptional()
    message: string

    constructor(data: any) {
        this.name = data['name']
        this.type = data['type']
        this.context = data['context']
        this.choices = data['choices']
        this.message = data['message']
    }
}

export class GraphQLPerformerFile extends BasePerformerFile {

    @IsString()
    @IsUrl({require_host: true, require_protocol: true})
    endpoint: string

    @ValidateNested({each: true})
    @Type(() => PerformerFileHeaderEntry)
    headers: PerformerFileHeaderEntry[]

    @ValidateNested({each: true})
    @Type(() => PerformerFileVariableEntry)
    variables: PerformerFileVariableEntry[]

    @ValidateNested({each: true})
    @Type(() => PerformerFileInputEntry)
    input?: PerformerFileInputEntry[]

    @IsString()
    query: string

    constructor(data: any) {
        super(data)

        this.endpoint = data['endpoint']
        this.query = data['query']

        if(Array.isArray(data['headers'])) {
            this.headers = data['headers'].map(data => new PerformerFileHeaderEntry(data))
        }

        if(Array.isArray(data['variables'])) {
            this.variables = data['variables'].map(data => new PerformerFileVariableEntry(data))
        }
        if(Array.isArray(data['input'])) {
            this.input = data['input'].map(data => new PerformerFileInputEntry(data))
        }
    }


    private get _headers() {
        return this.headers.reduce((headers, item) => {
            return {...headers, [item.name]: item.value}
        }, {
            'Content-Type': 'application/json'
        } as HeadersInit)
    }

    private get _variables() {
        return this.variables.reduce((variables, item) => {
            return {...variables, [item.name]: item.value}
        }, {} as any)
    }

    validate(exist = true) {

        return validate(this, exist)

    }

    async inquirer() {

            if(!this.input || this.input.length === 0) return {}

            const questions = this.input.map((entry) => {
                return {
                    name: entry.name,
                    type: entry.type as any,
                    choices: entry.choices,
                    message: entry.message,
                    validate: (value) => {
                        if(entry.context === PerformerFileInputEntryContext.headers) {
                            this.headers.push({
                                name: entry.name,
                                value
                            })
                        } else if(entry.context === PerformerFileInputEntryContext.variables) {
                            this.variables.push({
                                name: entry.name,
                                value
                            })
                        }

                        const errors = this.validate(false)
                        return errors.length === 0
                    },
                } as QuestionCollection<Answers>
            })

            const answers = await inquirer.prompt(questions)
    }

    async perform() {
        const response = await fetch(this.endpoint, {
            method: 'POST',
            headers: this._headers,
            body: JSON.stringify({
                query: this.query,
                variables: this._variables
            })
        })

        process.stdout.write(await response.text())
    }
}
