interface NextSemVerRequest {
    bump: string
    dry_run?: boolean
    bump_patch_by_default?: boolean
}

export enum SemVerLabels {
    MAJOR = "major",
    MINOR = "minor",
    PATCH = "patch"
}
