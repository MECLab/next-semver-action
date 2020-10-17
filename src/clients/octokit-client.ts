import * as core from "@actions/core"
import * as github from "@actions/github"
import {OctokitRelease, OctokitResponse} from "../models/octokit-models"

export class OctokitClient {
    private readonly octokit
    constructor(private readonly token: string) {
        core.debug("initializing OctokitClient")
        this.octokit = github.getOctokit(token)
    }

    async getLatestRelease(): Promise<OctokitResponse<OctokitRelease>> {
        const {repo} = github.context
        core.debug(`retrieving latest release: ${JSON.stringify(repo)}`)
        return this.octokit.repos.getLatestRelease(repo)
    }
}
