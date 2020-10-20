import {context} from '@actions/github'
import {SemanticVersionService} from '../../../services/semantic-version-service'
import {SemVerLabels} from '../../../models/next-version-request'

beforeAll(() => {
    jest.mock("@actions/core", () => ({
        debug: (message: string) => console.debug(`core.debug: ${message}`),
        info: (message: string) => console.info(`core.info: ${message}`),
        warn: (message: string) => console.warn(`core.warn: ${message}`),
        error: (message: string) => console.error(`core.error: ${message}`)
    }))
})

describe("nextVersion", () => {
    beforeEach(() => {
        jest.spyOn(context, "repo", "get").mockReturnValue({owner: "meclab-bot", repo: "special-octo-lamp"})
    })

    test("it should throw an error when no release exists", async () => {
        // arrange
        jest.spyOn(context, "repo", "get").mockReturnValue({owner: "meclab-bot", repo: "urban-doodle"})
        const sut = new SemanticVersionService(process.env.GITHUB_TOKEN!)
        const request = {
            bump: SemVerLabels.PATCH
        }

        // act
        const target = await sut.nextVersion(request)

        // assert
        expect(target).not.toBeNull()

        const {version, tag} = target!
        expect(version).toBe("0.0.1")
        expect(tag).toBe("v0.0.1")
    })

    test("it should bump the version when a release exists in the repository", async () => {
        // arrange
        const sut = new SemanticVersionService(process.env.GITHUB_TOKEN!)
        const request = {
            bump: SemVerLabels.PATCH
        }

        // act
        const target = await sut.nextVersion(request)

        // assert
        expect(target).not.toBeNull()

        const {version, tag} = target!
        expect(version).toBe("1.0.1")
        expect(tag).toBe("v1.0.1")
    })
})