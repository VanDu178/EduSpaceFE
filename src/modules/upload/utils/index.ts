import toast from 'react-hot-toast';
import { DEFAULT_IMAGE_UPLOAD_CONFIG, DEFAULT_VIDEO_UPLOAD_CONFIG, IMAGE_VALIDATION_MESSAGES } from '../constants';

export interface ImageValidationConfig {
    maxSizeMb?: number;
    MAX_SIZE_MB?: number;
    acceptedTypes?: readonly string[];
    ACCEPTED_TYPES?: readonly string[];
    formatsText?: string;
    FORMATS_TEXT?: string;
    checkMagicBytes?: boolean;
}

export interface ImageValidationResult {
    isValid: boolean;
    message?: string;
}

export interface ImageSelectResult {
    file: File;
    localBlobUrl: string;
}


export interface VideoValidationConfig {
    maxSizeMb?: number;
    MAX_SIZE_MB?: number;
    acceptedTypes?: readonly string[];
    ACCEPTED_TYPES?: readonly string[];
    formatsText?: string;
    FORMATS_TEXT?: string;
    checkMagicBytes?: boolean;
}

export interface VideoValidationResult {
    isValid: boolean;
    message?: string;
}

export interface VideoSelectResult {
    file: File;
    localBlobUrl: string;
    extractedDuration: number;
}

/**
 * Xử lý kiểm tra và tạo Blob URL xem trước cho tệp ảnh được chọn
 * Tự động hiển thị toast lỗi và giải phóng bộ nhớ của blob URL cũ
 */
export const processImageFileSelect = async (
    file: File,
    currentBlobUrl?: string,
    customConfig?: ImageValidationConfig
): Promise<ImageSelectResult | null> => {
    const result = await validateImageFile(file, customConfig);
    if (!result.isValid) {
        toast.error(result.message || 'Tệp không hợp lệ!');
        return null;
    }

    if (currentBlobUrl && currentBlobUrl.startsWith('blob:')) {
        URL.revokeObjectURL(currentBlobUrl);
    }

    const localBlobUrl = URL.createObjectURL(file);
    return { file, localBlobUrl };
};




/**
 * Kiểm tra tệp ảnh có hợp lệ về dung lượng, MIME type và Magic Bytes hay không
 * Nếu không truyền customConfig, tự động sử dụng DEFAULT_IMAGE_UPLOAD_CONFIG
 */
export const validateImageFile = async (
    file: File,
    customConfig?: ImageValidationConfig
): Promise<ImageValidationResult> => {
    if (!file) {
        return { isValid: false, message: IMAGE_VALIDATION_MESSAGES.FILE_NOT_FOUND };
    }

    const maxSizeMb =
        customConfig?.maxSizeMb ?? customConfig?.MAX_SIZE_MB ?? DEFAULT_IMAGE_UPLOAD_CONFIG.MAX_SIZE_MB;
    const acceptedTypes =
        customConfig?.acceptedTypes ?? customConfig?.ACCEPTED_TYPES ?? DEFAULT_IMAGE_UPLOAD_CONFIG.ACCEPTED_TYPES;
    const formatsText =
        customConfig?.formatsText ?? customConfig?.FORMATS_TEXT ?? DEFAULT_IMAGE_UPLOAD_CONFIG.FORMATS_TEXT;
    const checkMagicBytes = customConfig?.checkMagicBytes ?? true;


    // 1. Kiểm tra dung lượng tệp
    const isLtMax = file.size / 1024 / 1024 < maxSizeMb;
    if (!isLtMax) {
        return {
            isValid: false,
            message: IMAGE_VALIDATION_MESSAGES.SIZE_EXCEEDED(maxSizeMb),
        };
    }

    // 2. Kiểm tra MIME type nếu file.type có sẵn
    if (file.type && acceptedTypes.length > 0) {
        const isTypeAllowed = acceptedTypes.some((type) => {
            if (type.endsWith('/*')) {
                const prefix = type.replace('/*', '/');
                return file.type.startsWith(prefix);
            }
            return file.type === type;
        });

        if (!isTypeAllowed) {
            return {
                isValid: false,
                message: IMAGE_VALIDATION_MESSAGES.INVALID_TYPE(formatsText),
            };
        }
    }

    // 3. Kiểm tra Magic Bytes chống đổi đuôi tệp giả mạo
    if (checkMagicBytes && file.type.startsWith('image/')) {
        const magicCheck = await validateImageMagicBytes(file);
        if (!magicCheck.isValid) {
            return {
                isValid: false,
                message: magicCheck.message || IMAGE_VALIDATION_MESSAGES.MAGIC_BYTES_INVALID,
            };
        }
    }

    return { isValid: true };
};



/**
 * Tự động trích xuất thời lượng (tính bằng số giây) từ file Video tải lên
 * @param file Đối tượng File video đã chọn từ máy tính
 */
export const getVideoDurationFromFile = (file: File): Promise<number> => {
    return new Promise((resolve) => {
        const video = document.createElement('video');
        video.preload = 'metadata';
        video.onloadedmetadata = () => {
            window.URL.revokeObjectURL(video.src);
            const duration = Math.round(video.duration);
            resolve(Number.isNaN(duration) ? 0 : duration);
        };
        video.onerror = () => {
            resolve(0);
        };
        video.src = URL.createObjectURL(file);
    });
};



/**
 * Xử lý kiểm tra và tạo Blob URL xem trước cho tệp Video bài giảng
 * @param file Tệp video được chọn
 * @param currentBlobUrl Blob URL hiện tại (để revoke giải phóng bộ nhớ)
 * @param customConfig Cấu hình validation tùy chỉnh
 */
export const processVideoFileSelect = async (
    file: File,
    currentBlobUrl?: string,
    customConfig?: VideoValidationConfig
): Promise<VideoSelectResult | null> => {
    const result = await validateVideoFile(file, customConfig);
    if (!result.isValid) {
        toast.error(result.message || 'File video không hợp lệ!');
        return null;
    }

    if (currentBlobUrl && currentBlobUrl.startsWith('blob:')) {
        URL.revokeObjectURL(currentBlobUrl);
    }

    const localBlobUrl = URL.createObjectURL(file);
    const extractedDuration = await getVideoDurationFromFile(file);

    return {
        file,
        localBlobUrl,
        extractedDuration,
    };
};




/**
 * Kiểm tra tệp video có hợp lệ về dung lượng, MIME type và Magic Bytes hay không
 */
export const validateVideoFile = async (
    file: File,
    customConfig?: VideoValidationConfig
): Promise<VideoValidationResult> => {
    if (!file) {
        return { isValid: false, message: IMAGE_VALIDATION_MESSAGES.FILE_NOT_FOUND };
    }

    const maxSizeMb =
        customConfig?.maxSizeMb ?? customConfig?.MAX_SIZE_MB ?? DEFAULT_VIDEO_UPLOAD_CONFIG.MAX_SIZE_MB;
    const acceptedTypes =
        customConfig?.acceptedTypes ?? customConfig?.ACCEPTED_TYPES ?? DEFAULT_VIDEO_UPLOAD_CONFIG.ACCEPTED_TYPES;
    const formatsText =
        customConfig?.formatsText ?? customConfig?.FORMATS_TEXT ?? DEFAULT_VIDEO_UPLOAD_CONFIG.FORMATS_TEXT;
    const checkMagicBytes = customConfig?.checkMagicBytes ?? true;

    // 1. Kiểm tra dung lượng tệp
    const isLtMax = file.size / 1024 / 1024 < maxSizeMb;
    if (!isLtMax) {
        return {
            isValid: false,
            message: `Dung lượng file video phải nhỏ hơn ${maxSizeMb >= 1024 ? `${maxSizeMb / 1024}GB` : `${maxSizeMb}MB`}!`,
        };
    }

    // 2. Kiểm tra MIME type nếu file.type có sẵn
    if (file.type && acceptedTypes.length > 0) {
        const isTypeAllowed = acceptedTypes.some((type) => {
            if (type.endsWith('/*')) {
                const prefix = type.replace('/*', '/');
                return file.type.startsWith(prefix);
            }
            return file.type === type;
        });

        if (!isTypeAllowed) {
            return {
                isValid: false,
                message: IMAGE_VALIDATION_MESSAGES.INVALID_TYPE(formatsText),
            };
        }
    }

    // 3. Kiểm tra Magic Bytes chống đổi đuôi tệp giả mạo
    if (checkMagicBytes) {
        const magicCheck = await validateVideoMagicBytes(file);
        if (!magicCheck.isValid) {
            return {
                isValid: false,
                message: magicCheck.message || 'File video không đúng định dạng cho phép!',
            };
        }
    }

    return { isValid: true };
};



/**
 * Utility kiểm tra Magic Bytes (Header Byte) của tệp để chống đổi đuôi tệp giả mạo
 */

/**
 * Kiểm tra file có phải là Video MP4 / MOV chuẩn hay không (kiểm tra hộp `ftyp` ở byte 4-8)
 */
export async function validateVideoMagicBytes(file: File): Promise<{ isValid: boolean; format?: string; message?: string }> {
    if (!file) {
        return { isValid: false, message: 'Tệp không tồn tại' };
    }

    // Đọc 12 byte đầu tiên của file
    const blobSlice = file.slice(0, 12);

    return new Promise((resolve) => {
        const reader = new FileReader();

        reader.onloadend = (event) => {
            if (!event.target || event.target.readyState !== FileReader.DONE) {
                return resolve({ isValid: false, message: 'Không thể đọc dữ liệu tệp' });
            }

            const buffer = event.target.result as ArrayBuffer;
            if (!buffer || buffer.byteLength < 8) {
                return resolve({ isValid: false, message: 'Dữ liệu tệp quá ngắn hoặc bị hỏng' });
            }

            const view = new DataView(buffer);

            // Đọc 4 byte tại vị trí index 4 để kiểm tra ký tự "ftyp" (ASCII: f=102, t=116, y=121, p=112)
            const ftypString = String.fromCharCode(
                view.getUint8(4),
                view.getUint8(5),
                view.getUint8(6),
                view.getUint8(7)
            );

            if (ftypString !== 'ftyp') {
                return resolve({
                    isValid: false,
                    message: 'Tệp video không đúng định dạng cho phép',
                });
            }

            // Đọc Major Brand ở vị trí 8-12 nếu đủ 12 bytes
            let majorBrand = '';
            if (buffer.byteLength >= 12) {
                majorBrand = String.fromCharCode(
                    view.getUint8(8),
                    view.getUint8(9),
                    view.getUint8(10),
                    view.getUint8(11)
                ).trim();
            }

            return resolve({
                isValid: true,
                format: `MP4 (${majorBrand || 'ftyp'})`,
            });
        };

        reader.onerror = () => {
            resolve({ isValid: false, message: 'Lỗi khi đọc header của tệp' });
        };

        reader.readAsArrayBuffer(blobSlice);
    });
}

/**
 * Kiểm tra file có phải là Ảnh Thumbnail hợp lệ (PNG, JPEG, WEBP) hay không
 */
export async function validateImageMagicBytes(file: File): Promise<{ isValid: boolean; format?: string; message?: string }> {
    if (!file) {
        return { isValid: false, message: 'Tệp không tồn tại' };
    }

    const blobSlice = file.slice(0, 12);

    return new Promise((resolve) => {
        const reader = new FileReader();

        reader.onloadend = (event) => {
            if (!event.target || event.target.readyState !== FileReader.DONE) {
                return resolve({ isValid: false, message: 'Không thể đọc dữ liệu tệp' });
            }

            const buffer = event.target.result as ArrayBuffer;
            if (!buffer || buffer.byteLength < 4) {
                return resolve({ isValid: false, message: 'Dữ liệu ảnh quá ngắn' });
            }

            const bytes = new Uint8Array(buffer);

            // PNG: 89 50 4E 47
            if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) {
                return resolve({ isValid: true, format: 'PNG' });
            }

            // JPEG/JPG: FF D8 FF
            if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
                return resolve({ isValid: true, format: 'JPEG' });
            }

            // WEBP: RIFF...WEBP
            if (bytes.length >= 12) {
                const riff = String.fromCharCode(bytes[0], bytes[1], bytes[2], bytes[3]);
                const webp = String.fromCharCode(bytes[8], bytes[9], bytes[10], bytes[11]);
                if (riff === 'RIFF' && webp === 'WEBP') {
                    return resolve({ isValid: true, format: 'WEBP' });
                }
            }

            return resolve({
                isValid: false,
                message: 'Định dạng ảnh không hỗ trợ. Chỉ chấp nhận PNG, JPEG, WEBP!',
            });
        };

        reader.onerror = () => {
            resolve({ isValid: false, message: 'Lỗi khi đọc header của tệp ảnh' });
        };

        reader.readAsArrayBuffer(blobSlice);
    });
}
