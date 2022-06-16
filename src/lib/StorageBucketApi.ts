import { DEFAULT_HEADERS } from './constants'
import { isStorageError, StorageError } from './errors'
import { Fetch, get, post, put, remove } from './fetch'
import { resolveFetch } from './helpers'
import { Bucket } from './types'

export class StorageBucketApi {
  protected url: string
  protected headers: { [key: string]: string }
  protected fetch: Fetch

  constructor(url: string, headers: { [key: string]: string } = {}, fetch?: Fetch) {
    this.url = url
    this.headers = { ...DEFAULT_HEADERS, ...headers }
    this.fetch = resolveFetch(fetch)
  }

  /**
   * Retrieves the details of all Storage buckets within an existing project.
   */
  async listBuckets(): Promise<
    | {
        data: Bucket[]
        error: null
      }
    | {
        data: null
        error: StorageError
      }
  > {
    try {
      const data = await get(this.fetch, `${this.url}/bucket`, { headers: this.headers })
      return { data, error: null }
    } catch (error) {
      if (isStorageError(error)) {
        return { data: null, error }
      }

      throw error
    }
  }

  /**
   * Retrieves the details of an existing Storage bucket.
   *
   * @param id The unique identifier of the bucket you would like to retrieve.
   */
  async getBucket(
    id: string
  ): Promise<
    | {
        data: Bucket
        error: null
      }
    | {
        data: null
        error: StorageError
      }
  > {
    try {
      const data = await get(this.fetch, `${this.url}/bucket/${id}`, { headers: this.headers })
      return { data, error: null }
    } catch (error) {
      if (isStorageError(error)) {
        return { data: null, error }
      }

      throw error
    }
  }

  /**
   * Creates a new Storage bucket
   *
   * @param id A unique identifier for the bucket you are creating.
   * @returns newly created bucket id
   */
  async createBucket(
    id: string,
    options: { public: boolean } = { public: false }
  ): Promise<
    | {
        data: string
        error: null
      }
    | {
        data: null
        error: StorageError
      }
  > {
    try {
      const data = await post(
        this.fetch,
        `${this.url}/bucket`,
        { id, name: id, public: options.public },
        { headers: this.headers }
      )
      return { data: data.name, error: null }
    } catch (error) {
      if (isStorageError(error)) {
        return { data: null, error }
      }

      throw error
    }
  }

  /**
   * Updates a new Storage bucket
   *
   * @param id A unique identifier for the bucket you are creating.
   */
  async updateBucket(
    id: string,
    options: { public: boolean }
  ): Promise<
    | {
        data: { message: string }
        error: null
      }
    | {
        data: null
        error: StorageError
      }
  > {
    try {
      const data = await put(
        this.fetch,
        `${this.url}/bucket/${id}`,
        { id, name: id, public: options.public },
        { headers: this.headers }
      )
      return { data, error: null }
    } catch (error) {
      if (isStorageError(error)) {
        return { data: null, error }
      }

      throw error
    }
  }

  /**
   * Removes all objects inside a single bucket.
   *
   * @param id The unique identifier of the bucket you would like to empty.
   */
  async emptyBucket(
    id: string
  ): Promise<
    | {
        data: { message: string }
        error: null
      }
    | {
        data: null
        error: StorageError
      }
  > {
    try {
      const data = await post(
        this.fetch,
        `${this.url}/bucket/${id}/empty`,
        {},
        { headers: this.headers }
      )
      return { data, error: null }
    } catch (error) {
      if (isStorageError(error)) {
        return { data: null, error }
      }

      throw error
    }
  }

  /**
   * Deletes an existing bucket. A bucket can't be deleted with existing objects inside it.
   * You must first `empty()` the bucket.
   *
   * @param id The unique identifier of the bucket you would like to delete.
   */
  async deleteBucket(
    id: string
  ): Promise<
    | {
        data: { message: string }
        error: null
      }
    | {
        data: null
        error: StorageError
      }
  > {
    try {
      const data = await remove(
        this.fetch,
        `${this.url}/bucket/${id}`,
        {},
        { headers: this.headers }
      )
      return { data, error: null }
    } catch (error) {
      if (isStorageError(error)) {
        return { data: null, error }
      }

      throw error
    }
  }
}
