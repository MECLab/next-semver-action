import {context, getOctokit} from "@actions/github"
import {OctokitRelease, OctokitResponse} from "../models/octokit-models"

export class OctokitClient {
    private readonly octokit
    constructor(private readonly token: string) {
        this.octokit = getOctokit(token)
    }

    async getLatestRelease(): Promise<OctokitResponse<OctokitRelease>> {
        const {repo} = context
        return this.octokit.repos.getLatestRelease(repo)
    }
}
