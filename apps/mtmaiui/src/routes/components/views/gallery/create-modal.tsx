import { Code, Globe, Upload as UploadIcon } from "lucide-react";
import { MonacoEditor } from "mtxuilib/mt/monaco";
import { Button } from "mtxuilib/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "mtxuilib/ui/dialog";
import { Input } from "mtxuilib/ui/input";
import type React from "react";
import { useRef, useState } from "react";
import type { Gallery } from "./types";
interface GalleryCreateModalProps {
  open: boolean;
  onCancel: () => void;
  onCreateGallery: (gallery: Gallery) => void;
}

export const GalleryCreateModal: React.FC<GalleryCreateModalProps> = ({
  open,
  onCancel,
  onCreateGallery,
}) => {
  const [activeTab, setActiveTab] = useState("url");
  const [url, setUrl] = useState("");
  const [jsonContent, setJsonContent] = useState(
    JSON.stringify(defaultGallery, null, 2),
  );
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const editorRef = useRef(null);

  const handleUrlImport = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch(url);
      const data = await response.json();
      // TODO: Validate against Gallery schema
      onCreateGallery(data);
      onCancel();
    } catch (err) {
      setError("Failed to fetch or parse gallery from URL");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (info: { file: UploadFile }) => {
    const { status, originFileObj } = info.file;
    if (status === "done" && originFileObj instanceof File) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        try {
          const content = JSON.parse(e.target?.result as string);
          // TODO: Validate against Gallery schema
          onCreateGallery(content);
          onCancel();
        } catch (err) {
          setError("Invalid JSON file");
        }
      };
      reader.readAsText(originFileObj);
    } else if (status === "error") {
      setError("File upload failed");
    }
  };

  const handlePasteImport = () => {
    try {
      const content = JSON.parse(jsonContent);
      // TODO: Validate against Gallery schema
      onCreateGallery(content);
      onCancel();
    } catch (err) {
      setError("Invalid JSON format");
    }
  };

  const uploadProps: UploadProps = {
    accept: ".json",
    showUploadList: false,
    customRequest: ({ file, onSuccess }) => {
      setTimeout(() => {
        onSuccess && onSuccess("ok");
      }, 0);
    },
    onChange: handleFileUpload,
  };

  const inputRef = useRef<InputRef>(null);

  const items = [
    {
      key: "url",
      label: (
        <span className="flex items-center gap-2">
          <Globe className="size-4" /> URL Import
        </span>
      ),
      children: (
        <div className="space-y-4">
          <Input
            ref={inputRef}
            placeholder="Enter gallery URL..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <div className="text-xs">
            Sample
            <a
              role="button"
              onClick={(e) => {
                setUrl(
                  "https://raw.githubusercontent.com/victordibia/multiagent-systems-with-autogen/refs/heads/main/research/components/gallery/base.json",
                );
                e.preventDefault();
              }}
              href="https://raw.githubusercontent.com/victordibia/multiagent-systems-with-autogen/refs/heads/main/research/components/gallery/base.json"
              target="_blank"
              rel="noreferrer"
              className="text-accent"
            >
              {" "}
              gallery.json{" "}
            </a>
          </div>
          <Button
            type="primary"
            onClick={handleUrlImport}
            disabled={!url || isLoading}
            block
          >
            Import from URL
          </Button>
        </div>
      ),
    },
    {
      key: "file",
      label: (
        <span className="flex items-center gap-2">
          <UploadIcon className="size-4" /> File Upload
        </span>
      ),
      children: (
        <div className="border-2 border-dashed rounded-lg p-8 text-center space-y-4">
          {/* <Upload.Dragger {...uploadProps}>
            <p className="ant-upload-drag-icon">
              <UploadIcon className="w-8 h-8 mx-auto  " />
            </p>
            <p className="ant-upload-text">
              Click or drag JSON file to this area
            </p>
          </Upload.Dragger> */}
          TODO: 上传
        </div>
      ),
    },
    {
      key: "paste",
      label: (
        <span className="flex items-center gap-2">
          <Code className="size-4" /> Paste JSON
        </span>
      ),
      children: (
        <div className="space-y-4">
          <div className="h-64">
            <MonacoEditor
              value={jsonContent}
              onChange={setJsonContent}
              editorRef={editorRef}
              language="json"
              minimap={false}
            />
          </div>
          <Button type="primary" onClick={handlePasteImport} block>
            Import JSON
          </Button>
        </div>
      ),
    },
  ];

  return (
    <Dialog
      open={open}
      // onCancel={onCancel}
      // width={800}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Gallery</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          {/* <Tabs activeKey={activeTab} onChange={setActiveTab} items={items} /> */}

          {/* {error && (
          <Alert message={error} type="error" showIcon className="mt-4" />
        )} */}
        </div>
      </DialogContent>
    </Dialog>
  );
};

// export default GalleryCreateModal;
