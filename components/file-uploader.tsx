"use client";

import React, { Dispatch, SetStateAction, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Input } from './ui/input';
import { useTheme } from 'next-themes';
import { ScrollArea } from './ui/scroll-area';
import { X } from 'lucide-react';

interface FileUploaderProps {
    setSelectedFiles: Dispatch<SetStateAction<File[]>>;
    selectedFiles: File[]
}

const FileUploader: React.FC<FileUploaderProps> = ({
    setSelectedFiles,
    selectedFiles
}) => {

    const { theme } = useTheme();
    const onDrop = useCallback((acceptedFiles: File[]) => {
        setSelectedFiles(acceptedFiles);
    }, [setSelectedFiles]);

    const onDeleteFile = (index: number) => {
        const updatedFiles = [...selectedFiles];
        updatedFiles.splice(index, 1);
        setSelectedFiles(updatedFiles);
    }

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    return (
        <div className='flex items-center'>
            <div className={`${selectedFiles.length !== 0 ? 'w-1/2' : 'w-full'} ${isDragActive && ' border-green-500'} border-2 border-dashed rounded-md text-center cursor-pointer`}>
                <div {...getRootProps()} className={`${theme === 'dark' ? 'hover:bg-[#1e293b]' : 'hover:bg-[#f1f5f9]'} p-5 m-2 rounded-md transition`}>
                    <Input {...getInputProps()} />
                    <p className={`${isDragActive ? ' text-green-500' : 'text-gray-500'} text-xs`}>{isDragActive ? 'Drop the files here' : 'Drag and drop files here, or click to select files'}</p>
                </div>
            </div>
            {selectedFiles.length !== 0
                &&
                <>
                    <svg className='text-gray-500 mx-4' width="20" height="20" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.14645 11.1464C1.95118 11.3417 1.95118 11.6583 2.14645 11.8536C2.34171 12.0488 2.65829 12.0488 2.85355 11.8536L6.85355 7.85355C7.04882 7.65829 7.04882 7.34171 6.85355 7.14645L2.85355 3.14645C2.65829 2.95118 2.34171 2.95118 2.14645 3.14645C1.95118 3.34171 1.95118 3.65829 2.14645 3.85355L5.79289 7.5L2.14645 11.1464ZM8.14645 11.1464C7.95118 11.3417 7.95118 11.6583 8.14645 11.8536C8.34171 12.0488 8.65829 12.0488 8.85355 11.8536L12.8536 7.85355C13.0488 7.65829 13.0488 7.34171 12.8536 7.14645L8.85355 3.14645C8.65829 2.95118 8.34171 2.95118 8.14645 3.14645C7.95118 3.34171 7.95118 3.65829 8.14645 3.85355L11.7929 7.5L8.14645 11.1464Z" fill="currentColor"></path>
                    </svg>
                    <ScrollArea className='flex flex-col justify-center items-center text-sm w-[180px] max-h-[90px]'>
                        {selectedFiles.map((item, index) => (
                            <div key={index} className='flex justify-between items-center px-2'>
                                <div key={index} className='flex flex-wrap max-w-[140px] text-xs py-2'>
                                    {item.name}
                                </div>
                                <X onClick={() => onDeleteFile(index)} className='h-4 w-4 cursor-pointer hover:scale-110 transition' />
                            </div>
                        ))}
                    </ScrollArea>
                </>
            }
        </div>
    );
};

export default FileUploader;
