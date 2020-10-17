export interface OctokitResponse<T> {
    successful: boolean
    data?: T
}

export interface OctokitRelease {
    id: number
    tag_name: string
    name: string
    body?: string
    draft?: boolean
    prerelease: boolean
    created_at: string
    published_at: string
}
