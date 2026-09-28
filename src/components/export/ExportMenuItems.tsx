import { FileCode2, Image } from 'lucide-react'

import {
  DropdownMenuItem,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu-item'

interface ExportMenuItemsProps {
  onExportBpmn: () => void
  onExportSvg: () => void
  onExportPng: () => void
}

export function ExportMenuItems({
  onExportBpmn,
  onExportSvg,
  onExportPng,
}: Readonly<ExportMenuItemsProps>) {
  return (
    <>
      <DropdownMenuLabel>Exportar como</DropdownMenuLabel>
      <DropdownMenuItem onSelect={onExportBpmn}>
        <FileCode2 /> Arquivo .bpmn
      </DropdownMenuItem>
      <DropdownMenuItem onSelect={onExportSvg}>
        <Image /> Imagem SVG
      </DropdownMenuItem>
      <DropdownMenuItem onSelect={onExportPng}>
        <Image /> Imagem PNG
      </DropdownMenuItem>
    </>
  )
}
