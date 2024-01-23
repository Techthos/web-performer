import { Command } from "commander";
import { readFileSync } from "fs";
import { parse } from "yaml";
import { BasePerformerFile, GraphQLPerformerFile, RUNNER_TYPES } from "./models.js";
import { validate } from "./helpers.js";

const program = new Command()


program.version("0.0.1")
    .command("run")
    .option('-f <file>', 'YML File')
    .action(async (options: {f?: string}) => {
        const filename = options.f || `./Performerfile.yml`
        const content = readFileSync(filename, 'utf-8')
        const data = parse(content)

        const baseData = new BasePerformerFile(data)
        validate(baseData)
    
        if(baseData.type === RUNNER_TYPES.GRAPHQL) {
            const file = new GraphQLPerformerFile(data)
            validate(file)
            await file.inquirer()
            await file.perform()
        }
    })


program.parse()