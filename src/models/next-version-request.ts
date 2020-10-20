export interface NextVersionRequest {
    bump: SemVerLabels | null
    bump_patch_by_default?: boolean
}

export enum SemVerLabels {
    MAJOR = "major",
    MINOR = "minor",
    PATCH = "patch"
}
