const CLOUDINARY_CLOUD_NAME = 'om2ul3zx';
const CLOUDINARY_UPLOAD_PRESET = 'mys-construcciones';

export async function uploadImage(file: File, folder: string): Promise<string> {
  const formData = new FormData();

  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
  formData.append('folder', folder);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
    {
      method: 'POST',
      body: formData,
    }
  );

  if (!response.ok) {
  const errorData = await response.json().catch(() => null);
  throw new Error(
    errorData?.error?.message ||
      `Cloudinary rechazó la carga con HTTP ${response.status}.`
  );
  }

  const data = await response.json();
  return data.secure_url;
}