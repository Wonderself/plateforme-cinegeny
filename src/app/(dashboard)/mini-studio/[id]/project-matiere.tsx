'use client'

import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { FileUpload } from '@/components/file-upload'
import {
  FileText, Image as ImageIcon, Music, Folder, FolderOpen,
  Trash2, ExternalLink, Loader2,
} from 'lucide-react'
import { addProjectFileAction, removeProjectFileAction, getProjectFilesAction } from '@/app/actions/project-files'

type ProjectFile = Awaited<ReturnType<typeof getProjectFilesAction>>[number]
type Folder = 'SCRIPT' | 'VISUALS' | 'AUDIO' | 'DOCS' | 'OTHER'

const FOLDERS: {
  id: Folder
  label: string
  desc: string
  icon: typeof FileText
  category: 'document' | 'image' | 'audio'
}[] = [
  { id: 'SCRIPT', label: 'Script', desc: 'Scénario, notes d’intention, dialogues', icon: FileText, category: 'document' },
  { id: 'VISUALS', label: 'Visuels', desc: 'Références, moodboard, storyboard', icon: ImageIcon, category: 'image' },
  { id: 'AUDIO', label: 'Sons', desc: 'Musiques, voix, ambiances', icon: Music, category: 'audio' },
  { id: 'DOCS', label: 'Documents', desc: 'Contrats, budget, docs de prod', icon: Folder, category: 'document' },
  { id: 'OTHER', label: 'Divers', desc: 'Tout le reste', icon: Folder, category: 'document' },
]

function humanSize(bytes: number | null): string {
  if (!bytes) return ''
  if (bytes < 1024) return `${bytes} o`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} Ko`
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`
}

export function ProjectMatiere({
  projectId,
  initialFiles,
}: {
  projectId: string
  initialFiles: ProjectFile[]
}) {
  const [files, setFiles] = useState<ProjectFile[]>(initialFiles)
  const [active, setActive] = useState<Folder>('SCRIPT')
  const [isPending, startTransition] = useTransition()

  const activeConfig = FOLDERS.find((f) => f.id === active)!

  function handleUploaded(
    url: string,
    fileKey: string,
    meta?: { fileName: string; mimeType: string; sizeBytes: number },
  ) {
    const name = meta?.fileName ?? decodeURIComponent(url.split('/').pop() ?? 'fichier')
    startTransition(async () => {
      const res = await addProjectFileAction({
        projectId,
        folder: active,
        name,
        url,
        fileKey,
        mimeType: meta?.mimeType,
        sizeBytes: meta?.sizeBytes,
      })
      if (res.success) {
        toast.success('Fichier ajouté à la matière')
        const fresh = await getProjectFilesAction(projectId)
        setFiles(fresh)
      } else {
        toast.error(res.error ?? 'Échec de l’ajout')
      }
    })
  }

  function handleRemove(id: string) {
    startTransition(async () => {
      const res = await removeProjectFileAction(id)
      if (res.success) {
        toast.success('Fichier retiré')
        setFiles((f) => f.filter((x) => x.id !== id))
      } else {
        toast.error(res.error ?? 'Échec de la suppression')
      }
    })
  }

  const filesInFolder = files.filter((f) => f.folder === active)

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
      <div className="flex items-center gap-3 p-5 border-b border-white/10">
        <div className="h-8 w-8 rounded-lg flex items-center justify-center bg-[#C9A227]/10">
          <FolderOpen className="h-4 w-4 text-[#C9A227]" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-white">Matière &amp; références</h2>
          <p className="text-xs text-white/40">
            Vos documents de référence, rangés par sous-dossier — utilisés par le studio et la fabrique de docs.
          </p>
        </div>
      </div>

      {/* Sous-dossiers */}
      <div className="flex flex-wrap gap-2 p-4 border-b border-white/10">
        {FOLDERS.map((f) => {
          const Icon = f.icon
          const count = files.filter((x) => x.folder === f.id).length
          const isActive = f.id === active
          return (
            <button
              key={f.id}
              onClick={() => setActive(f.id)}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                isActive
                  ? 'bg-[#C9A227] text-black'
                  : 'bg-white/[0.04] text-white/60 hover:bg-white/[0.08] hover:text-white'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {f.label}
              {count > 0 && (
                <span className={`ml-0.5 rounded-full px-1.5 text-[10px] ${isActive ? 'bg-black/20' : 'bg-white/10'}`}>
                  {count}
                </span>
              )}
            </button>
          )
        })}
      </div>

      <div className="p-5 space-y-4">
        <p className="text-xs text-white/40">{activeConfig.desc}</p>

        {/* Upload dans le sous-dossier actif */}
        <FileUpload
          category={activeConfig.category}
          onUploaded={handleUploaded}
          label={`Ajouter un fichier — ${activeConfig.label}`}
        />

        {/* Liste des fichiers du sous-dossier */}
        {isPending && (
          <div className="flex items-center gap-2 text-xs text-white/40">
            <Loader2 className="h-3.5 w-3.5 animate-spin" /> Mise à jour…
          </div>
        )}
        {filesInFolder.length === 0 ? (
          <p className="text-sm text-white/30 py-2">Aucun fichier dans ce sous-dossier.</p>
        ) : (
          <div className="space-y-2">
            {filesInFolder.map((file) => (
              <div
                key={file.id}
                className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-2.5"
              >
                <FileText className="h-4 w-4 text-[#C9A227]/70 shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-white truncate">{file.name}</p>
                  {file.sizeBytes ? (
                    <p className="text-[11px] text-white/35">{humanSize(file.sizeBytes)}</p>
                  ) : null}
                </div>
                <a
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg p-2 text-white/40 transition-colors hover:bg-white/10 hover:text-white"
                  aria-label="Ouvrir"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
                <button
                  onClick={() => handleRemove(file.id)}
                  disabled={isPending}
                  className="rounded-lg p-2 text-white/40 transition-colors hover:bg-red-500/10 hover:text-red-400 disabled:opacity-50"
                  aria-label="Retirer"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
