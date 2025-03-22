"use client";

import { useQuery } from "@tanstack/react-query";
import DropboxImage from "./dropbox-image"; // 올바른 경로로 import
import { searchFiles } from "actions/storageActions";
import { Spinner } from "@material-tailwind/react";

// Spinner 컴포넌트 props 타입 에러 해결
const spinnerProps: any = {};

// 컴포넌트 Props 타입 정의
interface DropboxImageListProps {
  searchInput: string;
}

export default function DropboxImageList({
  searchInput,
}: DropboxImageListProps) {
  const searchImagesQuery = useQuery({
    queryKey: ["images", searchInput],
    queryFn: () => searchFiles(searchInput),
  });

  return (
    <section className="grid md:grid-cols-3 lg:grid-cols-4 grid-cols-2 gap-4">
      {searchImagesQuery.isLoading && <Spinner {...spinnerProps} />}

      {searchImagesQuery.data &&
        searchImagesQuery.data.map((image) => {
          // 필수 데이터가 없는 경우 건너뛰기
          if (!image?.id || !image?.name) {
            console.warn("Image with missing data:", image);
            return null;
          }

          return (
            <DropboxImage
              key={image.id}
              image={image} // image prop으로 전달 (dropbox-image.tsx의 기대와 일치)
            />
          );
        })}

      {/* 데이터가 없을 때 표시할 내용 */}
      {searchImagesQuery.data?.length === 0 && (
        <div className="col-span-full text-center py-10">
          검색 결과가 없습니다.
        </div>
      )}
    </section>
  );
}
