import {SemanticVersionService} from "../../../services/semantic-version-service"
import {NextVersionRequest, SemVerLabels} from "../../../models/next-version-request"
import {OctokitClient} from '../../../clients/octokit-client'

jest.mock("@actions/core", () => ({
    error: (message: string) => console.error(message)
}))
jest.mock("../../../clients/octokit-client")
describe("nextVersion", () => {
    const response = {
        status: 200,
        data: {
            id: 1,
            name: "v1.0.0",
            body: "body",
            tag_name: "v1.0.0",

            prerelease: false,
            created_at: "2020-10-16T18:57",
            published_at: "2020-10-16T18:57"
        }
    }

    beforeEach(() => {
        OctokitClient.prototype.getLatestRelease = jest.fn().mockImplementation(() => response)
    })

    test("it should throw an error when octokit.getLatestRelease fails", async () => {
        // arrange
        OctokitClient.prototype.getLatestRelease = jest.fn().mockReturnValue({
            status: 400
        })

        const sut = new SemanticVersionService("token")
        const request: NextVersionRequest = {
            bump: SemVerLabels.MAJOR,
            bump_patch_by_default: true
        }

        // act + assert
        await expect(() => sut.nextVersion(request)).rejects.toThrow();
    })


})
