import api from './api'

/**
 * Upload single image
 */
export async function uploadImage(file: File): Promise<{
  url: string
  filename: string
  originalName: string
  size: number
  mimetype: string
}> {
  const formData = new FormData()
  formData.append('image', file)

  const { data } = await api.post('/upload/image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

  return data.data
}

/**
 * Upload multiple images
 */
export async function uploadImages(files: File[]): Promise<
  Array<{
    url: string
    filename: string
    originalName: string
    size: number
    mimetype: string
  }>
> {
  const formData = new FormData()
  files.forEach((file) => {
    formData.append('images', file)
  })

  const { data } = await api.post('/upload/images', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

  return data.data
}
