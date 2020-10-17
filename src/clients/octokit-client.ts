import * as core from "@actions/core"
import * as github from "@actions/github"
import {OctokitRelease, OctokitResponse} from "../models/octokit-models"

export class OctokitClient {
    private readonly octokit
    constructor(private readonly token: string) {
        core.debug("initializing OctokitClient")
        this.octokit = github.getOctokit(token)
    }

    async getRelease(): Promise<OctokitResponse<OctokitRelease>> {
        const {repo} = github.context
        try {
            core.debug(`retrieving latest release: ${JSON.stringify(repo)}`)
            return this.octokit.repos.getLatestRelease(repo)
        } catch (e) {
            core.error(`failed while attempting to retrieve the latest release: ${JSON.stringify({repo, error: e})}`)
            return {status: 1, data: null}
        }
    }
}
