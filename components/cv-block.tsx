"use client";

import { useMemo, useRef, useState, useSyncExternalStore } from "react";

import { Button } from "@/components/ui/button";
import {
  readSerializedCv,
  removeCv,
  saveCv,
  subscribeToStoredCv,
  type StoredCv,
} from "@/lib/cv-storage";
import { readCvFile } from "@/lib/read-cv-file";

export function useStoredCv() {
  const serializedCv = useSyncExternalStore(
    subscribeToStoredCv,
    readSerializedCv,
    () => null,
  );
  return useMemo<StoredCv | null>(
    () => (serializedCv ? JSON.parse(serializedCv) : null),
    [serializedCv],
  );
}

export function CvBlock({ disabled = false }: { disabled?: boolean }) {
  const cv = useStoredCv();
  const fileInput = useRef<HTMLInputElement>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFileChosen(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setError(null);
    setIsExtracting(true);
    const reading = await readCvFile(file);
    setIsExtracting(false);

    if ("error" in reading) {
      setError(reading.error);
      return;
    }
    saveCv({
      text: reading.text,
      fileName: file.name,
      uploadedAt: new Date().toISOString(),
    });
  }

  return (
    <div className="flex flex-col gap-3">
      {cv ? (
        <div className="flex flex-col gap-1">
          <p className="font-medium">CV em uso: {cv.fileName}</p>
          <p className="text-muted-foreground">
            Carregado em {new Date(cv.uploadedAt).toLocaleString("pt-PT")}
          </p>
          <details>
            <summary className="cursor-pointer">
              Pré-visualizar o texto extraído
            </summary>
            <pre className="mt-2 max-h-64 overflow-auto rounded-lg bg-muted p-3 font-sans whitespace-pre-wrap">
              {cv.text}
            </pre>
          </details>
        </div>
      ) : (
        <p className="text-muted-foreground">Ainda não há CV carregado.</p>
      )}

      <input
        ref={fileInput}
        type="file"
        accept=".pdf"
        className="hidden"
        onChange={handleFileChosen}
      />
      <div className="flex gap-2">
        <Button
          disabled={disabled || isExtracting}
          onClick={() => fileInput.current?.click()}
        >
          Escolher ficheiro
        </Button>
        {cv && (
          <Button
            variant="outline"
            disabled={disabled || isExtracting}
            onClick={removeCv}
          >
            Remover
          </Button>
        )}
      </div>

      {isExtracting && <p role="status">A extrair o texto do PDF…</p>}
      {error && (
        <p role="alert" className="text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
