'use client';

import { Uppy, UppyFile, UploadSuccessCallback } from '@uppy/core';
import AWSS3 from '@uppy/aws-s3';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useUppyState } from './useUppyState';
import { trpcClientReact, trpcPureClient } from '@/utils/api';
import { Button } from '@/components/Button';
import { UploadButton } from '@/components/feature/UploadButton';

export default function Home() {
  const [uppy] = useState(() => {
    const uppy = new Uppy();
    uppy.use(AWSS3, {
      shouldUseMultipart: false,
      getUploadParameters(file) {
        return trpcPureClient.file.createPresignedUrl.mutate({
          filename: file.data instanceof File ? file.data.name : 'test',
          contentType: file.data.type || '',
          size: file.size,
        });
      },
    });
    return uppy;
  });

  const files = useUppyState(uppy, (s) => Object.values(s.files));
  const progress = useUppyState(uppy, (s) => s.totalProgress);

  useEffect(() => {
    const handler: UploadSuccessCallback<{}> = (file, resp) => {
      if (file) {
        trpcPureClient.file.saveFile.mutate({
          name: file.data instanceof File ? file.data.name : 'test',
          path: resp.uploadURL ?? '',
          type: file.data.type,
        });
      }
    };
    uppy.on('upload-success', handler);

    return () => {
      uppy.off('upload-success', handler);
    };
  }, [uppy]);

  const { data: fileList, isPending } = trpcClientReact.file.listFiles.useQuery();

  return (
    <div className="container mx-auto">
      <div>
        <UploadButton uppy={uppy}></UploadButton>
        <Button
          onClick={() => {
            uppy.upload();
          }}
        >
          Upload
        </Button>
      </div>
      <div>{progress}</div>
      {isPending && <div>Loading...</div>}
      <div className="flex flex-wrap gap-4">
        {fileList?.map((file) => {
          const isImag = file.contentType.startsWith('image/');
          return (
            <div key={file.id} className="w-56 h-56 flex justify-center items-center border">
              {isImag ? (
                <img
                  className="max-w-full max-h-full object-contain"
                  src={file.url}
                  alt={file.name}
                ></img>
              ) : (
                <Image
                  src="/unknown-file-types.png"
                  alt="unknown file types"
                  width={100}
                  height={100}
                ></Image>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
