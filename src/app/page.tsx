'use client';

import { useEffect, useState } from 'react';
import { Uppy } from '@uppy/core';
import AWSS3 from '@uppy/aws-s3';
import { useUppyState } from '@/hooks/useUppyState';
import { trpcClient } from '@/utils/client';
import { Button } from '@/components/ui/button';

function getDateFolder() {
  const date = new Date();
  const year = String(date.getFullYear()).slice(-2);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');

  return `${year}${day}${month}`;
}

function ImagePreview({ file }: { file: any }) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    const fileType = file.type || file.data?.type;
    const isImage =
      fileType?.startsWith('image/') || /\.(avif|gif|jpeg|jpg|png|svg|webp)$/i.test(file.name);

    if (!isImage || !file.data) return;

    const reader = new FileReader();
    reader.onload = () => setPreviewUrl(typeof reader.result === 'string' ? reader.result : null);
    reader.onerror = () => setPreviewUrl(null);
    reader.readAsDataURL(file.data);

    return () => reader.abort();
  }, [file.data, file.name, file.type]);

  if (!previewUrl) return null;

  return (
    <a href={previewUrl} target="_blank" rel="noreferrer" title="点击查看原图">
      <img
        src={previewUrl}
        alt={file.name ?? '图片预览'}
        className="h-16 w-16 rounded object-cover transition hover:opacity-80"
      />
    </a>
  );
}

export default function Home() {
  const [uppy] = useState(() => {
    const uppy = new Uppy();
    uppy.use(AWSS3, {
      shouldUseMultipart: false,
      generateObjectKey: (file) => `${getDateFolder()}/${crypto.randomUUID()}-${file.name}`,
      signRequest: ({ method, key }) => {
        if (method !== 'PUT') {
          throw new Error(`COS simple upload does not support ${method}`);
        }

        return trpcClient.file.signUploadUrl.mutate({ method, key }).then(({ url }) => ({ url }));
      },
    });
    return uppy;
  });

  const files = useUppyState(uppy, (state) => Object.values(state.files));

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-slate-50 px-4 py-10">
      <input
        id="file-upload"
        type="file"
        multiple
        className="sr-only"
        onChange={(e) => {
          if (e.target.files) {
            Array.from(e.target.files).forEach((file) => {
              try {
                uppy.addFile({
                  name: file.name,
                  type: file.type,
                  data: file,
                });
              } catch (error) {
                if (!(error instanceof Error && error.message.includes('duplicate file'))) {
                  throw error;
                }
              }
            });
            e.target.value = '';
          }
        }}
      />
      <label
        htmlFor="file-upload"
        className="flex w-full max-w-xl cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-blue-400 bg-white px-8 py-14 text-center shadow-sm transition hover:border-blue-600 hover:bg-blue-50 focus-within:ring-4 focus-within:ring-blue-200"
      >
        <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-3xl text-blue-700">
          ↑
        </span>
        <span className="text-lg font-semibold text-slate-900">选择图片上传</span>
        <span className="mt-2 text-sm text-slate-500">点击此处选择一个或多个图片文件</span>
      </label>
      <div className="flex flex-col gap-4">
        {files.map((file: any) => {
          const percentage = Math.round(file.progress?.percentage ?? 0);
          const responseStatus = file.response?.status;
          const isUploading = file.progress?.uploadStarted && !file.progress?.uploadComplete;
          const status = file.error
            ? `上传失败${responseStatus ? `（HTTP ${responseStatus}）` : ''}：${file.error}`
            : file.progress?.uploadComplete
            ? '上传完成'
            : file.progress?.uploadStarted
            ? `上传中 ${percentage}%`
            : '等待上传';

          return (
            <div key={file.id} className="w-80">
              <div className="flex items-center gap-3">
                <ImagePreview file={file} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-4">
                    <span className="truncate">{file.name}</span>
                    <span className="shrink-0 text-sm">{percentage}%</span>
                  </div>
                  <div className="mt-1 h-2 overflow-hidden rounded bg-gray-200">
                    <div
                      className="h-full bg-blue-600 transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <p className="mt-1 text-sm text-gray-600">{status}</p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className="shrink-0"
                  onClick={() => {
                    uppy.removeFile(file.id);
                  }}
                >
                  {isUploading ? '取消' : '删除'}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
      <Button
        onClick={() => {
          uppy.upload();
        }}
      >
        Upload
      </Button>
    </div>
  );
}
