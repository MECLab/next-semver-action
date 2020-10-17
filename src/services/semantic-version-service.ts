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
        core.debug("nextVersion: starting to generate the next semantic version")

        const {status, data} = await this.octokit.getLatestRelease()
        if (status !== 200) {
            const message = "failed while attempting to retrieve the latest release"
            core.error(message)
            throw Error(message)
        }

        const {tag_name} = data || {}
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
