import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { put } from '@vercel/blob';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const HEIC_BRANDS = ['heic', 'heix', 'hevc', 'heim', 'heis', 'mif1', 'msf1'];

// 讀檔案開頭 16 bytes 判斷真實格式。
// 副檔名同 file.type 都可以隨意填，所以唔靠佢哋：
// 好處係 iPhone / Android 相機回傳空 type 都上傳到，偽裝成 .jpg 嘅文字檔就上傳唔到
async function detectImageType(file: File) {
  const head = new Uint8Array(await file.slice(0, 16).arrayBuffer());
  const bytes = (...expected: number[]) => expected.every((n, i) => head[i] === n);
  const text = (start: number, length: number) =>
    String.fromCharCode(...head.slice(start, start + length));

  if (bytes(0xff, 0xd8, 0xff)) return { type: 'image/jpeg', extension: 'jpg' };
  if (bytes(0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a))
    return { type: 'image/png', extension: 'png' };
  if (bytes(0x47, 0x49, 0x46, 0x38)) return { type: 'image/gif', extension: 'gif' };
  if (text(0, 4) === 'RIFF' && text(8, 4) === 'WEBP')
    return { type: 'image/webp', extension: 'webp' };
  if (text(4, 4) === 'ftyp' && HEIC_BRANDS.includes(text(8, 4)))
    return { type: 'image/heic', extension: 'heic' };

  return undefined;
}

// POST /api/upload - 上傳相片到 Vercel Blob，回傳 URL 供前端存入 icon 欄位
export async function POST(request: NextRequest) {
  try {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return NextResponse.json(
        { error: '儲存空間未設定 / Blob storage is not configured' },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file');

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: '請選擇相片 / Please choose a photo' },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: '相片不可大於 5 MB / Image must be 5 MB or smaller' },
        { status: 413 }
      );
    }

    const image = await detectImageType(file);

    if (!image) {
      return NextResponse.json(
        { error: '只支援 JPG / PNG / GIF / WebP / HEIC 格式 / Unsupported image format' },
        { status: 400 }
      );
    }

    // 只接受數字，避免路徑穿越
    const rawUserId = String(formData.get('userId') ?? '');
    const folder = /^\d+$/.test(rawUserId) ? rawUserId : 'anonymous';

    const blob = await put(
      `custom-icons/user-${folder}/${randomUUID()}.${image.extension}`,
      file,
      {
        access: 'public',
        contentType: image.type,
        addRandomSuffix: false, // 檔名已用 UUID，不需再加亂數
      }
    );

    return NextResponse.json({ url: blob.url });
  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json(
      { error: '上傳失敗 / Failed to upload image' },
      { status: 500 }
    );
  }
}