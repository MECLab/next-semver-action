import * as core from "@actions/core"
import {SemVerLabels} from "./models/NextSemVerRequest"

async function run(): Promise<void> {
    try {
        const bump = core.getInput("bump")
        const dry_run = core.getInput("dry_run")
        const bump_patch_by_default = core.getInput("bump_patch_by_default")

        const request = {
            bump: bump.toLowerCase() as SemVerLabels,
            dry_run: (dry_run && dry_run === "true") || false,
            bump_patch_by_default: (bump_patch_by_default && bump_patch_by_default === "true") || false
        }

        core.debug(JSON.stringify(request, null, 2))
    } catch (error) {
        core.setFailed(error.message)
    }
}

run()
