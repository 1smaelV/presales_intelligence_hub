
/**
 * Reads the content of a file as text.
 * Currently supports: .txt, .md, .json, .csv
 * 
 * @param file The file object to read
 * @returns A promise that resolves with the file content as a string
 */
export const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (event) => {
            if (event.target?.result) {
                resolve(event.target.result as string);
            } else {
                reject(new Error("Failed to read file"));
            }
        };

        reader.onerror = (error) => reject(error);

        // For now, we assume text files. 
        // In the future, we might need specific handling for PDFs (using pdfjs-dist)
        reader.readAsText(file);
    });
};

/**
 * Validates if the file type is supported.
 */
export const isSupportedFileType = (file: File): boolean => {
    const supportedTypes = [
        'text/plain',
        'text/markdown',
        'application/json',
        'text/csv',
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];
    // Also check extensions because mime types can be unreliable or empty
    const supportedExtensions = ['.txt', '.md', '.json', '.csv', '.pdf', '.docx', '.pptx', '.xlsx'];

    return supportedTypes.includes(file.type) ||
        supportedExtensions.some(ext => file.name.toLowerCase().endsWith(ext));
};
