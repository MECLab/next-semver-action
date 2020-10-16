import github, {context} from "@actions/github"
import {OctokitRelease, OctokitResponse} from "../models/octokit-models"

export class OctokitClient {
    private readonly octokit
    constructor(private readonly token: string) {
        this.octokit = github.getOctokit(token)
    }

    async getLatestRelease(): Promise<OctokitResponse<OctokitRelease>> {
        const {repo} = context
        return this.octokit.repos.getLatestRelease(repo)
    }
}
