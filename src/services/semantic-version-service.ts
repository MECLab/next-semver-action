import * as core from "@actions/core"
import semver, {SemVer} from "semver"
import {NextVersionRequest} from "../models/next-version-request"
import {NextVersion} from "../models/next-version"
import {OctokitClient} from "../clients/octokit-client"

export class SemanticVersionService {
    private readonly octokit
    constructor(private readonly token: string) {
        this.octokit = new OctokitClient(token)
    }

    async nextVersion(req: NextVersionRequest): Promise<NextVersion | null> {
        core.debug("retrieving latest release for repository")
        const release = await this.octokit.getRelease()

        core.debug(`received response from octokit: ${JSON.stringify(release)}`)
        const {tag_name} = release || {}
        const latestVersion: SemVer = (tag_name && semver.coerce(tag_name)) || new SemVer("0.0.0")

        if (req.bump) {
            const nextVersion = semver.inc(latestVersion, req.bump) || new SemVer("0.0.0")
            return {
                version: nextVersion.toString(),
                tag: `v${nextVersion}`
            }
        }

        if (!req.bump_patch_by_default) {
            core.info("skipping bump... no release bump specified")
            return null
        }

        const nextVersion = semver.inc(latestVersion, "patch") || new SemVer("0.0.0")
        return {
            version: nextVersion.toString(),
            tag: `v${nextVersion}`
        }
    }
}
