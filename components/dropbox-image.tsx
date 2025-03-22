"use client";

import { IconButton, Spinner } from "@material-tailwind/react"; // Spinner 추가
import { useMutation } from "@tanstack/react-query";
import { deleteFile } from "actions/storageActions";
import { queryClient } from "config/ReactQueryClientProvider";
import { getImageUrl } from "utils/supabase/storage";

// 타입 정의 추가
interface DropboxImageProps {
  image: {
    id: string;
    name: string;
    fullPath?: string;
    // 기타 필요한 속성들
  };
}

export default function DropboxImage({ image }: DropboxImageProps) {
  const deleteFileMutation = useMutation({
    mutationFn: deleteFile,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["images"],
      });
    },
  });

  // Spinner의 props를 any 타입으로 정의하여 타입 에러 방지
  const spinnerProps: any = {
    className: "h-4 w-4" // 크기 조정 (필요에 따라 조정)
  };

  // IconButton의 props를 any 타입으로 정의하여 타입 에러 해결
  // loading 속성 제거 - 이 속성이 경고를 발생시키는 원인
  const iconButtonProps: any = {
    onClick: () => {
      deleteFileMutation.mutate(image.name);
    },
    color: "red",
    // 조건부 렌더링으로 children 설정 - 여기서 로딩 상태를 처리
    children: deleteFileMutation.isPending ? (
      <Spinner {...spinnerProps} />
    ) : (
      <i className="fas fa-trash" />
    )
  };

  // 이미지 URL 생성 시 오류 처리 추가
  let imageUrl;
  try {
    imageUrl = getImageUrl(image.name);
  } catch (error) {
    console.error("Error generating image URL:", error);
    imageUrl = "/images/placeholder.jpg"; // 기본 이미지
  }

  return (
    <div className="relative w-full flex flex-col gap-2 p-4 border border-gray-100 rounded-2xl shadow-md">
      {/* Image */}
      <div>
        <img
          src={imageUrl}
          alt={image.name}
          className="w-full aspect-square rounded-2xl object-cover"
          onError={(e) => {
            // 이미지 로드 실패 시 기본 이미지로 대체
            e.currentTarget.src = "/images/placeholder.jpg";
          }}
        />
      </div>

      {/* FileName */}
      <div className="truncate text-sm">{image.name}</div>

      <div className="absolute top-4 right-4">
        <IconButton {...iconButtonProps} />
      </div>
    </div>
  );
}