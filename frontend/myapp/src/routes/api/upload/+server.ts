import { json } from '@sveltejs/kit';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function POST({ request }) {
	try {
		const data = await request.formData();
		const file = data.get('image') as File;

		if (!file) {
			return json({ error: 'No file provided' }, { status: 400 });
		}

		// Validate file type
		if (!file.type.startsWith('image/')) {
			return json({ error: 'File must be an image' }, { status: 400 });
		}

		// Validate file size (max 5MB)
		if (file.size > 5 * 1024 * 1024) {
			return json({ error: 'File size must be less than 5MB' }, { status: 400 });
		}

		// Generate unique filename
		const fileExtension = path.extname(file.name);
		const fileName = `product_${Date.now()}_${Math.random().toString(36).substring(2)}${fileExtension}`;

		// Ensure upload directory exists
		const uploadDir = path.join(__dirname, '../../../static/images/products');
		await mkdir(uploadDir, { recursive: true });

		// Save file
		const filePath = path.join(uploadDir, fileName);
		const arrayBuffer = await file.arrayBuffer();
		const buffer = Buffer.from(arrayBuffer);
		await writeFile(filePath, buffer);

		// Return the public URL
		const imageUrl = `/images/products/${fileName}`;

		return json({ imageUrl });

	} catch (error) {
		console.error('Upload error:', error);
		return json({ error: 'Upload failed' }, { status: 500 });
	}
}