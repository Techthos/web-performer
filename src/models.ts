import { IsAlpha, IsArray, IsEnum, IsIn, IsObject, IsOptional, IsString, IsUrl, ValidateNested } from "class-validator";
import inquirer, { Answers, QuestionCollection } from "inquirer";


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
    name!: string

    @IsString()
    value!: string
}

export class PerformerFileVariableEntry {
    @IsString()
    name!: string

    @IsString()
    value!: string
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

export class PerformerFileInputEntry {
    @IsString()
    name!: string

    @IsEnum(PerformerFileInputEntryTypes)
    type!: PerformerFileInputEntryTypes

    @IsArray()
    @IsOptional()
    choices!: string[]

    @IsString()
    @IsOptional()
    message!: string
}

export class GraphQLPerformerFile extends BasePerformerFile {

    @IsString()
    @IsUrl({require_host: true, require_protocol: true})
    endpoint: string

    @IsArray()
    @ValidateNested()
    @IsOptional()
    headers: PerformerFileHeaderEntry[]

    @IsArray()
    @ValidateNested()
    @IsOptional()
    variables: PerformerFileVariableEntry[]

    @IsArray()
    @ValidateNested()
    @IsOptional()
    input: PerformerFileInputEntry[]

    @IsString()
    query: string

    constructor(data: any) {
        super(data)

        this.endpoint = data['endpoint']
        this.query = data['query']
        this.headers = data['headers']
        this.variables = data['variables']
        this.input = data['input']
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

    async inquirer() {

            const questions = this.input.map((entry) => {
                return {
                    name: entry.name,
                    type: entry.type as any,
                    choices: entry.choices,
                    message: entry.message
                } as QuestionCollection<Answers>
            })

            const answers = await inquirer.prompt(questions)
    }

    async perform() {
        console.log(this._headers)
        const response = await fetch(this.endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                query: this.query,
                variables: this._variables
            })
        })

        process.stdout.write(await response.text())
    }
}
