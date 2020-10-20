import {SemanticVersionService} from "../../../services/semantic-version-service"
import {NextVersionRequest, SemVerLabels} from "../../../models/next-version-request"
import {OctokitClient} from '../../../clients/octokit-client'
import {OctokitRelease} from '../../../models/octokit-models'

jest.mock("@actions/core", () => ({
    debug: (message: string) => console.debug(`core.debug: ${message}`),
    info: (message: string) => console.info(`core.info: ${message}`),
    warn: (message: string) => console.warn(`core.warn: ${message}`),
    error: (message: string) => console.error(`core.error: ${message}`)
}))
jest.mock("../../../clients/octokit-client")

describe("nextVersion", () => {
    const response: OctokitRelease = {
        id: 1,
        name: "v1.0.0",
        body: "body",
        tag_name: "v1.0.0",

        prerelease: false,
        created_at: "2020-10-16T18:57",
        published_at: "2020-10-16T18:57"
    }

    beforeEach(() => {
        OctokitClient.prototype.getRelease = jest.fn().mockReturnValue(response)
    })

    test("it should bump release when no release exists", async () => {
        // arrange
        OctokitClient.prototype.getRelease = jest.fn().mockReturnValue(null)

        const sut = new SemanticVersionService("token")
        const request: NextVersionRequest = {
            bump: SemVerLabels.MAJOR,
            bump_patch_by_default: true
        }

        // act
        const target = await sut.nextVersion(request)

        // assert
        expect(target).not.toBeNull()

        const {version, tag} = target!
        expect(version).toBe("1.0.0")
        expect(tag).toBe("v1.0.0")
    })

    test("it should bump major release when 'major' bump is supplied", async () => {
        // arrange
        const sut = new SemanticVersionService("token")
        const request = {
            bump: SemVerLabels.MAJOR
        }

        // act
        const target = await sut.nextVersion(request)

        // arrange
        expect(target).not.toBeNull()
        expect(target?.version).toBe("2.0.0")
        expect(target?.tag).toBe("v2.0.0")
    })

    test("it should bump patch release when NO bump is supplied", async () => {
        // arrange
        const sut = new SemanticVersionService("token")
        const request:  NextVersionRequest = {
            bump: null,
            bump_patch_by_default: true
        }

        // act
        const target = await sut.nextVersion(request)

        // arrange
        expect(target).not.toBeNull()
        expect(target?.version).toBe("1.0.1")
        expect(target?.tag).toBe("v1.0.1")
    })

    test("it should bump when no release yet exists", async () => {
        // arrange
        OctokitClient.prototype.getRelease = jest.fn().mockReturnValue({
            status: 200,
            data: null
        })

        const sut = new SemanticVersionService("token")
        const request:  NextVersionRequest = {
            bump: null,
            bump_patch_by_default: true
        }

        // act
        const target = await sut.nextVersion(request)

        // arrange
        expect(target).not.toBeNull()
        expect(target?.version).toBe("0.0.1")
        expect(target?.tag).toBe("v0.0.1")
    })

    test("it should return null when NO bump or default is false", async () => {
        // arrange
        const sut = new SemanticVersionService("token")
        const request:  NextVersionRequest = {
            bump: null,
            bump_patch_by_default: false
        }

        // act
        const target = await sut.nextVersion(request)

        // arrange
        expect(target).toBeNull()
    })
})
