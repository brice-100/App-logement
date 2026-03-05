const CLOUD_NAME = 'do1yrlwvn'
const UPLOAD_PRESET = 'logifind_preset'

export const uploaderImage = async (fichier, onProgression) => {
  return new Promise((resolve, reject) => {
    const formData = new FormData()
    formData.append('file', fichier)
    formData.append('upload_preset', UPLOAD_PRESET)

    const xhr = new XMLHttpRequest()

    // Suivre la progression
    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable) {
        const progression = Math.round((e.loaded / e.total) * 100)
        onProgression(progression)
      }
    })

    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText)
        resolve(response.secure_url)
      } else {
        reject(new Error('Erreur upload'))
      }
    })

    xhr.addEventListener('error', () => {
      reject(new Error('Erreur réseau'))
    })

    xhr.open('POST', `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`)
    xhr.send(formData)
  })
}