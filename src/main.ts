import * as core from "@actions/core"
import {SemVerLabels} from "./models/next-version-request"
import {SemanticVersionService} from "./services/semantic-version-service"

async function run(): Promise<void> {
    try {
        const bump = core.getInput("bump")
        const bump_patch_by_default = core.getInput("bump_patch_by_default")
        const token = core.getInput("token")

        const request = {
            bump: bump.toLowerCase() as SemVerLabels,
            bump_patch_by_default: (bump_patch_by_default && bump_patch_by_default === "true") || false
        }
        const service = new SemanticVersionService(token)
        const version = await service.nextVersion(request)

        core.setOutput("version", version)
    } catch (error) {
        core.setFailed(error.message)
    }
}

run()
