const core = require('@actions/core');
const fs = require('fs');
const path = require("path");

const fileName = core.getInput('name');
const fullFileName = core.getInput('full_file_name');

const jsonString = core.getInput('json');
const dir = core.getInput('dir');
const fullPath = fullFileName || path.join(process.env.GITHUB_WORKSPACE, dir || "", fileName);
let fileContent = JSON.stringify(jsonString);

fileContent = JSON.parse(fileContent)

try {
    if (!fileName && !fullFileName) {
        core.setFailed('Please provide a file name or full file name');
        return;
    }

    core.info(`Creating json file...`)
    core.info(`file path ${fullPath}...`)
    fs.writeFile(fullPath, fileContent, function (error) {

        if (error) {
            core.setFailed(error.message);
            throw error
        }

        core.info('JSON file created.')

        fs.readFile(fullPath, null, handleFile)

        function handleFile(err, data) {
            if (err) {
                core.setFailed(error.message)
                throw err
            }

            core.info('JSON checked.')
            core.setOutput("successfully", `Successfully created json on ${fullPath} directory with ${fileContent} data`);
        }
    });
} catch (err) {
    core.setFailed(err.message);
}
