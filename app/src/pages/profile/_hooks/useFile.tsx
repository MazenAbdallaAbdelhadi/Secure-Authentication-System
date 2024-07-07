import { ChangeEvent, useState } from "react";

const useFile = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const image = e.target.files[0];
      setSelectedFile(image);
    }
  };

  return { selectedFile, handleFileChange };
};

export default useFile;
