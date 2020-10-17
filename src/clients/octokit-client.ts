import * as core from "@actions/core"
import * as github from "@actions/github"
import {OctokitRelease} from "../models/octokit-models"

export class OctokitClient {
    private readonly octokit
    constructor(private readonly token: string) {
        core.debug("initializing OctokitClient")
        this.octokit = github.getOctokit(token)
    }

    async getRelease(): Promise<OctokitRelease | null> {
        const {repo} = github.context
        try {
            core.debug(`retrieving latest release: ${JSON.stringify(repo)}`)
            const {data} = await this.octokit.repos.getLatestRelease(repo)
            return data
        } catch (error) {
            const {status} = error
            if (status === 404) {
                core.info("No release returned from github")
                return null
            }

            core.error(`failed while attempting to retrieve the latest release: ${JSON.stringify({repo, error})}`)
            throw error
        }
    }
}
